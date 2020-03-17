import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { CREATE_COMMENT_MUTATION, GET_RECIPE_QUERY } from '../../queries/queries';
import StarRating from './StarRating';

const CreateComment = ({recipeId}) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION)

    const handleSubmit = async e => {
        e.preventDefault();

        const comment = {
            content,
            rating,
            recipeId
        }

        const res = await createComment({ variables: { comment } });
    };

    return (
        <Form onSubmit={e => handleSubmit(e)}>
            <StarRating rating={rating} setRating={setRating} />
            <Form.Control value={content} type="text" name="content" onChange={e => setContent(e.target.value)} />
            <Button type="submit">Add Comment</Button>
        </Form>
    );
};

export default CreateComment;
