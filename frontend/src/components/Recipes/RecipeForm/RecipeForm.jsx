import React, { useState } from 'react';

import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';

import IngredientInput from './IngredientInput';
import InstructionInput from './InstructionInput';

const RecipeForm = () => {
    const blankIngredient = { quantity: '', name: '', preparation: '' };
    const blankInstruction = { order: 1, content: '' };

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [prepTime, setPrepTime] = useState(0);
    const [waitTime, setWaitTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [servings, setServings] = useState(0);
    const [ingredients, setIngredients] = useState([{ ...blankIngredient }]);
    const [instructions, setInstructions] = useState([{ ...blankInstruction }]);

    const handleSkillLevelChange = e => {
        console.log('handle skill');
        setSkillLevel(e.target.value);
    };

    const handleIngredientChange = e => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[e.target.dataset.idx][e.target.name] = e.target.value;
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { ...blankIngredient }]);
    };

    const deleteIngredient = idx => {
        console.log('deleting ingredient')
        console.log('idx', idx)
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(idx, 1);
        setIngredients(updatedIngredients);
    };

    const handleInstructionChange = e => {
        const updatedInstructions = [...instructions];
        updatedInstructions[e.target.dataset.idx][e.target.name] = e.target.value;
        setInstructions(updatedInstructions);
    };

    const addInstruction = () => {
        setInstructions([...instructions, { ...blankInstruction }]);
    };

    const deleteInstruction = idx => {
        const updatedInstructions = [...instructions];
        updatedInstructions.splice(idx, 1);
        setInstructions(updatedInstructions);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const recipe = {
            title,
            description,
            skillLevel,
            prepTime,
            waitTime,
            cookTime,
            servings,
            ingredients,
            instructions,
        };
        console.log(recipe);
    };

    return (
        <Form>
            <Form.Group controlId="formName">
                <Form.Label>Recipe Title</Form.Label>
                <Form.Control type="text" name="title" onChange={e => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formDescription">
                <Form.Label>Recipe Description</Form.Label>
                <Form.Control
                    type="text"
                    name="description"
                    onChange={e => setDescription(e.target.value)}
                    as="textarea"
                    rows="3"
                />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Skill Level</Form.Label>
                <Form.Control onChange={() => handleSkillLevelChange} as="select">
                    <option>Choose...</option>
                    <option value='easy'>Easy</option>
                    <option value='intermediate'>Intermediate</option>
                    <option value='difficult'>Difficult</option>
                </Form.Control>
                {/* <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Difficulty
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item>Action</Dropdown.Item>
                        <Dropdown.Item>Another action</Dropdown.Item>
                        <Dropdown.Item>Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> */}
            </Form.Group>
            <Form.Group controlId="formServings">
                <Form.Label>Servings</Form.Label>
                <Form.Control type="number" name="servings" onChange={e => setServings(e.target.value)} pattern="\d+" />
            </Form.Group>
            <Form.Group controlId="formPrepTime">
                <Form.Label>Prep Time</Form.Label>
                <Form.Control type="number" name="timePrep" onChange={e => setPrepTime(e.target.value)} pattern="\d+" />
            </Form.Group>
            <Form.Group controlId="formCookTime">
                <Form.Label>Cook Time</Form.Label>
                <Form.Control type="number" name="timeCook" onChange={e => setWaitTime(e.target.value)} pattern="\d+" />
            </Form.Group>
            <Form.Group controlId="formWaitTime">
                <Form.Label>Wait Time</Form.Label>
                <Form.Control type="number" name="timeWait" onChange={e => setCookTime(e.target.value)} pattern="\d+" />
            </Form.Group>
            <Form.Group >
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

            <Button type="button" variant="primary" onClick={handleSubmit}>
                Save Recipe
            </Button>
        </Form>
    );
};

export default RecipeForm;
