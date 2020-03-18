import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import Moment from 'react-moment';
import moment from 'moment';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import CommentToolbar from './CommentToolbar';

import { UPDATE_COMMENT_MUTATION } from '../../queries/queries';

const UpdateComment = ({ comment }) => {
    const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION);
    const [editing, setEditing] = useState(false);
    const [newRating, setNewRating] = useState(comment.rating);
    const [newContent, setNewContent] = useState(comment.content);

    const handleSubmit = async (e, updateComment) => {
        e.preventDefault();

        const updatedComment = {
            id: comment.id,
            rating: newRating,
            content: newContent,
            recipeId: comment.recipeId,
        };

        console.log(updatedComment);

        await updateComment({ variables: { updatedComment } });
    };

    return (
        <Row noGutters className="pl-2 pb-1">
            <Form.Control className="p-2 mb-3" value={comment.content} type="text" as="textarea" rows="3" name="content" onChange={e => setNewContent(e.target.value)} />
        </Row>
    );
};

export default UpdateComment;
