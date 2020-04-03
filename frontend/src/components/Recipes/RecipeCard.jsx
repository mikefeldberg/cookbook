import React from 'react';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const RecipeCard = ({ recipe }) => {
    return (
        <Card className="shadow">
            <Card.Img
                variant="top"
                src={
                    recipe.photos.length > 0
                        ? recipe.photos[0].url
                        : `https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_food_placeholder.jpg`
                }
            />
            <Card.Body>
                <Card.Title>
                    <Link style={{ textDecoration: 'none' }} to={`/recipes/${recipe.id}`}><span className="link">{recipe.title}</span></Link>
                </Card.Title>
                <Card.Text>
                    Added by <Link style={{ 'text-decoration': 'none' }} to={`/profile/${recipe.user.id}`}><span className="link">{recipe.user.username}</span></Link>
                </Card.Text>
            </Card.Body>
            { recipe.description &&
                <ListGroup variant="flush">
                    <ListGroup.Item>{recipe.description}</ListGroup.Item>
                </ListGroup>
            }
            <ListGroup variant="flush">
                <ListGroup.Item className="text-center">
                    <Row>
                        {recipe.ratingCount > 0 ? (
                            <Col className="p-0 text-right" ><span style={{ color: 'gold' }}>{'★'.repeat(recipe.rating)}</span>&nbsp;({recipe.ratingCount})&nbsp;|</Col>
                        ) : (
                            <Col className="p-0 text-right" style={{ color: 'grey' }}>{'☆'.repeat(5)}&nbsp;|</Col>
                        )}
                        <Col className="p-0 text-left">&nbsp;<i className="text-danger fas fa-heart"></i>&nbsp;({recipe.favorites.length})</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};

export default RecipeCard;
