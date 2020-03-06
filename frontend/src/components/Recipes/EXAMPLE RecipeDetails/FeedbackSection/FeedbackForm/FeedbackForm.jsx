import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import RatingForm from './RatingForm';
import CommentForm from './CommentForm';

const FeedbackForm = props => {
    return (
        <Form className="mb20" onSubmit={props.handleSubmit}>
            <RatingForm 
                feedbackDisabled={props.feedbackDisabled}
                recipe={props.recipe}
                feedbackRating={props.feedbackRating}
                handleStarClick={props.handleStarClick}
            />
            <CommentForm 
                feedbackDisabled={props.feedbackDisabled}
                recipe={props.recipe}
                handleChange={props.handleChange}
                feedbackComment={props.feedbackComment}
            />
            <Button className="text-center d-flex justify-content-center" variant="primary" type="submit" disabled={props.feedbackDisabled}>
                Submit
            </Button>
        </Form>
    );
};

export default FeedbackForm;