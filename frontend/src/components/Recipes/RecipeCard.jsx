import React from 'react';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const RecipeCard = ({ recipe }) => {
    return (
        <Card border="primary" style={{ width: '18rem' }}>
            <Card.Img variant="top" src={recipe.photos.length > 0 ? recipe.photos[0].url : `https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_food_placeholder.jpg`}/>
            <Card.Body>
                <Card.Title>
                    <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                </Card.Title>
                <Card.Text>
                    Added by <Link to={`/profile/${recipe.user.id}`}>{recipe.user.username}</Link>
                </Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
                <ListGroup.Item>This</ListGroup.Item>
                <ListGroup.Item>ListGroup</ListGroup.Item>
            </ListGroup>
            <Card.Body>
                <Card.Text>{recipe.description}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default RecipeCard;
