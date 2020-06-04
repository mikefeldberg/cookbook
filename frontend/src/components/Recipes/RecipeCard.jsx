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
    const url = match.url
    const [isExpanded, setIsExpanded] = useState(false)
    const [inFavorites, setInFavorites] = useState(false)
    console.log(url)

    useEffect(() => {
        if (currentUser) {
            const favoritedUserIds = recipe.favorites.map(f => f.user.id)
            setInFavorites(favoritedUserIds.includes(currentUser.id))
            console.log(inFavorites)
        }
    });

    const [createFavorite] = useMutation(CREATE_FAVORITE_MUTATION, {
        update(cache, { data: { createFavorite } }) {
            const recipeId = createFavorite.favorite.recipe.id;
            const data = cache.readQuery({ query: GET_RECIPES_QUERY });
            const recipes = [ ...data.recipes ];
            const recipe = recipes[index]
            recipe.favorites.push(createFavorite.favorite)

            cache.writeQuery({
                query: GET_RECIPES_QUERY,
                data: { recipes },
            });
        },
    });

    const [deleteFavorite] = useMutation(DELETE_FAVORITE_MUTATION, {
        update(cache, { data: { deleteFavorite } }) {
            const recipeId = deleteFavorite.recipeId;
            const data = cache.readQuery({ query: GET_RECIPES_QUERY });
            const recipes = [ ...data.recipes ];
            const recipe = recipes[index]
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
        <Card className="shadow mb-4 border-0">
            {inFavorites && (
                <i
                    onClick={() => removeFromFavorites()}
                    className="fas fa-heart fa-lg clickable card-heart-btn card-heart-unfav"
                ></i>
            )}
            {!inFavorites && (
                <i
                    onClick={() => addToFavorites()}
                    className="far fa-heart fa-lg clickable card-heart-btn card-heart-fav"
                ></i>
            )}

            <Link  to={`/recipes/${recipe.id}`}>
                {/* <div className="corner-shadow"></div> */}
                <Card.Img
                    variant="top"
                    src={
                        recipe.photos.length > 0
                            ? recipe.photos[0].url
                            : `/recipe_placeholder.png`
                    }
                />

            </Link>
            <Card.Body className="pt-3 pb-3">
                <Card.Title>
                    <Link style={{ textDecoration: 'none' }} to={`/recipes/${recipe.id}`}><span className="link">{recipe.title}</span></Link>
                </Card.Title>
                { !url.includes('profile') &&
                    <UserAvatar user={recipe.user} size='sm' showLabel={true}/>
                }
            </Card.Body>
            { recipe.description &&
                <ListGroup variant="flush">
                    <ListGroup.Item className="border-0 pt-0">
                        <ShowMoreText
                            lines={7}
                            more='Read more'
                            less='Read less'
                            onClick={() => setIsExpanded(!isExpanded)}
                            expanded={isExpanded}
                            anchorClass='link'
                        >
                            {recipe.description}
                        </ShowMoreText>
                    </ListGroup.Item>
                </ListGroup>
            }
            <ListGroup variant="flush">
                <ListGroup.Item className="text-center border-0 p-0 pb-1">
                    <Row>
                        {recipe.ratingCount > 0 ? (
                            <Col className="p-0 text-right" ><span style={{ color: 'gold' }}>{'★'.repeat(recipe.rating)}</span>&nbsp;({recipe.ratingCount})&nbsp;|</Col>
                        ) : (
                            <Col className="p-0 text-right" style={{ color: 'grey', cursor: 'default' }}>{'☆'.repeat(5)}&nbsp;|</Col>
                        )}
                        <Col className="p-0 text-left">&nbsp;<i className="fas fa-heart heart-color"></i>&nbsp;
                            <small>({recipe.favorites.length})</small>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};

export default RecipeCard;
