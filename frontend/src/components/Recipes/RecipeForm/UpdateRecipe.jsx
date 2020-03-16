import React, {useContext} from 'react';

import { useQuery } from '@apollo/react-hooks';
import {AuthContext} from '../../../App'

import { GET_RECIPE_QUERY } from '../../../queries/queries';
import UpdateRecipeForm from './UpdateRecipeForm';
import { Redirect } from 'react-router-dom';

const omitDeep = require('omit-deep');

const UpdateRecipe = ({ match, history }) => {
    const currentUser = useContext(AuthContext);
    const id = match.params.id;

    const { data, loading, error } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipe = omitDeep(data, '__typename')
        if (recipe.user === currentUser) {
            return <UpdateRecipeForm recipe={recipe.recipe} history={history}/>;
        } else {
            return <Redirect to='/' />
        }
    }
};

export default UpdateRecipe;
