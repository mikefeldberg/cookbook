import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import CardColumns from 'react-bootstrap/CardColumns';

import { GET_RECIPES_QUERY } from '../../queries/queries';
import RecipeCard from './RecipeCard';


const RecipesList = () => {
    const { data, loading, error } = useQuery(GET_RECIPES_QUERY);

    if (loading) return <div>Loading recipes...</div>;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipes = data.recipes
        return (
            <CardColumns>
                {recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </CardColumns>
        );
    }
};

export default RecipesList;
