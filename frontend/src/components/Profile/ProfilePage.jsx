import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CardColumns from 'react-bootstrap/CardColumns';

import { AuthContext } from '../../App';
import { PROFILE_QUERY } from '../../queries/queries';
import UserTab from './UserTab';
import ProfileComment from './ProfileComment';
import RecipeCard from '../Recipes/RecipeCard';
import SettingsTab from './SettingsTab';

const ProfilePage = ({ match }) => {
    const currentUser = useContext(AuthContext);
    const username = match.params.username;

    const { data, loading, error } = useQuery(PROFILE_QUERY, {
        variables: { username },
        fetchPolicy: 'network-only',
    });

    if (loading) return `Loading profile...`;
    if (error) return <Redirect to="/" />;

    if (data) {
        const profileUsername = data.profile.username;
        const recipes = data.profile.recipeSet;
        const comments = data.profile.commentSet;
        const favorites = data.profile.favoriteSet;

        return (
            <Tabs defaultActiveKey="user">
                <Tab eventKey="user" title="User Bio">
                    <UserTab profile={data.profile}/>
                </Tab>
                <Tab eventKey="recipes" title="Recipes">
                    <CardColumns className={recipes.length > 0 ? '' : 'mb-5'}>
                        {recipes.length > 0
                            ? recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
                            : currentUser && currentUser.username === username
                            ? `You haven't added any recipes`
                            : `${profileUsername} hasn't added any recipes`
                        }
                    </CardColumns>
                </Tab>
                <Tab eventKey="favorites" title="Favorites">
                    <CardColumns className={favorites.length > 0 ? '' : 'mb-5'}>
                        {favorites.length > 0
                            ? favorites.map((favorite) => <RecipeCard key={favorite.id} recipe={favorite.recipe} />)
                            : currentUser && currentUser.username === username
                            ? `You haven't saved any favorites`
                            : `${profileUsername} hasn't saved any favorites`
                        }
                    </CardColumns>
                </Tab>
                <Tab eventKey="comments" title="Comments">
                    {comments.length > 0
                        ? comments.map((comment) => <ProfileComment key={comment.id} comment={comment} />)
                        : currentUser && currentUser.username === username
                        ? `You haven't left any comments`
                        : `${profileUsername} hasn't left any comments`
                    }
                </Tab>
                {currentUser && currentUser.username === data.profile.username &&
                    <Tab eventKey="settings" title="Settings">
                        <SettingsTab profile={data.profile} />
                    </Tab>
                }
            </Tabs>
        );
    }
};

export default ProfilePage;
