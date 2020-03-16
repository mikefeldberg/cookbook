import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';

import { GET_RECIPE_QUERY } from '../../queries/queries';
import { AuthContext } from '../../App';

import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import DeleteRecipe from './DeleteRecipe';

// const uuid = require('uuid/v1');

const RecipeDetails = ({ match, history }) => {
    const currentUser = useContext(AuthContext);
    const [feedbackEnabled, setFeedbackEnabled] = useState(false);
    // const [rating, setRating] = useState(0);
    // const [comment, setComment] = useState('');
    // const [editedRating, setEditedRating] = useState(0);
    // const [editedComment, setEditedComment] = useState('');

    if (!!currentUser && !feedbackEnabled) {
        setFeedbackEnabled(true);
    }

    const id = match.params.id;
    const { data, loading, error } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipe = data.recipe;

        return (
            <>
                <Row>
                    <ButtonToolbar className="mb-2">
                        <Link to={`/recipes/${recipe.id}/edit`} className="mr-2">
                            <Button size="sm" variant="secondary-inverse">
                                {<i className="fas fa-edit text-secondary"></i>}
                            </Button>
                        </Link>
                        <DropdownButton
                            size="sm"
                            drop="right"
                            title={<i className="fas fa-trash text-danger"></i>}
                            variant="danger-inverse"
                        >
                            <Dropdown.Item disabled eventKey="0">
                                Are you sure?
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="1">
                                <DeleteRecipe history={history} recipe={recipe} />
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="2">Cancel</Dropdown.Item>
                        </DropdownButton>
                    </ButtonToolbar>
                </Row>
                <Image src={recipe.photos.length > 0 ? recipe.photos[0].url : `holder.js/100px180?text=Image cap`} fluid />
                <div>Title: {recipe.title}</div>
                <div>
                    Rating: (
                    {recipe.rating_count > 0 ? <div>recipe.rating (recipe.rating_count)</div> : 'No ratings yet'})
                </div>
                <div>Favorited: {recipe.favoriteCount}</div>
                <div>Description: {recipe.description}</div>
                <div>Skill Level: {recipe.skillLevel}</div>
                <div>Prep Time: {recipe.prepTime}</div>
                <div>Wait Time: {recipe.waitTime}</div>
                <div>Cook Time: {recipe.cookTime}</div>
                <div>Total Time: {recipe.totalTime}</div>
                <div>Servings: {recipe.servings}</div>
                <div>
                    Ingredients:
                    {recipe.ingredients.map(ingredient => (
                        <div key={ingredient.id}>
                            {ingredient.quantity} {ingredient.name} {ingredient.preparation}
                        </div>
                    ))}
                </div>
                <div>
                    Instructions:
                    {recipe.instructions.map(instruction => (
                        <div key={instruction.id}>{instruction.content}</div>
                    ))}
                </div>
            </>
        );
    }
};

export default RecipeDetails;
