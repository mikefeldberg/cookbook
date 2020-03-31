import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import CardColumns from 'react-bootstrap/CardColumns';

import { GET_RECIPES_QUERY } from '../../queries/queries';
import RecipeCard from './RecipeCard';
import RecipeNav from './RecipeNav';

const RecipesList = () => {
    const [searchResults, setSearchResults] = useState([]);
    const { data, loading, error } = useQuery(GET_RECIPES_QUERY);

    if (loading) return <div>Loading recipes...</div>;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipes = data.recipes;
        return (
            <>
                <RecipeNav setSearchResults={setSearchResults} />
                <CardColumns>
                    { searchResults.length > 0 ?
                        searchResults.map(recipe => (<RecipeCard key={recipe.id} recipe={recipe} />)) :
                        recipes.map(recipe => (<RecipeCard key={recipe.id} recipe={recipe} />))
                    }
                </CardColumns>
            </>
        );
    }
};

export default RecipesList;
