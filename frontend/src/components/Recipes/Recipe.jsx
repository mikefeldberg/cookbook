import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import Moment from 'react-moment';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import { AuthContext } from '../../App';
import { GET_RECIPE_QUERY, CREATE_FAVORITE_MUTATION, DELETE_FAVORITE_MUTATION } from '../../queries/queries';
import CommentSection from '../Comments/CommentSection';
import RecipeToolbar from './RecipeToolbar';

const Recipe = ({ recipe, favorited }) => {
    const currentUser = useContext(AuthContext);
    const [inFavorites, setInFavorites] = useState(favorited);
    const [pointer] = useState(currentUser ? 'pointer' : '');

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
            <Row noGutters className="mb-11">
                Added by&nbsp;<Link to={`/profile/${recipe.user.id}`}>{recipe.user.username}</Link>&nbsp;on&nbsp;
                <Moment from={new Date()}>{recipe.createdAt}</Moment>
            </Row>
            <Row noGutters className="align-items-center mb-2">
                {recipe.ratingCount > 0 ? (
                    <>
                        <span style={{ color: 'gold' }}>{'★'.repeat(recipe.rating)}</span>&nbsp;
                        <span>({recipe.ratingCount})&nbsp;|&nbsp;</span>
                    </>
                ) : (
                    <span style={{ color: 'grey' }}>
                        {'☆'.repeat(5)}
                        &nbsp;|&nbsp;
                    </span>
                )}
                {inFavorites && (
                    <i
                        style={{ cursor: pointer }}
                        onClick={() => removeFromFavorites(recipe.id, deleteFavorite)}
                        className="text-danger fas fa-heart"
                    ></i>
                )}
                {!inFavorites && (
                    <i
                        style={{ cursor: pointer }}
                        onClick={() => addToFavorites(recipe.id, createFavorite)}
                        className="text-danger far fa-heart"
                    ></i>
                )}
                &nbsp;
                {recipe.favorites.length > 0 && <span>({recipe.favorites.length})</span>}
            </Row>
            <Row className="align-items-center">
                <Col>
                    <Image
                        rounded
                        src={
                            recipe.photos.length > 0
                                ? recipe.photos[0].url
                                : `https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_food_placeholder.jpg`
                        }
                        fluid
                    />
                </Col>
                <Col className="align-content-around">
                    <Row className="mb-2">{recipe.description}</Row>
                    <Row className="mb-2">Difficulty: {recipe.skillLevel}</Row>
                    <Row className="mb-2">
                        Prep: {recipe.prepTime} min &nbsp;|&nbsp; Cook: {recipe.cookTime} min &nbsp;|&nbsp; Wait:{' '}
                        {recipe.waitTime} min &nbsp;|&nbsp; Total: {recipe.totalTime} min
                    </Row>
                    <Row>Servings: {recipe.servings}</Row>
                </Col>
            </Row>
            <>
                <h1>Ingredients</h1>
                <ul>
                    {recipe.ingredients.map(ingredient => (
                        <li key={ingredient.id}>
                            <strong>{ingredient.quantity}</strong> {ingredient.name}
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
                <h1>Instructions</h1>
                <ol>
                    {recipe.instructions.map(instruction => (
                        <li key={instruction.id}>{instruction.content}</li>
                    ))}
                </ol>
            </>
            <CommentSection recipeId={recipe.id} comments={recipe.comments} />
        </Container>
    );
};

export default Recipe;
