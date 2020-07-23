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
                        <span className="title">{recipe.title}</span>
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
                            <span className="text-danger">{recipe.description}</span>
                        </ShowMoreText>
                    </ListGroup.Item>
                </ListGroup>
            )}
            <ListGroup variant="flush">
                <ListGroup.Item className="text-center border-0 p-0 pb-1">
                    <Row>
                        {recipe.ratingCount > 0 ? (
                            <Col className="p-0 text-right">
                                <span style={{ color: 'gold' }}>{'★'.repeat(recipe.rating)}</span>&nbsp;({recipe.ratingCount})&nbsp;|
                            </Col>
                        ) : (
                            <Col className="p-0 text-right" style={{ color: 'grey', cursor: 'default' }}>
                                {'☆'.repeat(5)}&nbsp;|
                            </Col>
                        )}
                        <Col className="p-0 text-left">
                            &nbsp;<i className="fas fa-heart heart-color"></i>&nbsp;({recipe.favorites.length})
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};

export default RecipeCard;
