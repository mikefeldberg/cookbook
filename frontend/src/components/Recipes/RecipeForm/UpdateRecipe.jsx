import React from 'react';

import { useQuery } from '@apollo/react-hooks';

import { GET_RECIPE_QUERY } from '../../../queries/queries';
import UpdateRecipeForm from './UpdateRecipeForm';

const omitDeep = require('omit-deep');

const UpdateRecipe = ({ match, history }) => {
    const id = match.params.id;

    const { data, loading, error } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipe = omitDeep(data, '__typename')
        return <UpdateRecipeForm recipe={recipe.recipe} history={history}/>;
    }
};

export default UpdateRecipe;
