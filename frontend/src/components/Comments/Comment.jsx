import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import Moment from 'react-moment';
import moment from 'moment';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

import { UPDATE_COMMENT_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';
import CommentToolbar from './CommentToolbar';
import StarRating from './StarRating';

const Comment = ({ comment }) => {
    const currentUser = useContext(AuthContext);
    const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION);
    const [editing, setEditing] = useState(false);
    const [newRating, setNewRating] = useState(comment.rating);
    const [newContent, setNewContent] = useState(comment.content);

    const handleCancel = () => {
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
                            className="rounded mr-3"
                            src="https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_avatarplaceholder.png"
                            alt={comment.user.username}
                        />
                    </Link>
                </Col>
                <Col>
                    <Row noGutters>
                        <Link to={`/profile/${comment.user.username}`}>{comment.user.username}</Link>&nbsp;posted&nbsp;
                        <Moment from={new Date()}>{comment.createdAt}</Moment>&nbsp;
                        {moment(comment.updatedAt).diff(moment(comment.createdAt), 'minutes') > 1 && (
                            <span>
                                (Updated <Moment from={new Date()}>{comment.updatedAt}</Moment>)
                            </span>
                        )}
                    </Row>
                    {!editing && <Row noGutters className="selected">{'★'.repeat(comment.rating)}</Row>}
                    {editing && (
                        <Row noGutters>
                            <StarRating rating={newRating} setRating={setNewRating} />
                        </Row>
                    )}
                </Col>
                <Col md={2}>
                    {currentUser && currentUser.id === comment.user.id &&
                        <CommentToolbar
                            commentId={comment.id}
                            editing={editing}
                            setEditing={setEditing}
                            handleCancel={handleCancel}
                            handleSubmit={handleSubmit}
                            updateComment={updateComment}
                        />
                    }
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
