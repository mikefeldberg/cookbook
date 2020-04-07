import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import { AuthContext } from '../../App';
import { GET_RECIPE_QUERY } from '../../queries/queries';
import Recipe from './Recipe';

const RecipeDetails = ({ match, history }) => {
    const currentUser = useContext(AuthContext);
    const id = match.params.id;

    const { data, loading, error } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return <Redirect />;

    if (data) {
        const recipe = data.recipe;
        let favorited = false
        if (currentUser) {
            const favoritedUserIds = recipe.favorites.map(f => f.user.id)
            favorited = favoritedUserIds.includes(currentUser.id)
        }

        return (
            <Recipe recipe={recipe} favorited={favorited} />
        );
    }
};

export default RecipeDetails;
