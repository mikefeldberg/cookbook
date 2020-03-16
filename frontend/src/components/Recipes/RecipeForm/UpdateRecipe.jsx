import React from 'react';

import { useQuery } from '@apollo/react-hooks';

import { GET_RECIPE_QUERY } from '../../../queries/queries';
import UpdateRecipeForm from './UpdateRecipeForm';

const UpdateRecipe = ({ match }) => {
    const id = match.params.id;

    const { data, loading, error } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipe = data.recipe;

        return <UpdateRecipeForm recipe={recipe} />;
    }
};

export default UpdateRecipe;
