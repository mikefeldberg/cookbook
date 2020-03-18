import React, { useState } from 'react';

import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';

import DeleteComment from './DeleteComment';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </span>
));

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className="list-unstyled">
                {React.Children.toArray(children).filter(
                    child => !value || child.props.children.toLowerCase().startsWith(value)
                )}
            </ul>
        </div>
    );
});

const CommentToolbar = ({ commentId, editing, setEditing, handleCancel, handleSubmit, updateComment }) => {
    const EditingToolbar = ({ handleCancel, handleSubmit, updateComment }) => {
        return (
            <Row noGutters className="float-right mb-2">
                {<i onClick={handleCancel} className="fas fa-times-circle text-danger mr-1"></i>}
                {<i onClick={e => handleSubmit(e, updateComment)} className="fas fa-check-circle text-success"></i>}
            </Row>
        );
    };

    const DefaultToolbar = ({ commentId, setEditing }) => {
        return (
            <Row noGutters className="align-items-center float-right">
                {<i onClick={() => setEditing(true)} className="fas fa-edit text-secondary mr-1"></i>}
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                        <i className="far fa-trash-alt"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={CustomMenu}>
                    <Dropdown.Item disabled eventKey="0">
                        Are you sure?
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="2">
                        <DeleteComment commentId={commentId} />
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">Cancel</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </Row>
        );
    };

    if (editing) {
        return <EditingToolbar handleCancel={handleCancel} handleSubmit={handleSubmit} updateComment={updateComment} />;
    } else {
        return <DefaultToolbar commentId={commentId} setEditing={setEditing} />;
    }
};

export default CommentToolbar;
