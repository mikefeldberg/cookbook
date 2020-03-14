import React from 'react';
import Form from 'react-bootstrap/Form';

const InstructionRow = props => {
    return (
        <tr key={props.idx} >
            <td className="align-middle">{props.idx + 1} </td>
            <td className="col-1">
                <Form.Control
                    value={props.instruction.text}
                    type="text"
                    name="text"
                    onChange={props.handleInstructionChange(props.idx)}
                    className="form-control"
                />
            </td>
            <td className="col-1">
                {props.idx > 0 && 
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={props.handleDeleteSpecificInstruction(props.idx)}
                    >
                        Delete
                    </button>
                }
            </td>
        </tr>
    );
};

export default InstructionRow;
