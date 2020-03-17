import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import Image from 'react-bootstrap/Image';

import { AuthContext } from '../../App';
import { GET_RECIPE_QUERY } from '../../queries/queries';
import CommentSection from '../Comments/CommentSection';
import RecipeToolbar from './RecipeToolbar';


const RecipeDetails = ({ match, history }) => {
    const currentUser = useContext(AuthContext);

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
                {currentUser && recipe.user.id === currentUser.id &&
                    <RecipeToolbar history={history} recipe={recipe}/>
                }
                {/* <Image src={recipe.photos.length > 0 ? recipe.photos[0].url : `https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_food_placeholder.jpg`} fluid /> */}
                <div>Title: {recipe.title}</div>
                {/* <div>
                    Rating: {recipe.ratingCount > 0 ? <div>{recipe.rating} ({recipe.ratingCount})</div> : 'No ratings yet'}
                </div>
                <div>Favorited: {recipe.favoriteCount}</div>
                <div>Description: {recipe.description}</div>
                <div>Skill Level: {recipe.skillLevel}</div>
                <div>Prep Time: {recipe.prepTime}</div>
                <div>Cook Time: {recipe.cookTime}</div>
                <div>Wait Time: {recipe.waitTime}</div>
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
                </div> */}
                <CommentSection recipeId={recipe.id} comments={recipe.comments} />
            </>
        );
    }
};

export default RecipeDetails;
