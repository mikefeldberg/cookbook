import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { AuthContext } from '../../App';
import { CREATE_COMMENT_MUTATION } from '../../queries/queries';
import StarRating from './StarRating';

const CreateComment = ({ recipeId }) => {
    const currentUser = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [commentsDisabled, setCommentsDisabled] = useState(currentUser ? false : true)

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION);

    const handleSubmit = async e => {
        e.preventDefault();
        console.log('submitting comment')

        const comment = {
            content,
            rating,
            recipeId,
        };

        await createComment({ variables: { comment } });
    };

    return (
        <Form className="text-right" onSubmit={e => handleSubmit(e)}>
            <fieldset disabled={commentsDisabled} >
            <StarRating rating={rating} setRating={setRating} />
            <Form.Control className="mb-3" value={content} type="text" as="textarea" rows="3" name="content" onChange={e => setContent(e.target.value)} />
            <Button className="mb-3" type="submit">Add Comment</Button>
            </fieldset>
        </Form>
    );
};

export default CreateComment;
