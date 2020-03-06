import React from 'react';
const uuid = require('uuid/v1');

const RecipeInstructions = ({ recipe }) => {
    const instructions = recipe.instructions;

    return (
        <div className="mb-5">
            <h2>Instructions</h2>
            <ol>
                {instructions.map(instruction => {
                    return (
                        <li className="mb-3" key={uuid()}>
                            {instruction.text}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default RecipeInstructions;
