import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import CardColumns from 'react-bootstrap/CardColumns';

import { GET_RECIPES_QUERY, GET_FEATURED_RECIPES_QUERY } from '../../queries/queries';
import RecipeCard from './RecipeCard';
import RecipeNav from './RecipeNav';
import FeaturedRecipe from './FeaturedRecipe';

const RecipesList = () => {
    const [searchResults, setSearchResults] = useState([]);
    const { data: featured } = useQuery(GET_FEATURED_RECIPES_QUERY, {variables: {'featured': true}});
    const { data, loading, error } = useQuery(GET_RECIPES_QUERY);

    if (loading) return <div>Loading recipes...</div>;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipes = data.recipes;
        const featuredRecipe = featured.featuredRecipes[Math.floor(Math.random() * featured.featuredRecipes.length)]
        console.log(featuredRecipe)
        return (
            <>
                <RecipeNav setSearchResults={setSearchResults} />
                <FeaturedRecipe featuredRecipe={featuredRecipe}/>
                <hr />
                <CardColumns>
                    { searchResults.length > 0 ?
                        searchResults.map(recipe => (<RecipeCard key={recipe.id} recipe={recipe} />)) :
                        recipes.map(recipe => (<RecipeCard key={recipe.id} recipe={recipe} index={recipes.indexOf(recipe, recipes)}/>))
                    }
                </CardColumns>
            </>
        );
    }
};

export default RecipesList;
