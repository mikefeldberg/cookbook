import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const IngredientInput = ({ idx, ingredients, handleIngredientChange, deleteIngredient }) => {
    const quantityId = `quantity-${idx}`;
    const nameId = `name-${idx}`;
    const preparationId = `preparation-${idx}`;

    return (
        <tr key={`cat-${idx}`}>
            <td className="align-middle">{`${idx + 1}`}</td>
            <td>
                <Form.Control
                    type="text"
                    name="quantity"
                    data-idx={idx}
                    id={quantityId}
                    value={ingredients[idx].quantity}
                    onChange={handleIngredientChange}
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    name="name"
                    data-idx={idx}
                    id={nameId}
                    value={ingredients[idx].name}
                    onChange={handleIngredientChange}
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    name="preparation"
                    data-idx={idx}
                    id={preparationId}
                    value={ingredients[idx].preparation}
                    onChange={handleIngredientChange}
                />
            </td>
            <td>
                {idx > 0 &&
                    <Button onClick={() => deleteIngredient(idx)}>
                        -
                    </Button>
                }
            </td>
        </tr>
    );
};

IngredientInput.propTypes = {
    idx: PropTypes.number,
    ingredients: PropTypes.array,
    handleIngredientChange: PropTypes.func,
};

export default IngredientInput;
