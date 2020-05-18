import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormFile from 'react-bootstrap/FormFile';
import Button from 'react-bootstrap/Button';

import { CREATE_USER_PHOTO_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';

const MAX_FILE_SIZE = 2097152;

const UserSettings = () => {
    const currentUser = useContext(AuthContext);
    const history = useHistory();
    const [createUserPhoto] = useMutation(CREATE_USER_PHOTO_MUTATION);

    const [photoSource, setPhotoSource] = useState('upload');
    const [photoUrl, setPhotoUrl] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileExtension, setFileExtension] = useState('');
    const [fileSize, setFileSize] = useState('');

    const getFile = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            if (files[0].size > MAX_FILE_SIZE) {
                setFile(null)
                setFileName('');
                setFileExtension('');
                setFileSize(e.target.files[0].size)
            }
            if (files[0].size <= MAX_FILE_SIZE) {
                const newFile = files[0];
                setFile({ newFile });
                setFileName(e.target.value.split('\\')[e.target.value.split('\\').length-1]);
                setFileExtension(e.target.value.split('.')[e.target.value.split('.').length-1]);
                setFileSize(e.target.files[0].size)
            }
        }
    };

    const formatFileSize = (fileSize) => {
        if(fileSize < 1024) {
            return fileSize + 'bytes';
        } else if(fileSize >= 1024 && fileSize < 1048576) {
            return (fileSize/1024).toFixed(1) + 'KB';
        } else if(fileSize >= 1048576) {
            return (fileSize/1048576).toFixed(1) + 'MB';
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (file && photoSource === 'upload') {
            handleUpload(currentUser, createUserPhoto);
        } else if (photoUrl && photoSource === 'link') {
            handleCreateLinkedPhoto(currentUser, createUserPhoto);
        } else {
            history.push(`/recipes/${currentUser.id}`);
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
        debugger
        await createUserPhoto({ variables: { userPhoto } });
        setTimeout(() => {history.push(`/profile/${currentUser.id}`)}, 1250);
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
            url: photoUrl,
        };
        await createUserPhoto({ variables: { userPhoto } });
        history.push(`/profile/${currentUser.id}`);
    };

    return (
        <>
            <Form onSubmit={(e) => handleSubmit(e, createUserPhoto)}>
                <Form.Group>
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
                                className="mr-2"
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
                                className="mr-2"
                                value={photoUrl}
                                placeholder="Paste image URL"
                                onChange={(e) => setPhotoUrl(e.target.value)}
                            />
                        )}
                    <InputGroup.Append>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!file && !photoUrl}
                        >
                            Save Photo
                        </Button>
                    </InputGroup.Append>
                    </InputGroup>
                    {fileSize > MAX_FILE_SIZE && photoSource === 'upload' && (
                        <small className="text-danger">
                            File size exceeds 2MB maximum. Please select a smaller file.
                        </small>
                    )}
                </Form.Group>
            </Form>
        </>
    );
};

export default UserSettings;
