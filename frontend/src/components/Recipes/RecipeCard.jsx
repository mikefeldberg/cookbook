import React, { useState, useContext, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import ShowMoreText from 'react-show-more-text';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { AuthContext } from '../../App';
import { GET_RECIPES_QUERY, CREATE_FAVORITE_MUTATION, DELETE_FAVORITE_MUTATION } from '../../queries/queries';
import UserAvatar from '../Shared/UserAvatar';

const RecipeCard = ({ recipe, index }) => {
    const currentUser = useContext(AuthContext);
    const match = useRouteMatch();
    const url = match.url;
    const [isExpanded, setIsExpanded] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const favoritedUserIds = recipe.favorites.map((f) => f.user.id);
            setInFavorites(favoritedUserIds.includes(currentUser.id));
        }
    }, [currentUser, recipe.favorites, inFavorites]);

    const [createFavorite] = useMutation(CREATE_FAVORITE_MUTATION, {
        update(cache, { data: { createFavorite } }) {
            const data = cache.readQuery({ query: GET_RECIPES_QUERY });
            const recipes = [...data.recipes];
            const recipe = recipes[index];
            recipe.favorites.push(createFavorite.favorite);

            cache.writeQuery({
                query: GET_RECIPES_QUERY,
                data: { recipes },
            });
        },
    });

    const [deleteFavorite] = useMutation(DELETE_FAVORITE_MUTATION, {
        update(cache, { data: { deleteFavorite } }) {
            const data = cache.readQuery({ query: GET_RECIPES_QUERY });
            const recipes = [...data.recipes];
            const recipe = recipes[index];
            recipe.favorites.pop();

            cache.writeQuery({
                query: GET_RECIPES_QUERY,
                data: { recipes },
            });
        },
    });

    const addToFavorites = async () => {
        if (currentUser) {
            const favorite = {
                recipeId: recipe.id,
            };

            if (!inFavorites) {
                setInFavorites(true);
                await createFavorite({ variables: { favorite } });
            }
        }
    };

    const removeFromFavorites = async () => {
        if (currentUser) {
            if (inFavorites) {
                setInFavorites(false);
                await deleteFavorite({ variables: { recipeId: recipe.id } });
            }
        }
    };

    return (
        <Card className="mt-3 mb-3 border-light">
            <div className="heart-background"></div>
            {inFavorites && (
                <i
                    onClick={() => removeFromFavorites()}
                    className="fas fa-heart fa-lg clickable card-heart-btn card-heart-btn-unfav"
                ></i>
            )}
            {!inFavorites && (
                <i
                    onClick={() => addToFavorites()}
                    className="far fa-heart fa-lg clickable card-heart-btn card-heart-btn-fav"
                ></i>
            )}

            <Link to={`/recipes/${recipe.id}`}>
                <Card.Img
                    id="card-photo"
                    variant="top"
                    src={recipe.photos.length > 0 ? recipe.photos[0].url : `/recipe_placeholder.png`}
                    className="border-light"
                />
            </Link>
            <Card.Body className="pt-3 pb-3">
                <Card.Title>
                    <Link style={{ textDecoration: 'none' }} to={`/recipes/${recipe.id}`}>
                        <span className="text-dark">{recipe.title}</span>
                    </Link>
                </Card.Title>
                {!url.includes('profile') && <UserAvatar user={recipe.user} size="sm" showLabel={true} />}
            </Card.Body>
            {recipe.description && (
                <ListGroup variant="flush">
                    <ListGroup.Item className="border-0 pt-0">
                        <ShowMoreText
                            lines={7}
                            more="Read more"
                            less="Read less"
                            onClick={() => setIsExpanded(!isExpanded)}
                            expanded={isExpanded}
                            anchorClass="link"
                        >
                            {recipe.description}
                        </ShowMoreText>
                    </ListGroup.Item>
                </ListGroup>
            )}
            <ListGroup variant="flush">
                <ListGroup.Item className="border-0 pt-0">
                    {recipe.ratingCount > 0 ? (
                        <>
                            <span style={{ color: 'gold' }}>{'★'.repeat(recipe.rating)}</span>&nbsp;(
                            {recipe.ratingCount})&nbsp;<span style={{ color: 'rgb(134, 134, 134)' }}>|</span>
                        </>
                    ) : (
                        <>
                            <span style={{ color: '#bdbdbd' }}>{'☆'.repeat(5)}</span>&nbsp;<span style={{ color: 'rgb(134, 134, 134)' }}>|</span>
                        </>
                    )}
                    <>
                        &nbsp;<i className="fas fa-heart heart-color"></i>&nbsp;({recipe.favorites.length})
                    </>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};

export default RecipeCard;
