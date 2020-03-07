import React, { useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../../App';
import { DELETE_RECIPE_MUTATION, GET_RECIPES_QUERY } from '../../queries/queries';
import Button from 'react-bootstrap/Button';

const DeleteRecipe = ({ recipe }) => {
    const currentUser = useContext(AuthContext);
    const isCurrentUser = currentUser.id === recipe.user.id;

// DELETE WORKS; CACHE UPDATE BROKEN


const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    update(cache, { data: { deleteRecipe } }) {
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ before data')
            const data = cache.readQuery({ query: GET_RECIPES_QUERY });
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ after data')
            const index = data.recipes.findIndex(recipe => Number(recipe.id) === deleteRecipe.recipeId);
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ after index')
            const recipes = [...data.recipes.slice(0, index), ...data.recipes.slice(index + 1)];
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ after recipes')
            cache.writeQuery({
                query: GET_RECIPES_QUERY,
                data: { recipes },
            });
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ after write query')
        },
    });

    // const [deleteRecipe, {data}] = useMutation(DELETE_RECIPE_MUTATION);

    const handleDelete = async (e, deleteRecipe) => {
        e.preventDefault();
        deleteRecipe({ variables: { recipeId: recipe.id } });
        console.log('handling delete');
    };

    return (
        isCurrentUser && (
            <Button onClick={e => handleDelete(e, deleteRecipe)}>
                <i className="fas fa-trash text-danger"></i>
            </Button>
        )
    );
};

export default DeleteRecipe;
