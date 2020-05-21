import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const InstructionInput = ({ idx, instructions, handleInstructionChange, deleteInstruction }) => {
    return (
        <tr key={`cat-${idx}`}>
            <td className="align-middle text-center pr-0"><small><strong>{`${idx + 1}`}</strong></small></td>
            <td>
                <Form.Control
                    size="sm"
                    type="text"
                    name="content"
                    data-idx={idx}
                    value={instructions[idx].content}
                    onChange={handleInstructionChange}
                    required
                />
            </td>
            <td className="align-middle">
                {<i onClick={() => deleteInstruction(idx)} className="cancelBtn clickable fas fa-times mr-1"></i>}
            </td>
        </tr>
    );
};

InstructionInput.propTypes = {
    idx: PropTypes.number,
    instructions: PropTypes.array,
    handleInstructionChange: PropTypes.func,
};

export default InstructionInput;
