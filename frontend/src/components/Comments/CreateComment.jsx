import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import StarRating from './StarRating';


const CreateComment = () => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(rating);
        console.log(content);
    }

    return (
        <Form onSubmit={e => handleSubmit(e)}>
            <StarRating rating={rating} setRating={setRating} />
            {/* <Form.Control value={rating} type="text" name="rating" onChange={e => setRating(e.target.value)} /> */}
            <Form.Control value={content} type="text" name="content" onChange={e => setContent(e.target.value)} />
            <Button type="submit">Add Comment</Button>
        </Form>
    );
};

export default CreateComment;
