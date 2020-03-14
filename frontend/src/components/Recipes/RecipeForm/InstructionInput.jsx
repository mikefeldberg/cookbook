import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const InstructionInput = ({ idx, instructions, handleInstructionChange, deleteInstruction }) => {
    const contentId = `content-${idx}`;

    return (
        <tr key={`cat-${idx}`}>
            <td className="align-middle">{`${idx + 1}`}</td>
            <td>
                <Form.Control
                    type="text"
                    name="content"
                    data-idx={idx}
                    id={contentId}
                    value={instructions[idx].content}
                    onChange={handleInstructionChange}
                />
            </td>
            <td>
                {idx > 0 &&
                    <Button onClick={() => deleteInstruction(idx)}>
                    -
                    </Button>
                }
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
