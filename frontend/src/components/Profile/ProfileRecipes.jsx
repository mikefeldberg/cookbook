import React from 'react';

import CardColumns from 'react-bootstrap/CardColumns';
import ProfileRecipeCard from './ProfileRecipeCard';


const ProfileRecipes = ({recipes}) => {
    return (
        <CardColumns>
            {recipes.map(recipe => (
                <ProfileRecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </CardColumns>
    );
};

export default ProfileRecipes;
