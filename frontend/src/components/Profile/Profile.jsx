import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CardColumns from 'react-bootstrap/CardColumns';

import { PROFILE_QUERY } from '../../queries/queries';
import ProfileComment from './ProfileComment';
import RecipeCard from '../Recipes/RecipeCard';

const Profile = ({ match }) => {
    const id = match.params.id;

    const { data, loading, error } = useQuery(PROFILE_QUERY, {
        variables: { id },
        fetchPolicy: 'network-only',
    });

    if (loading) return `Loading recipe...`;
    if (error) return <Redirect to="/" />;

    if (data) {
        const recipes = data.profile.recipeSet;
        const comments = data.profile.commentSet;
        const favorites = data.profile.favoriteSet;

        return (
            <>
                <Tabs defaultActiveKey="info">
                    <Tab eventKey="info" title="Info">
                        User Info Here
                    </Tab>
                    <Tab eventKey="recipes" title="Recipes">
                        <CardColumns>
                            {recipes.length > 0 ? (
                                recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)
                                ) : (
                                    `You haven't added any recipes`
                                )
                            }
                        </CardColumns>
                    </Tab>
                    <Tab eventKey="favorites" title="Favorites">
                        <CardColumns>
                            {favorites.length > 0
                                ? favorites.map(favorite => <RecipeCard key={favorite.id} recipe={favorite.recipe} />)
                                : `You haven't saved any favorites`}
                        </CardColumns>
                    </Tab>
                    <Tab eventKey="comments" title="Comments">
                        {comments.length > 0
                            ? comments.map(comment => <ProfileComment key={comment.id} comment={comment} />)
                            : `You haven't left any comments`}
                    </Tab>
                </Tabs>
            </>
        );
    }
};

export default Profile;
