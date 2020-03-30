import React from 'react';

import CardColumns from 'react-bootstrap/CardColumns';
import RecipeCard from '../Recipes/RecipeCard';

const ProfileFavorites = ({favorites}) => {
    return (
        <CardColumns>
            {favorites.length > 0 ?
                favorites.map(favorite => (<RecipeCard key={favorite.id} recipe={favorite.recipe} /> )) :
                `You haven't saved any favorites`
            }
        </CardColumns>
    );
};

export default ProfileFavorites;
