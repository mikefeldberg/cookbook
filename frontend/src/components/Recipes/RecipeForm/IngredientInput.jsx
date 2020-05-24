import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

const IngredientInput = ({ idx, ingredients, handleIngredientChange, deleteIngredient }) => {
    return (
        <tr key={`cat-${idx}`}>
            <td className="align-middle text-center pr-0"><small><strong>{`${idx + 1}`}</strong></small></td>
            <td>
                <Form.Control
                    size="sm"
                    placeholder={idx === 0 ? "1" : ''}
                    type="text"
                    name="quantity"
                    data-idx={idx}
                    value={ingredients[idx].quantity}
                    onChange={handleIngredientChange}
                />
            </td>
            <td>
                <Form.Control
                    size="sm"
                    placeholder={idx === 0 ? "sweet onion" : ''}
                    type="text"
                    name="name"
                    data-idx={idx}
                    value={ingredients[idx].name}
                    onChange={handleIngredientChange}
                    required
                />
            </td>
            <td>
                <Form.Control
                    size="sm"
                    placeholder={idx === 0 ? "chopped" : ''}
                    type="text"
                    name="preparation"
                    data-idx={idx}
                    value={ingredients[idx].preparation}
                    onChange={handleIngredientChange}
                />
            </td>
            <td className="align-middle">
                {<i onClick={() => deleteIngredient(idx)} className="cancelIcon clickable fas fa-times mr-1"></i>}
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
