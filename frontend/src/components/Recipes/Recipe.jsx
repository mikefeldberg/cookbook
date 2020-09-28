import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import Moment from 'react-moment';
import { Link as ScrollLink } from "react-scroll"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import { AuthContext } from '../../App';
import { GET_RECIPE_QUERY, CREATE_FAVORITE_MUTATION, DELETE_FAVORITE_MUTATION } from '../../queries/queries';
import CommentSection from '../Comments/CommentSection';
import RecipeToolbar from './RecipeToolbar';
import RecipeSpecs from './RecipeSpecs';

const Recipe = ({ recipe, favorited }) => {
    const currentUser = useContext(AuthContext);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    const [inFavorites, setInFavorites] = useState(favorited);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }
        console.log(dimensions)
        window.addEventListener('resize', handleResize)
    })

    const [createFavorite] = useMutation(CREATE_FAVORITE_MUTATION, {
        update(cache, { data: { createFavorite } }) {
            const recipeId = createFavorite.favorite.recipe.id;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });
            const recipe = data.recipe;

            recipe.favorites.push({ user: { id: currentUser.id, __typename: 'UserType' }, __typename: 'FavoriteType' });

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });
        },
    });

    const [deleteFavorite] = useMutation(DELETE_FAVORITE_MUTATION, {
        update(cache, { data: { deleteFavorite } }) {
            const recipeId = deleteFavorite.recipeId;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });

            const recipe = data.recipe;
            recipe.favorites.pop();

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });
        },
    });

    const addToFavorites = async (recipeId, createFavorite) => {
        if (currentUser) {
            const favorite = {
                recipeId,
            };

            if (!inFavorites) {
                setInFavorites(true);
                await createFavorite({ variables: { favorite } });
            }
        }
    };

    const removeFromFavorites = async (recipeId, deleteFavorite) => {
        if (currentUser) {
            if (inFavorites) {
                setInFavorites(false);
                await deleteFavorite({ variables: { recipeId } });
            }
        }
    };

    return (
        <Container>
            <Row noGutters className="align-items-center">
                <h1>{recipe.title}&nbsp;</h1>
                {currentUser && recipe.user.id === currentUser.id && (
                    <div>
                        <RecipeToolbar recipe={recipe} />
                    </div>
                )}
            </Row>
            <Row noGutters className="mb-1">
                Added by&nbsp;<Link style={{ textDecoration: 'none' }} to={`/profile/${recipe.user.username}`}><span className="link">{recipe.user.username}</span></Link>&nbsp;
                <Moment from={new Date()}>{recipe.createdAt}</Moment>
            </Row>
            <Row noGutters className="align-items-center mb-2">
                {recipe.ratingCount > 0 ? (
                    <>
                        <span style={{ color: 'gold', cursor: 'default' }}>{'★'.repeat(recipe.rating)}</span>&nbsp;
                        <span>({recipe.ratingCount})&nbsp;|&nbsp;</span>
                    </>
                ) : (
                    <ScrollLink
                        activeClass="active"
                        to="comment-section"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                    >
                    <span style={{ color: 'grey', cursor: 'default' }}>
                        {'☆'.repeat(5)}
                        &nbsp;|&nbsp;
                    </span>
                    </ScrollLink>
                )}
                {inFavorites && (
                    <div
                        onClick={() => removeFromFavorites(recipe.id, deleteFavorite)}
                    >
                        <i
                            className="fas fa-heart unfav-heart"
                        ></i>
                    </div>
                )}
                {!inFavorites && (
                    <div
                        onClick={() => addToFavorites(recipe.id, createFavorite)}
                    >
                        <i
                            className="far fa-heart fav-heart"
                        ></i>
                    </div>
                )}
                &nbsp;
                {recipe.favorites.length > 0 && <span>({recipe.favorites.length})</span>}
            </Row>

            {dimensions.width >= 1000 &&
                <Row className="mb-5 align-items-center">
                    <Col>
                        <Image
                            rounded
                            src={
                                recipe.photos.length > 0
                                    ? recipe.photos[0].url
                                    : `/recipe_placeholder.png`
                            }
                            fluid
                            className="shadow-lg"
                        />
                    </Col>
                    <RecipeSpecs recipe={recipe} />
                </Row>
            }
            {dimensions.width < 1000 &&
                <Col className="p-0 mb-5 align-items-center">
                    <Image
                        rounded
                        src={
                            recipe.photos.length > 0
                                ? recipe.photos[0].url
                                : `/recipe_placeholder.png`
                        }
                        fluid
                        className="mb-3 shadow-lg"
                    />
                    <RecipeSpecs recipe={recipe} />
                </Col>
            }

            <>
                <h2>Ingredients</h2>
                <ul className="ingredientsList">
                    {recipe.ingredients.map(ingredient => (
                        <li key={ingredient.id}>
                            <strong className="ml-2">{ingredient.quantity}</strong> {ingredient.name}
                            {ingredient.preparation && (
                                <>
                                    <> (</>
                                    <span className="text-muted">{ingredient.preparation}</span>
                                    <>)</>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </>
            <>
                <h2>Instructions</h2>
                <ol>
                    {recipe.instructions.map(instruction => (
                        <li key={instruction.id}>{instruction.content}</li>
                    ))}
                </ol>
            </>
            <div id="comment-section"></div>
            <CommentSection recipeId={recipe.id} comments={recipe.comments} />
        </Container>
    );
};

export default Recipe;
