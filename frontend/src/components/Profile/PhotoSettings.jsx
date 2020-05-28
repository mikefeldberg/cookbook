import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormFile from 'react-bootstrap/FormFile';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

import { CREATE_USER_PHOTO_MUTATION, DELETE_USER_PHOTO_MUTATION, PROFILE_QUERY } from '../../queries/queries';
import { AuthContext } from '../../App';

const MAX_FILE_SIZE = 2097152;

const PhotoSettings = ({ profile }) => {
    const currentUser = useContext(AuthContext);
    const [existingPhotoUrl, setExistingPhotoUrl] = useState(profile.photos.length > 0 ? profile.photos[0].url : null);
    const [userPhotoId, setUserPhotoId] = useState(profile.photos.length > 0 ? profile.photos[0].id : null);
    const [deleteExistingPhoto, setDeleteExistingPhoto] = useState(false);

    const [createUserPhoto] = useMutation(CREATE_USER_PHOTO_MUTATION, {
        update(cache, { data: { createUserPhoto } }) {
            setUserPhotoId(createUserPhoto.userPhoto.id)
            const userId = createUserPhoto.userPhoto.user.id;
            const data = cache.readQuery({ query: PROFILE_QUERY, variables: { id: userId } });
            const photos = data.profile.photos
            photos.unshift({
                id: createUserPhoto.userPhoto.id,
                url: createUserPhoto.userPhoto.url,
                __typename: 'UserPhotoType'
            });

            cache.writeQuery({
                query: PROFILE_QUERY,
                data: { photos },
            });
        }
    });

    const [deleteUserPhoto] = useMutation(DELETE_USER_PHOTO_MUTATION);
    const [photoSource, setPhotoSource] = useState('upload');
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileExtension, setFileExtension] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [photoStatus, setPhotoStatus] = useState('')

    const handlePhotoUrlInput = (e) => {
        setNewPhotoUrl(e.target.value);
        setPhotoStatus('');
        if (existingPhotoUrl) {
            setDeleteExistingPhoto(true)
        }
    };

    const getFile = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            if (files[0].size > MAX_FILE_SIZE) {
                setFile(null);
                setFileName('');
                setFileExtension('');
                setFileSize(e.target.files[0].size);
            }
            if (files[0].size <= MAX_FILE_SIZE) {
                const newFile = files[0];
                setFile({ newFile });
                setFileName(e.target.value.split('\\')[e.target.value.split('\\').length - 1]);
                setFileExtension(e.target.value.split('.')[e.target.value.split('.').length - 1]);
                setFileSize(e.target.files[0].size);
            }
            setPhotoStatus('');
            if (existingPhotoUrl) {
                setDeleteExistingPhoto(true)
            }
        }
    };

    const formatFileSize = (fileSize) => {
        if (fileSize < 1024) {
            return fileSize + 'bytes';
        } else if (fileSize >= 1024 && fileSize < 1048576) {
            return (fileSize / 1024).toFixed(1) + 'KB';
        } else if (fileSize >= 1048576) {
            return (fileSize / 1048576).toFixed(1) + 'MB';
        }
    };

    const handleCancel = () => {
        setDeleteExistingPhoto(false);
        setFile(null);
        setFileName('');
        setFileSize('');
        setNewPhotoUrl('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file && !newPhotoUrl && deleteExistingPhoto) {
            handleDeletePhoto(deleteUserPhoto);
        } else {
            if (file && photoSource === 'upload') {
                handleUpload(currentUser, createUserPhoto);
            }
            if (newPhotoUrl && photoSource === 'link') {
                handleCreateLinkedPhoto(currentUser, createUserPhoto);
            }
        }
    };

    const handleUpload = async (currentUser, createUserPhoto) => {
        const presignedPostData = await getPresignedPostData();
        uploadFileToS3(presignedPostData, file.newFile);
        const url = presignedPostData.url + presignedPostData.fields.key;
        const userPhoto = {
            url,
            userId: currentUser.id,
        };

        await createUserPhoto({ variables: { userPhoto } });
        handleSuccessfulUpdate();
    };

    const getPresignedPostData = async () => {
        const response = await fetch(`/api/upload/${fileExtension}`);
        const json = await response.json();
        return json;
    };

    const uploadFileToS3 = (presignedPostData, file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            Object.keys(presignedPostData.fields).forEach((key) => {
                formData.append(key, presignedPostData.fields[key]);
            });

            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', presignedPostData.url, true);
            xhr.send(formData);
            xhr.onload = function () {
                this.status === 204 ? resolve() : reject(this.responseText);
            };
        });
    };

    const handleCreateLinkedPhoto = async (currentUser, createUserPhoto) => {
        const userPhoto = {
            userId: currentUser.id,
            url: newPhotoUrl,
        };
        await createUserPhoto({ variables: { userPhoto } });
        handleSuccessfulUpdate();
    };

    const handleSuccessfulUpdate = () => {
        setPhotoStatus('saved successfully');
        setNewPhotoUrl('');
        setFile(null);
        setFileName('');
        setFileExtension('');
        setFileSize('');
        if (existingPhotoUrl) {
            handleDeletePhoto(deleteUserPhoto);
        }
    };

    const handleDeletePhoto = async (deleteUserPhoto) => {
        await deleteUserPhoto({ variables: { userPhotoId } });
        if (!photoStatus.length > 0) {
            setPhotoStatus('deleted successfully');
            setExistingPhotoUrl(null);
            setDeleteExistingPhoto(false);
        }
    };

    return (
        <>
            <Form className="mx-auto w-50 fullWidthOnMobile" onSubmit={(e) => handleSubmit(e, createUserPhoto)}>
                <Form.Group className="mb-1">
                    <Form.Label>Link or upload a profile photo</Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text
                                onClick={() => {
                                    setPhotoSource('upload');
                                }}
                            >
                                <i
                                    className={
                                        photoSource === 'upload'
                                            ? 'text-primary fas fa-file-upload'
                                            : 'text-light fas fa-file-upload'
                                    }
                                ></i>
                            </InputGroup.Text>
                            <InputGroup.Text
                                onClick={() => {
                                    setPhotoSource('link');
                                }}
                            >
                                <i
                                    className={
                                        photoSource === 'link' ? 'text-primary fas fa-link' : 'text-light fas fa-link'
                                    }
                                ></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        {photoSource === 'upload' && (
                            <FormFile
                                label={
                                    file && fileName && fileSize
                                        ? fileName + ' (' + formatFileSize(fileSize) + ')'
                                        : 'Choose file (.jpg, .png)'
                                }
                                custom
                                accept=".jpg, .jpeg, .png"
                                onChange={getFile}
                            />
                        )}
                        {photoSource === 'link' && (
                            <Form.Control
                                value={newPhotoUrl}
                                placeholder="Paste image URL"
                                onChange={(e) => handlePhotoUrlInput(e)}
                            />
                        )}
                    </InputGroup>
                    {fileSize > MAX_FILE_SIZE && photoSource === 'upload' && (
                        <small className="text-danger">
                            File size exceeds 2MB maximum. Please select a smaller file.
                        </small>
                    )}
                    {photoStatus.length > 0 && <small className="text-success">Photo {photoStatus}</small>}
                </Form.Group>
                <ButtonGroup className="w-100">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!((file && photoSource === 'upload') || (newPhotoUrl && photoSource === 'link') || (deleteExistingPhoto)) }
                        >
                            Save Photo
                        </Button>
                    </ButtonGroup>
                <Form.Group>
                    { existingPhotoUrl &&
                        <div className="mb-2">
                            Current Photo:
                            <Container>
                                <Row className="align-items-center">
                                    <Image src={existingPhotoUrl} rounded thumbnail style={{maxWidth: `100px`}} className="mr-3"/>
                                    {deleteExistingPhoto &&
                                        <div>
                                            <div><small className="text-danger">This image will be deleted after you save changes.</small></div>
                                            <Button onClick={() => handleCancel()} className="btn btn-dark pt-0 pb-0 shadow-sm" size="sm">
                                                Cancel Delete
                                            </Button>
                                        </div>
                                    }
                                    {!deleteExistingPhoto &&
                                        <i onClick={() => setDeleteExistingPhoto(true)} className="cancelIcon clickable fas fa-times mr-1"></i>
                                    }
                                </Row>
                            </Container>
                        </div>
                    }
                </Form.Group>
            </Form>
        </>
    );
};

export default PhotoSettings;
