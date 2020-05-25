import React, { useState, useContext } from 'react';
import { Redirect, Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormFile from 'react-bootstrap/FormFile';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { CREATE_RECIPE_MUTATION, CREATE_RECIPE_PHOTO_MUTATION, GET_RECIPES_QUERY } from '../../../queries/queries';
import IngredientInput from './IngredientInput';
import InstructionInput from './InstructionInput';
import { AuthContext } from '../../../App';

const MAX_FILE_SIZE = 2097152;

const CreateRecipe = ({ history }) => {
    window.onbeforeunload = () => true
    const currentUser = useContext(AuthContext);
    const [navigationIsBlocked, setNavigationIsBlocked] = useState(true)
    const [createRecipePhoto] = useMutation(CREATE_RECIPE_PHOTO_MUTATION);
    const [createRecipe] = useMutation(CREATE_RECIPE_MUTATION, {
        update(cache, { data: { createRecipe } }) {
            const data = cache.readQuery({ query: GET_RECIPES_QUERY });
            const recipes = [createRecipe.recipe, ...data.recipes.slice(0)];

            cache.writeQuery({
                query: GET_RECIPES_QUERY,
                data: { recipes },
            });
        },
    });

    const blankIngredient = { quantity: '', name: '', preparation: '' };
    const blankInstruction = { order: 0, content: '' };
    const [photoSource, setPhotoSource] = useState('upload');
    const [photoUrl, setPhotoUrl] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileExtension, setFileExtension] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([{ ...blankIngredient }]);
    const [instructions, setInstructions] = useState([{ ...blankInstruction }]);
    const [instructionCounter, setInstructionCounter] = useState(1);
    const [skillLevel, setSkillLevel] = useState('Easy');
    const [servings, setServings] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [waitTime, setWaitTime] = useState('');

    const handleIngredientChange = (e) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[e.target.dataset.idx][e.target.name] = e.target.value;
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { ...blankIngredient }]);
    };

    const deleteIngredient = (idx) => {
        if (ingredients.length === 1) {
            setIngredients([{ ...blankIngredient }]);
        } else {
            const updatedIngredients = [...ingredients];
            updatedIngredients.splice(idx, 1);
            setIngredients(updatedIngredients);
        }
    };

    const handleInstructionChange = (e) => {
        const updatedInstructions = [...instructions];
        updatedInstructions[e.target.dataset.idx][e.target.name] = e.target.value;
        setInstructions(updatedInstructions);
    };

    const addInstruction = () => {
        setInstructions([...instructions, { ...{ content: '', order: instructionCounter } }]);
        setInstructionCounter(instructionCounter + 1);
    };

    const deleteInstruction = (idx) => {
        if (instructions.length === 1) {
            setInstructions([{ ...blankInstruction }]);
        } else {
            const updatedInstructions = [...instructions];
            updatedInstructions.splice(idx, 1);
            setInstructions(updatedInstructions);
        }
    };

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

    const handleCancel = async () => {
        await setNavigationIsBlocked(false);
        history.push(`/`);
    }

    const handleSubmit = async (e, createRecipe) => {
        e.preventDefault();

        setNavigationIsBlocked(false)

        const recipe = {
            title,
            description,
            skillLevel,
            prepTime: prepTime || 0,
            cookTime: cookTime || 0,
            waitTime: waitTime || 0,
            servings,
            ingredients,
            instructions,
        };

        const res = await createRecipe({ variables: { recipe } });
        const recipeId = res.data.createRecipe.recipe.id;

        if (file && photoSource === 'upload') {
            handleUpload(recipeId, createRecipePhoto);
        } else if (photoUrl && photoSource === 'link') {
            handleCreateLinkedPhoto(recipeId, createRecipePhoto);
        } else {
            history.push(`/recipes/${recipeId}`);
        }
    };

    const handleUpload = async (recipeId, createRecipePhoto) => {
        const presignedPostData = await getPresignedPostData();
        uploadFileToS3(presignedPostData, file.newFile);
        const url = presignedPostData.url + presignedPostData.fields.key;
        const recipePhoto = {
            recipeId,
            url,
        };
        await createRecipePhoto({ variables: { recipePhoto } });

        setTimeout(() => {history.push(`/recipes/${recipeId}`)}, 1250);
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

    const handleCreateLinkedPhoto = async (recipeId, createRecipePhoto) => {
        const recipe_photo = {
            recipeId,
            url: photoUrl,
        };
        await createRecipePhoto({ variables: { recipe_photo } });
        history.push(`/recipes/${recipeId}`);
    };

    if (currentUser) {
        return (
            <>
                <Prompt
                    when={navigationIsBlocked}
                    message='You have unsaved changes. Are you sure you want to leave this page?'
                />
                <h2>Add a New Recipe</h2>
                <Form onSubmit={(e) => handleSubmit(e, createRecipe)} className="mb-3">
                    <Form.Group controlId="formName">
                        <Form.Label><span className="font-weight-bold">Title</span>*</Form.Label>
                        <Form.Control
                            size="sm"
                            value={title}
                            type="text"
                            name="title"
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label className="font-weight-bold">Description</Form.Label>
                        <Form.Control
                            size="sm"
                            value={description}
                            type="text"
                            name="description"
                            onChange={(e) => setDescription(e.target.value)}
                            as="textarea"
                            rows="3"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="font-weight-bold">Ingredients</Form.Label>
                        <div className="row clearfix">
                            <div name="ingredients" className="col-12 column">
                                <Table className="mb-2" size="sm" striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th className="text-center"></th>
                                            <th className="text-center" style={{ minWidth: "100px" }}><small><strong>Qty & Unit</strong></small></th>
                                            <th className="col-5 text-center"><small><strong>Ingredient</strong></small></th>
                                            <th className="text-center" style={{ minWidth: "150px" }}><small><strong>Preparation</strong></small></th>
                                            <th className="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ingredients.map((val, idx) => {
                                            return (
                                                <IngredientInput
                                                    key={`ingredient-${idx}`}
                                                    idx={idx}
                                                    ingredients={ingredients}
                                                    handleIngredientChange={handleIngredientChange}
                                                    deleteIngredient={deleteIngredient}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </Table>
                                <div className="d-flex justify-content-center">
                                    <Button onClick={addIngredient} className="btn confirmBtn pt-0 pb-0 shadow-sm" size="sm">
                                        Add Ingredient
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="instructionsData">
                        <Form.Label className="font-weight-bold">Instructions</Form.Label>
                        <div className="row clearfix">
                            <div name="instructions" className="col-12 column">
                                <Table className="mb-2" size="sm" striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th className="text-center"></th>
                                            <th className="col-10 text-center"></th>
                                            <th className="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {instructions.map((val, idx) => {
                                            return (
                                                <InstructionInput
                                                    key={`instruction-${idx}`}
                                                    idx={idx}
                                                    instructions={instructions}
                                                    handleInstructionChange={handleInstructionChange}
                                                    deleteInstruction={deleteInstruction}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </Table>
                                <div className="d-flex justify-content-center">
                                    <Button onClick={addInstruction} className="btn confirmBtn pt-0 pb-0 shadow-sm" size="sm">
                                        Add Instruction
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                    <fieldset>
                        <Form.Group as={Row}>
                            <Form.Label as="legend" column sm={2} className="font-weight-bold">
                                Skill Level
                            </Form.Label>
                            <Row sm={10}>
                                <Form.Check
                                    type="radio"
                                    label="Easy"
                                    name="formHorizontalRadios"
                                    id="Easy"
                                    defaultChecked
                                    onClick={() => setSkillLevel('Easy')}
                                    className="mr-3"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Intermediate"
                                    name="formHorizontalRadios"
                                    id="Intermediate"
                                    onClick={() => setSkillLevel('Intermediate')}
                                    className="mr-3"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Advanced"
                                    name="formHorizontalRadios"
                                    id="Advanced"
                                    onClick={() => setSkillLevel('Advanced')}
                                />
                            </Row>
                        </Form.Group>
                    </fieldset>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formServings" className="mr-5">
                            <Form.Label><span className="font-weight-bold">Servings</span>*</Form.Label>
                            <Form.Control
                                size="sm"
                                value={servings}
                                type="number"
                                name="servings"
                                onChange={(e) => setServings(parseInt(e.target.value))}
                                pattern="\d+"
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formPrepTime" className="mr-1">
                            <Form.Label><span className="font-weight-bold">Prep Time</span>*&nbsp;<small className="text-secondary">(in minutes)</small></Form.Label>
                            <Form.Control
                                size="sm"
                                value={prepTime}
                                type="number"
                                name="prepTime"
                                onChange={(e) => setPrepTime(parseInt(e.target.value))}
                                pattern="\d+"
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formCookTime" className="mr-1">
                            <Form.Label className="font-weight-bold">Cook Time&nbsp;<small className="text-secondary">(in minutes)</small></Form.Label>
                            <Form.Control
                                size="sm"
                                value={cookTime}
                                type="number"
                                name="cookTime"
                                onChange={(e) => setCookTime(parseInt(e.target.value))}
                                pattern="\d+"
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formWaitTime" className="font-weight-bold">
                            <Form.Label className="font-weight-bold">Wait Time&nbsp;<small className="text-secondary">(in minutes)</small></Form.Label>
                            <Form.Control
                                size="sm"
                                value={waitTime}
                                type="number"
                                name="waitTime"
                                onChange={(e) => setWaitTime(parseInt(e.target.value))}
                                pattern="\d+"
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label className="font-weight-bold">Photo</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text onClick={() => {setPhotoSource('upload');}} >
                                    <i className={
                                        photoSource === 'upload'
                                            ? 'text-primary fas fa-file-upload'
                                            : 'text-light fas fa-file-upload'
                                    }></i>
                                </InputGroup.Text>
                                <InputGroup.Text onClick={() => {setPhotoSource('link');}} >
                                    <i className={
                                        photoSource === 'link'
                                        ? 'text-primary fas fa-link'
                                        : 'text-light fas fa-link'
                                    }></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend >
                            {photoSource === 'upload' && (
                            <FormFile
                                label={file && fileName && fileSize
                                    ? fileName + ' (' + formatFileSize(fileSize) + ')'
                                    : "Choose file (.jpg, .png)"
                                }
                                custom
                                accept=".jpg, .jpeg, .png"
                                onChange={getFile}
                            />
                        )}
                            {photoSource === 'link' && (
                                <Form.Control
                                    value={photoUrl}
                                    placeholder="Paste image URL"
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                />
                            )}
                        </InputGroup>
                        {fileSize > MAX_FILE_SIZE && photoSource === 'upload' && <small className="text-danger">File size exceeds 2MB maximum. Please select a smaller file.</small>}
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button
                            className="mr-2 confirmBtn"
                            type="submit"
                            disabled={!title || !servings || !prepTime}
                        >
                            Save Recipe
                        </Button>
                        <Button onClick={handleCancel} variant="light">
                            Cancel
                        </Button>
                    </div>
                </Form>
            </>
        );
    } else {
        return <Redirect to="/" />;
    }
};

export default CreateRecipe;
