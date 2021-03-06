import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { DELETE_RECIPE_MUTATION, GET_RECIPES_QUERY } from '../../queries/queries';

const DeleteRecipe = ({ recipe }) => {
    const history = useHistory();
    const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
        update(cache, { data: { deleteRecipe } }) {
            const data = cache.readQuery({ query: GET_RECIPES_QUERY });
            const index = data.recipes.findIndex(recipe => recipe.id === deleteRecipe.recipeId);
            const recipes = [...data.recipes.slice(0, index), ...data.recipes.slice(index + 1)];
            cache.writeQuery({
                query: GET_RECIPES_QUERY,
                data: { recipes },
            });
        },
    });

    const handleDelete = async () => {
        await deleteRecipe({ variables: { recipeId: recipe.id } });
        history.push('/');
    };

    return (
        <ButtonGroup className="w-100" onClick={() => handleDelete()}>
            <Button
                variant="light-outline"
                className="rounded-0 text-left"
            >
                Confirm Delete
            </Button>
        </ButtonGroup>
    );
};

export default DeleteRecipe;
