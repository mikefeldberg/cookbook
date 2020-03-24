import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { PROFILE_QUERY } from '../../queries/queries';
import ProfileRecipes from './ProfileRecipes';

const Profile = ({ match }) => {
    const id = match.params.id;

    const { data, loading, error } = useQuery(PROFILE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipes = data.profile.recipeSet;
        return (
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="recipes" title="Recipes">
                    <ProfileRecipes recipes={recipes} />
                </Tab>
            </Tabs>
        );
    }
};

export default Profile;
