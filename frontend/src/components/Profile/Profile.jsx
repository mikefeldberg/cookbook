import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
// import Sonne t from 'react-bootstrap/Sonnet';

import { PROFILE_QUERY, GET_RECIPES_QUERY,  } from '../../queries/queries';
import ProfileRecipes from './ProfileRecipes';


const Profile = ({match}) => {
    const username = match.params.id
    const { data: user, loading, error } = useQuery(PROFILE_QUERY, {
        variables: { username },
    });

    if (loading) return `Loading`
    if (data) {
        const recipes = data.profile.recipeSet
        const favorites = data.profile.favoriteSet
        const comments = data.profile.commentSet

        debugger

        return (
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                {/* <Tab eventKey="favorites" title="Favorites">
                    <Sonnet />
                </Tab> */}
                <Tab eventKey="recipes" title="Recipes">
                    <ProfileRecipes recipes={recipes}/>
                </Tab>
                {/* <Tab eventKey="contact" title="Contact" disabled>
                    <Sonnet />
                </Tab> */}
            </Tabs>
        );
    }
};

export default Profile;
