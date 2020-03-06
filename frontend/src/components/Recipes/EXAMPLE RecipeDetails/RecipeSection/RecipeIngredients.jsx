import React from 'react';
import Row from 'react-bootstrap/Row';
const uuid = require('uuid/v1');


const RecipeIngredients = ({recipe}) => {
    const ingredients = recipe.ingredients;
    
    return (
        <div className="mb-5">
            <h2>Ingredients</h2>
            {ingredients.map(ingredient => {
                return (
                    <Row className="mb-3" key={uuid()}>
                        <p className="ingredientQty">{ingredient.quantity}</p>
                        <p className="ingredientName">{ingredient.item}</p>
                        <p className="ingredientPrep">{ingredient.preparation}</p>
                    </Row>
                )
            })}
        </div>
    );
};
 
export default RecipeIngredients;