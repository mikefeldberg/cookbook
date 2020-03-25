import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { PROFILE_QUERY } from '../../queries/queries';
import ProfileRecipes from './ProfileRecipes';
import ProfileFavorites from './ProfileFavorites';
import ProfileComment from './ProfileComment';

const Profile = ({ match }) => {
    const id = match.params.id;

    const { data, loading, error } = useQuery(PROFILE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipes = data.profile.recipeSet;
        const comments = data.profile.commentSet;
        const favorites = data.profile.favoriteSet;
        
        return (
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="recipes" title="Recipes">
                    <ProfileRecipes recipes={recipes} />
                </Tab>
                <Tab eventKey="favorites" title="Favorites">
                    <ProfileFavorites favorites={favorites} />
                </Tab>
                <Tab eventKey="comments" title="Comments">
                    {comments.length > 0 && comments.map(comment => <ProfileComment key={comment.id} comment={comment} />)}
                </Tab>
            </Tabs>
        );
    }
};

export default Profile;
