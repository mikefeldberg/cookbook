import React, { useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../../App';
import { DELETE_RECIPE_MUTATION, GET_RECIPES_QUERY } from '../../queries/queries';
import Button from 'react-bootstrap/Button';

const DeleteRecipe = ({ recipe }) => {
    const currentUser = useContext(AuthContext);
    const isCurrentUser = currentUser.id === recipe.user.id;

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

    const handleDelete = async (e, deleteRecipe) => {
        e.preventDefault();
        deleteRecipe({ variables: { recipeId: recipe.id } });
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
