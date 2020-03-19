import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { DELETE_RECIPE_MUTATION, GET_RECIPES_QUERY } from '../../queries/queries';

const DeleteRecipe = ({ recipe, history }) => {
    const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
        update(cache, { data: { deleteRecipe } }) {
            const data = cache.readQuery({ query: GET_RECIPES_QUERY });
            debugger
            const index = data.recipes.findIndex(recipe => recipe.id === deleteRecipe.recipeId);
            const recipes = [...data.recipes.slice(0, index), ...data.recipes.slice(index + 1)];
            cache.writeQuery({
                query: GET_RECIPES_QUERY,
                data: { recipes },
            });
        },
    });

    const handleDelete = async (deleteRecipe) => {
        console.log('delete recipe')
        await deleteRecipe({ variables: { recipeId: recipe.id } });
        history.push('/');
    };

    return <span onClick={() => handleDelete(deleteRecipe)}>Confirm Delete</span>;
};

export default DeleteRecipe;
