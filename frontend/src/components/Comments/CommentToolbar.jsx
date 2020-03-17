import React from 'react';
import { Link } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import DeleteComment from './DeleteComment';

const CommentToolbar = ({ comment, history }) => {
    return (
        <ButtonToolbar className="float-right mb-2">
            <Link to={`/comments/${comment.id}/edit`} className="mr-2">
                <Button size="sm" variant="secondary-inverse">
                    {<i className="fas fa-edit text-secondary"></i>}
                </Button>
            </Link>
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
                    <DeleteComment history={history} comment={comment} />
                </Dropdown.Item>
                <Dropdown.Item eventKey="2">Cancel</Dropdown.Item>
            </DropdownButton>
        </ButtonToolbar>
    );
};

export default CommentToolbar;
