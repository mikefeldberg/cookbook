import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';

import Row from 'react-bootstrap/Row';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

const RecipeDashboard = ({ handleDelete, user, recipe }) => {
    return (
        <React.Fragment>
            <Row>
                <h1>{recipe.name}</h1>
            </Row>
            <Row>
                <p>
                    Added by {recipe.user.name + ' '} 
                    <span className="text-muted">
                        <Moment from={new Date()}>{recipe.createdAt}</Moment>
                    </span>
                </p>
            </Row>
            {user ?
            (
                user.id === recipe.userId && (
                    <Row>
                        <ButtonToolbar className="mb-2">
                            <Link to={`/recipes/${recipe.id}/edit`} className="mr-2">
                                <Button size="sm" variant="secondary-inverse">
                                    {<i className="fas fa-edit text-secondary"></i>}
                                </Button>
                            </Link>
                            <DropdownButton size="sm" drop="right" title={<i className="fas fa-trash text-danger"></i>} variant="danger-inverse">
                                <Dropdown.Item disabled eventKey="0">
                                    Are you sure?
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleDelete} eventKey="1">Confirm Delete</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Cancel</Dropdown.Item>
                            </DropdownButton>
                        </ButtonToolbar>
                    </Row>
                )
            ) : (
                <div></div>
            )}

            <Row>
                <span className="starRating mb-2 mr-1">
                    {recipe.ratingCount > 0 ? '★'.repeat(recipe.rating) : '☆'.repeat(5)}
                </span>
                <span className="mr-1">({recipe.ratingCount})</span>
                <span className="mr-1">|</span>
                <i className="mr-1 fas fa-heart favorite"></i> ({recipe.favoriteCount})
            </Row>
        </React.Fragment>
    );
};

export default RecipeDashboard;
