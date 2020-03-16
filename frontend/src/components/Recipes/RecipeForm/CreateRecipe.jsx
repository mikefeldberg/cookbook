import React, { useState } from 'react';

import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import { CREATE_RECIPE_MUTATION, CREATE_PHOTO_MUTATION } from '../../../queries/queries';
import IngredientInput from './IngredientInput';
import InstructionInput from './InstructionInput';
import { Redirect } from 'react-router-dom';


const CreateRecipe = ({history}) => {
    const [createRecipe] = useMutation(CREATE_RECIPE_MUTATION);
    const [createPhoto] = useMutation(CREATE_PHOTO_MUTATION);

    // const blankIngredient = { quantity: '', name: '', preparation: '' };
    // const blankInstruction = { order: 0, content: '' };
    // const [file, setFile] = useState(null);
    // const [title, setTitle] = useState('');
    // const [description, setDescription] = useState('');
    // const [ingredients, setIngredients] = useState([{ ...blankIngredient }]);
    // const [instructions, setInstructions] = useState([{ ...blankInstruction }]);
    // const [instructionCounter, setInstructionCounter] = useState(1);
    // const [skillLevel, setSkillLevel] = useState('');
    // const [servings, setServings] = useState('');
    // const [prepTime, setPrepTime] = useState('');
    // const [cookTime, setCookTime] = useState('');
    // const [waitTime, setWaitTime] = useState('');

    const blankIngredient = { quantity: '1', name: '1', preparation: '1' };
    const blankInstruction = { order: 0, content: '1' };
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('1');
    const [description, setDescription] = useState('1');
    const [ingredients, setIngredients] = useState([{ ...blankIngredient }]);
    const [instructions, setInstructions] = useState([{ ...blankInstruction }]);
    const [instructionCounter, setInstructionCounter] = useState(1);
    const [skillLevel, setSkillLevel] = useState('1');
    const [servings, setServings] = useState('1');
    const [prepTime, setPrepTime] = useState('1');
    const [cookTime, setCookTime] = useState('1');
    const [waitTime, setWaitTime] = useState('1');

    const handleIngredientChange = e => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[e.target.dataset.idx][e.target.name] = e.target.value;
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { ...blankIngredient }]);
    };

    const deleteIngredient = idx => {
        if (ingredients.length === 1) {
            setIngredients([{ ...blankIngredient }]);
        } else {
            const updatedIngredients = [...ingredients];
            updatedIngredients.splice(idx, 1);
            setIngredients(updatedIngredients);
        }
    };

    const handleInstructionChange = e => {
        const updatedInstructions = [...instructions];
        updatedInstructions[e.target.dataset.idx][e.target.name] = e.target.value;
        setInstructions(updatedInstructions);
    };

    const addInstruction = () => {
        setInstructions([...instructions, { ...{ content: '', order: instructionCounter } }]);
        setInstructionCounter(instructionCounter + 1);
    };

    const deleteInstruction = idx => {
        if (instructions.length === 1) {
            setInstructions([{ ...blankInstruction }]);
        } else {
            const updatedInstructions = [...instructions];
            updatedInstructions.splice(idx, 1);
            setInstructions(updatedInstructions);
        }
    };

    const uploadFileToS3 = (presignedPostData, file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            Object.keys(presignedPostData.fields).forEach(key => {
                formData.append(key, presignedPostData.fields[key]);
            });

            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', presignedPostData.url, true);
            xhr.send(formData);
            xhr.onload = function() {
                this.status === 204 ? resolve() : reject(this.responseText);
            };
        });
    };

    const getPresignedPostData = async () => {
        const response = await fetch('http://localhost:8000/upload/');
        const json = await response.json();
        return json;
    };

    const getFile = e => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFile = files[0];
            setFile({ newFile });
        }
    };

    const handleSubmit = async (e, createRecipe) => {
        e.preventDefault();

        const recipe = {
            title,
            description,
            skillLevel,
            prepTime,
            cookTime,
            waitTime,
            servings,
            ingredients,
            instructions,
        };

        const res = await createRecipe({ variables: { recipe } });
        const recipeId = res.data.createRecipe.recipe.id;
        
        if (file) {
            handleUpload(recipeId, createPhoto);
        } else {
            // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ here i am in non file upload')
            // return <Redirect to={`/recipes/${recipeId}`} />
            history.push(`/recipes/${recipeId}`);
        }
    };
    
    const handleUpload = async (recipeId, createPhoto) => {
        const presignedPostData = await getPresignedPostData();
        uploadFileToS3(presignedPostData, file.newFile);
        const url = presignedPostData.url + presignedPostData.fields.key;
        const photo = {
            recipeId,
            url
        }
        await createPhoto({ variables: { photo } });
        // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ here i am in file upload')
        // return <Redirect to={`/recipes/${recipeId}`} />
        history.push(`/recipes/${recipeId}`);
    };

    return (
        <Form onSubmit={e => handleSubmit(e, createRecipe)}>
            <Form.Group controlId="formName">
                <Form.Label>Recipe Title</Form.Label>
                <Form.Control value={title} type="text" name="title" onChange={e => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formDescription">
                <Form.Label>Recipe Description</Form.Label>
                <Form.Control
                    value={description}
                    type="text"
                    name="description"
                    onChange={e => setDescription(e.target.value)}
                    as="textarea"
                    rows="3"
                />
            </Form.Group>
            <Form.Group>
                <div className="row clearfix">
                    <div name="ingredients" className="col-12 column">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th className="text-center">Qty & Unit</th>
                                    <th className="text-center">Ingredient</th>
                                    <th className="text-center">Preparation</th>
                                    <th className="text-center">-</th>
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
                        <button type="button" onClick={addIngredient} className="btn btn-primary">
                            Add Ingredient
                        </button>
                    </div>
                </div>
            </Form.Group>
            <Form.Group controlId="instructionsData">
                <div className="row clearfix">
                    <div name="instructions" className="col-12 column">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th className="text-center">Instruction</th>
                                    <th className="text-center">-</th>
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
                        <button type="button" onClick={addInstruction} className="btn btn-primary">
                            Add Instruction
                        </button>
                    </div>
                </div>
            </Form.Group>
            <fieldset>
                <Form.Group as={Row}>
                    <Form.Label as="legend" column sm={2}>
                        Difficulty
                    </Form.Label>
                    <Row sm={10}>
                        <Form.Check
                            type="radio"
                            label="Easy"
                            name="formHorizontalRadios"
                            id="easy"
                            onClick={() => setSkillLevel('easy')}
                        />
                        <Form.Check
                            type="radio"
                            label="Intermediate"
                            name="formHorizontalRadios"
                            id="intermediate"
                            onClick={() => setSkillLevel('intermediate')}
                        />
                        <Form.Check
                            type="radio"
                            label="Difficult"
                            name="formHorizontalRadios"
                            id="difficult"
                            onClick={() => setSkillLevel('difficult')}
                        />
                    </Row>
                </Form.Group>
            </fieldset>
            <Form.Group controlId="formServings">
                <Form.Label>Servings</Form.Label>
                <Form.Control
                    value={servings}
                    type="number"
                    name="servings"
                    onChange={e => setServings(parseInt(e.target.value))}
                    pattern="\d+"
                />
            </Form.Group>
            <Form.Group controlId="formPrepTime">
                <Form.Label>Prep Time</Form.Label>
                <Form.Control
                    value={prepTime}
                    type="number"
                    name="prepTime"
                    onChange={e => setPrepTime(parseInt(e.target.value))}
                    pattern="\d+"
                />
            </Form.Group>
            <Form.Group controlId="formCookTime">
                <Form.Label>Cook Time</Form.Label>
                <Form.Control
                    value={cookTime}
                    type="number"
                    name="cookTime"
                    onChange={e => setCookTime(parseInt(e.target.value))}
                    pattern="\d+"
                />
            </Form.Group>
            <Form.Group controlId="formWaitTime">
                <Form.Label>Wait Time</Form.Label>
                <Form.Control
                    value={waitTime}
                    type="number"
                    name="waitTime"
                    onChange={e => setWaitTime(parseInt(e.target.value))}
                    pattern="\d+"
                />
            </Form.Group>
            <label>Choose file</label>
            <input onChange={getFile} type="file" />
            <Button type="submit" variant="primary">
                Save Recipe
            </Button>
        </Form>
    );
};

export default CreateRecipe;
