import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const RecipeSpecs = ({ recipe }) => {
    return (
        <Col className="align-content-around">
            <Row className="mb-2">{recipe.description}</Row>
            <Row className="mb-2">
                <span className="font-weight-bold">Difficulty:</span>&nbsp;{recipe.skillLevel}
            </Row>
            <Row className="mb-2">
                {recipe.prepTime > 0 ? (
                    <>
                        <span className="font-weight-bold">Prep:</span>
                        &nbsp;
                        <span>
                            {(recipe.prepTime - (recipe.prepTime % 60)) / 60 > 0
                                ? (recipe.prepTime - (recipe.prepTime % 60)) / 60 + 'h'
                                : ''}{' '}
                            {recipe.prepTime % 60 > 0 ? (recipe.prepTime % 60) + 'm' : ''} &nbsp;|&nbsp;
                        </span>
                    </>
                ) : (
                    ''
                )}
                {recipe.cookTime > 0 ? (
                    <>
                        <span className="font-weight-bold">Cook:</span>
                        &nbsp;
                        <span>
                            {(recipe.cookTime - (recipe.cookTime % 60)) / 60 > 0
                                ? (recipe.cookTime - (recipe.cookTime % 60)) / 60 + 'h'
                                : ''}{' '}
                            {recipe.cookTime % 60 > 0 ? (recipe.cookTime % 60) + 'm' : ''} &nbsp;|&nbsp;
                        </span>
                    </>
                ) : (
                    ''
                )}
                {recipe.waitTime > 0 ? (
                    <>
                        <span className="font-weight-bold">Wait:</span>
                        &nbsp;
                        <span>
                            {(recipe.waitTime - (recipe.waitTime % 60)) / 60 > 0
                                ? (recipe.waitTime - (recipe.waitTime % 60)) / 60 + 'h'
                                : ''}{' '}
                            {recipe.waitTime % 60 > 0 ? (recipe.waitTime % 60) + 'm' : ''} &nbsp;|&nbsp;
                        </span>
                    </>
                ) : (
                    ''
                )}
                {recipe.totalTime > 0 ? (
                    <>
                        <span className="font-weight-bold">Total:</span>
                        &nbsp;
                        <span>
                            {(recipe.totalTime - (recipe.totalTime % 60)) / 60 > 0
                                ? (recipe.totalTime - (recipe.totalTime % 60)) / 60 + 'h'
                                : ''}{' '}
                            {recipe.totalTime % 60 > 0 ? (recipe.totalTime % 60) + 'm' : ''}
                        </span>
                    </>
                ) : (
                    ''
                )}
            </Row>
            <Row><span className="font-weight-bold">Servings:</span>&nbsp;{recipe.servings}</Row>
        </Col>
    );
};

export default RecipeSpecs;
