import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { GET_RECIPES_QUERY } from '../../queries/queries';
// import { AuthContext } from '../../App';

const RecipesList = () => {
    // const currentUser = useContext(AuthContext);
    const { loading, error, data } = useQuery(GET_RECIPES_QUERY);

    if (loading) return <div>Loading recipe...</div>;
    if (error) return `Error! ${error}`;

    if (data) {
        return data.recipes.map(({ id, title, description }) => {
            return (
                <div key={id}>
                    <div>
                        <Link to={`/recipes/${id}`}>{title}</Link>
                    </div>
                    <span>{description}</span>
                </div>
            );
        });
    }

    return <div>Loading recipes...</div>;
};

export default RecipesList;
