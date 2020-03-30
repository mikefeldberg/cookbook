import React, {useContext} from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import omitDeep from 'omit-deep';

import {AuthContext} from '../../../App'
import { GET_RECIPE_QUERY } from '../../../queries/queries';
import UpdateRecipeForm from './UpdateRecipeForm';


const UpdateRecipe = ({ match }) => {
    const currentUser = useContext(AuthContext);
    const id = match.params.id;

    const { data, loading, error } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipe = omitDeep(data, '__typename')

        if (recipe.recipe.user.id === currentUser.id) {
            return <UpdateRecipeForm recipe={recipe.recipe} />;
        } else {
            return <Redirect to='/' />
        }
    }
};

export default UpdateRecipe;
