import React from 'react';
// import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { GET_RECIPE_QUERY } from '../../queries/queries';
// import { AuthContext } from '../../App';

function RecipeDetails({ match }) {
    // const currentUser = useContext(AuthContext);
    const id = match.params.id;
    const { loading, error, data } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return <div>Loading recipe...</div>;
    if (error) return `Error! ${error}`;

    return (
        <div>
            <div>Title: {data.recipe.title}</div>
            <div>Description: {data.recipe.description}</div>
        </div>
    );
}

export default RecipeDetails;
