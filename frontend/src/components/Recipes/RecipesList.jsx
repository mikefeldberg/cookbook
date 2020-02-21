import React, { useContext } from 'react';

import { AuthContext } from '../../App';


const RecipesList = () => {
    const currentUser = useContext(AuthContext)

    if (currentUser.data) {
        const userName = currentUser.data.me.username
        return <div>I'm a recipe list, {userName}</div>;
    }

    return <div>I'm a recipe list</div>;
};

export default RecipesList;
