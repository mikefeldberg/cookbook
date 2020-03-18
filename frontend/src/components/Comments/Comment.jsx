import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import Moment from 'react-moment';
import moment from 'moment';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';

import { UPDATE_COMMENT_MUTATION } from '../../queries/queries';
import CommentToolbar from './CommentToolbar';
import UpdateComment from './UpdateComment';

const Comment = ({ comment }) => {
    const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION);
    const [editing, setEditing] = useState(false);
    const [newRating, setNewRating] = useState(comment.rating);
    const [newContent, setNewContent] = useState(comment.content);

    const handleCancel = () => {
        console.log('@@@@@@@@@@@@@@@@@@@@@@handlecancel')
        setEditing(false);
        setNewRating(comment.rating);
        setNewContent(comment.content);
    };

    const handleSubmit = async (e, updateComment) => {
        e.preventDefault();

        const updatedComment = {
            id: comment.id,
            content: newContent,
            rating: newRating,
            recipeId: comment.recipe.id,
        };

        // console.log(updatedComment);
        await updateComment({ variables: { comment: updatedComment } });

        setEditing(false);
    };

    return (
        <div className="border mb-2 rounded">
            <Row className="p-2">
                <Col md={1}>
                    <Link to={`/profile/${comment.user.username}`}>
                        <Image
                            width={64}
                            height={64}
                            className="rounded mr-3 greyBorder"
                            src="https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_avatarplaceholder.png"
                            alt={comment.user.username}
                        />
                    </Link>
                </Col>
                <Col>
                    <Row>
                        <Link to={`/profile/${comment.user.username}`}>{comment.user.username}</Link>&nbsp;posted&nbsp;
                        <Moment from={new Date()}>{comment.createdAt}</Moment>&nbsp;
                        {moment(comment.updatedAt).diff(moment(comment.createdAt), 'minutes') > 1 && (
                            <span>
                                (Updated <Moment from={new Date()}>{comment.updatedAt}</Moment>)
                            </span>
                        )}
                    </Row>
                    <Row className="selected">{'★'.repeat(comment.rating)}</Row>
                </Col>
                <Col md={2}>
                    <CommentToolbar
                        commentId={comment.id}
                        editing={editing}
                        setEditing={setEditing}
                        handleCancel={handleCancel}
                        handleSubmit={handleSubmit}
                        updateComment={updateComment}
                    />
                </Col>
            </Row>
            {editing && (
                <div className="p-2">
                    <Form.Control
                        className="p-1"
                        value={newContent}
                        type="text"
                        as="textarea"
                        rows="3"
                        name="content"
                        onChange={e => setNewContent(e.target.value)}
                    />
                </div>
            )}
            {!editing && (
                <Row noGutters className="pl-2 pb-1">
                    {comment.content}
                </Row>
            )}
        </div>
    );
};

export default Comment;
