import React from 'react';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import DeleteComment from './DeleteComment';

const CommentToolbar = ({ commentId, editing, setEditing, handleCancel, handleSubmit, updateComment }) => {
    const EditingToolbar = ({handleCancel, handleSubmit, updateComment}) => {
        return (
            <ButtonToolbar className="float-right mb-2">
                <Button onClick={handleCancel} size="sm" variant="secondary-inverse">
                    {<i className="fas fa-times-circle text-danger"></i>}
                </Button>
                <Button onClick={e => handleSubmit(e, updateComment)} size="sm" variant="secondary-inverse">
                    {<i className="fas fa-check-circle text-success"></i>}
                </Button>
            </ButtonToolbar>
        );
    };

    const DefaultToolbar = ({ commentId, setEditing }) => {
        return (
            <ButtonToolbar className="float-right mb-2">
                <Button onClick={() => setEditing(true)} size="sm" variant="secondary-inverse">
                    {<i className="fas fa-edit text-secondary"></i>}
                </Button>
                <DropdownButton
                    size="sm"
                    drop="right"
                    title={<i className="fas fa-trash text-danger"></i>}
                    variant="danger-inverse"
                >
                    <Dropdown.Item disabled eventKey="0">
                        Are you sure?
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="1">
                        <DeleteComment commentId={commentId} />
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">Cancel</Dropdown.Item>
                </DropdownButton>
            </ButtonToolbar>
        );
    };

    if (editing) {
        return <EditingToolbar
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
            updateComment={updateComment}
        />
    } else {
        return <DefaultToolbar commentId={commentId} setEditing={setEditing} />
    }


};

export default CommentToolbar;
