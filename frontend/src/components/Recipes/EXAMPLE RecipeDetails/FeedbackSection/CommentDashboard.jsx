import React from 'react';
import Row from 'react-bootstrap/Row';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const CommentDashboard = props => {
    return (
        <Row>
            <ButtonToolbar className="mb-2">
                <Button
                    // onClick={props.toggleEdit}
                    size="sm"
                    variant="secondary-inverse"
                >
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
                    <Dropdown.Item
                        // onClick={handleDelete}
                        eventKey="1"
                    >
                        Confirm Delete
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">Cancel</Dropdown.Item>
                </DropdownButton>
            </ButtonToolbar>
        </Row>
    );
};

export default CommentDashboard;
