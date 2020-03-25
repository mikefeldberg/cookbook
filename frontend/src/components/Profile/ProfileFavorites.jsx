import React from 'react';

import CardColumns from 'react-bootstrap/CardColumns';
import RecipeCard from '../Recipes/RecipeCard';

const ProfileFavorites = ({favorites}) => {
    return (
        <CardColumns>
            {favorites.map(favorite => (
                <RecipeCard key={favorite.id} recipe={favorite.recipe} />
            ))}
        </CardColumns>
    );
};

export default ProfileFavorites;
