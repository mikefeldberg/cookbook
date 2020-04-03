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
                Added by&nbsp;<Link style={{ 'text-decoration': 'none' }} to={`/profile/${recipe.user.id}`}><span className="link">{recipe.user.username}</span></Link>&nbsp;
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
            <Row className="mb-5 align-items-center">
                <Col>
                    <div className="shadow">
                        <Image
                            rounded
                            src={
                                recipe.photos.length > 0
                                    ? recipe.photos[0].url
                                    : `https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_food_placeholder.jpg`
                            }
                            fluid
                            className="shadow"
                        />
                    </div>
                </Col>
                <Col className="align-content-around">
                    <Row className="mb-2">{recipe.description}</Row>
                    <Row className="mb-2">Difficulty: {recipe.skillLevel}</Row>
                    {/* <Row className="mb-2">
                        Prep: {recipe.prepTime} min &nbsp;|&nbsp;Cook: {recipe.cookTime} min &nbsp;|&nbsp;Wait:&nbsp;
                        {recipe.waitTime} min &nbsp;|&nbsp;Total: {recipe.totalTime} min
                    </Row> */}
                    <Row className="mb-2">
                        { recipe.prepTime > 0 ? (<span>Prep: {(recipe.prepTime - recipe.prepTime % 60) / 60 > 0 ? (recipe.prepTime - recipe.prepTime % 60) / 60 + 'h' : ''} {recipe.prepTime % 60 > 0 ? recipe.prepTime % 60 + 'm' : ''} &nbsp;|&nbsp;</span>) : ('') }
                        { recipe.cookTime > 0 ? (<span>Cook: {(recipe.cookTime - recipe.cookTime % 60) / 60 > 0 ? (recipe.cookTime - recipe.cookTime % 60) / 60 + 'h' : ''} {recipe.cookTime % 60 > 0 ? recipe.cookTime % 60 + 'm' : ''} &nbsp;|&nbsp;</span>) : ('') }
                        { recipe.waitTime > 0 ? (<span>Wait: {(recipe.waitTime - recipe.waitTime % 60) / 60 > 0 ? (recipe.waitTime - recipe.waitTime % 60) / 60 + 'h' : ''} {recipe.waitTime % 60 > 0 ? recipe.waitTime % 60 + 'm' : ''} &nbsp;|&nbsp;</span>) : ('') }
                        { recipe.totalTime > 0 ? (<span>Total: {(recipe.totalTime - recipe.totalTime % 60) / 60 > 0 ? (recipe.totalTime - recipe.totalTime % 60) / 60 + 'h' : ''} {recipe.totalTime % 60 > 0 ? recipe.totalTime % 60 + 'm' : ''}</span>) : ('') }
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
