import React from 'react';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from '../RecipeDetails.module.css';

const RecipeSummary = ({ recipe }) => {
    return (
        <Row className="mb-5">
            <Col className="p-0">
            <Image
                width={400}
                height={400}
                className={[styles.recipeSummary, 'greyBorder align-self-center'].join(' ')}
                src={recipe.displayImage}
                alt={recipe.name}
                rounded
            />
            </Col>
            <Col>
            {/* <div className={styles.recipeCard}> */}
                <Row className="mt-5">
                    <h2>Summary</h2>
                </Row>

                <Row className="mb20">
                    <span>{recipe.description}</span>
                </Row>

                <Row className="mb10">
                    <p>
                        <strong>Skill Level: </strong>
                        {recipe.skillLevel}
                    </p>
                </Row>

                {recipe.timePrep && (
                    <Row className="mb10">
                        <p>
                            <strong>Prep Time: </strong>
                            {recipe.timePrep}
                        </p>
                    </Row>
                )}

                {recipe.timeCook && (
                    <Row className="mb10">
                        <p>
                            <strong>Cook Time: </strong>
                            {recipe.timeCook}
                        </p>
                    </Row>
                )}

                {recipe.timeWait && (
                    <Row className="mb10">
                        <p>
                            <strong>Wait Time: </strong>
                            {recipe.timeWait}
                        </p>
                    </Row>
                )}

                {recipe.timeTotal && (
                    <Row className="mb10">
                        <p>
                            <strong>Total Time: </strong>
                            {recipe.timeTotal}
                        </p>
                    </Row>
                )}

                {recipe.servings && (
                    <Row>
                        <p>
                            <strong>Servings: </strong>
                            {recipe.servings}
                        </p>
                    </Row>
                )}
            {/* </div> */}
            </Col>
        </Row>
    );
};

export default RecipeSummary;
