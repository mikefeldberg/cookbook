import React, { useContext, useState } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../../../App';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

const CreateRecipe = () => {
    const currentUser = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillLevel, setSkillLevel] = useState('skill');
    const [servings, setServings] = useState(0);
    const [prepTime, setPrepTime] = useState(0);
    const [waitTime, setWaitTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);

    const handleSubmit = e => {
        e.preventDefault();
        console.log('submit');
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
                <Form.Control as="select">
                    <option>Choose...</option>
                    <option onSelect={e => setSkillLevel('easy')}>Easy</option>
                    <option onSelect={e => setSkillLevel('intermediate')}>Intermediate</option>
                    <option onSelect={e => setSkillLevel('difficult')}>Difficult</option>
                </Form.Control>
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
            <Button type="button" variant="primary" onClick={handleSubmit}>
                Save Recipe
            </Button>
        </Form>
    );
};

export default CreateRecipe;
