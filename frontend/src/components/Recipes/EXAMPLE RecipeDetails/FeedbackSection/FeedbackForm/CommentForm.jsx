import React from 'react';
import Form from 'react-bootstrap/Form';

const CommentForm = props => {
    return (
        <Form.Group controlId="exampleForm.ControlTextarea1">
            {/* <Form.Label>Comment</Form.Label> */}
            <Form.Control
                name="feedbackComment"
                value={props.feedbackDisabled ? 'Please log in to rate or comment' : props.feedbackComment}
                onChange={props.handleChange}
                disabled={props.feedbackDisabled}
                as="textarea"
                rows="3"
            />
        </Form.Group>
    );
};

export default CommentForm;
