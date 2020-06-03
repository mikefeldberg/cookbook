import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import ShowMoreText from 'react-show-more-text';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import UserAvatar from '../Shared/UserAvatar';

const RecipeCard = ({ recipe }) => {
    const match = useRouteMatch();
    const url = match.url
    const [isExpanded, setIsExpanded] = useState(false)
    console.log(url)

    return (
        <Card className="shadow mb-4">
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
                { !url.includes('profile') &&
                    <UserAvatar user={recipe.user} size='sm' showLabel={true}/>
                }
            </Card.Body>
            { recipe.description &&
                <ListGroup variant="flush">
                    <ListGroup.Item>
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
                <ListGroup.Item className="text-center">
                    <Row>
                        {recipe.ratingCount > 0 ? (
                            <Col className="p-0 text-right" ><span style={{ color: 'gold' }}>{'★'.repeat(recipe.rating)}</span>&nbsp;({recipe.ratingCount})&nbsp;|</Col>
                        ) : (
                            <Col className="p-0 text-right" style={{ color: 'grey', cursor: 'default' }}>{'☆'.repeat(5)}&nbsp;|</Col>
                        )}
                        <Col className="p-0 text-left">&nbsp;<i className="text-danger fas fa-heart"></i>&nbsp;({recipe.favorites.length})</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};

export default RecipeCard;
