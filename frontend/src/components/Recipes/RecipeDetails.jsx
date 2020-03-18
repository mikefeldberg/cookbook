import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Moment from 'react-moment';
import moment from 'moment';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import { AuthContext } from '../../App';
import { GET_RECIPE_QUERY } from '../../queries/queries';
import CommentSection from '../Comments/CommentSection';
import RecipeToolbar from './RecipeToolbar';

const RecipeDetails = ({ match, history }) => {
    const currentUser = useContext(AuthContext);

    const id = match.params.id;
    const { data, loading, error } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipe = data.recipe;
        return (
            <Container>
                <Row noGutters className="align-items-center">
                    <h1>{recipe.title}&nbsp;</h1>
                    {currentUser && recipe.user.id === currentUser.id && 
                        <div>
                            <RecipeToolbar history={history} recipe={recipe} />
                        </div>
                    }
                </Row>
                <Row noGutters>
                    Added by {recipe.user.username} on&nbsp;
                    <Moment from={new Date()}>{recipe.createdAt}</Moment>&nbsp;
                    {moment(recipe.updatedAt).diff(moment(recipe.createdAt), 'minutes') > 1 && (
                        <span>
                            (Updated <Moment from={new Date()}>{recipe.updatedAt}</Moment>)
                        </span>
                    )}
                </Row>
                <Row noGutters className="align-items-center">
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
                    <i className="text-danger far fa-heart"></i>&nbsp;({recipe.favoriteCount})
                </Row>
                <Row className="align-items-center">
                    <Col>
                        <Image
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
    }
};

export default RecipeDetails;
