import React from 'react';

import CardColumns from 'react-bootstrap/CardColumns';
import RecipeCard from '../Recipes/RecipeCard';


const ProfileRecipes = ({recipes}) => {
    return (
        <CardColumns>
            {recipes.length > 0 ?
                recipes.map(recipe => (<RecipeCard key={recipe.id} recipe={recipe} />)) :
                `You haven't added any recipes`
            }
        </CardColumns>
    );
};


export default ProfileRecipes;
