import React, { useState } from 'react';

import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

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

const CommentToolbar = ({ commentId, editing, setEditing, isSaveEnabled, handleCancel, handleSubmit, updateComment, setNewRatingIsDisabled }) => {
    const EditingToolbar = ({ handleCancel, handleSubmit, updateComment }) => {
        return (
            <Row noGutters className="float-right mb-2">
                {<i onClick={handleCancel} className="cancelIcon clickable fas fa-times mr-1"></i>}
                {<i onClick={e => handleSubmit(e, updateComment)}
                    className={[isSaveEnabled() ? 'clickable' : 'disabled-icon', 'confirmIcon fas fa-check'].join(' ')}></i>}
            </Row>
        );
    };

    const DefaultToolbar = ({ commentId, setEditing, setNewRatingIsDisabled }) => {
        return (
            <Row noGutters className="align-items-center float-right dropdownUnformat">
                <i onClick={() => setEditing(true)} className="editIcon clickable fas fa-pen fa-xs mr-2"></i>
                <Dropdown className="dropdownUnformat">
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                        <i className="deleteIcon clickable far fa-xs fa-trash-alt"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={CustomMenu}>
                    <Dropdown.Item disabled>
                        Are you sure?
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="p-0">
                        <DeleteComment commentId={commentId} setNewRatingIsDisabled={setNewRatingIsDisabled} />
                    </Dropdown.Item>
                    <Dropdown.Item className="p-0">
                        <ButtonGroup className="w-100">
                            <Button
                                variant="light-outline"
                                className="rounded-0 text-left"
                            >
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </Row>
        );
    };

    if (editing) {
        return <EditingToolbar handleCancel={handleCancel} handleSubmit={handleSubmit} updateComment={updateComment} />;
    } else {
        return <DefaultToolbar commentId={commentId} setEditing={setEditing} setNewRatingIsDisabled={setNewRatingIsDisabled} />;
    }
};

export default CommentToolbar;
