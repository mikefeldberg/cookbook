import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ShowMoreText from 'react-show-more-text';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const ProfileRecipeCard = ({ recipe }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Card className="shadow mb-4 border-0">
            <Link to={`/recipes/${recipe.id}`}>
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

export default ProfileRecipeCard;
