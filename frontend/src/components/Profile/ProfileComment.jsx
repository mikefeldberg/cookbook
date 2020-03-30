import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import Moment from 'react-moment';
import moment from 'moment';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

import { UPDATE_COMMENT_MUTATION, GET_RECIPE_QUERY } from '../../queries/queries';
import CommentToolbar from '../Comments/CommentToolbar';
import { AuthContext } from '../../App';
import StarRating from '../Comments/StarRating';

const Comment = ({ comment }) => {
    const currentUser = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [newRating, setNewRating] = useState(comment.rating);
    const [newContent, setNewContent] = useState(comment.content);

    const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION, {
        update(cache, { data: { updateComment } }) {
            const recipeId = updateComment.comment.recipe.id;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });
            const recipe = {...data.recipe}
            const index = recipe.comments.findIndex(comment => comment.id === updateComment.comment.id);
            recipe.comments = [...recipe.comments.slice(0, index), updateComment.comment, ...recipe.comments.slice(index + 1)]

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });
        },
    });

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

    const isSaveEnabled = () => {
        return newContent || newRating;
    };

    return (
        <div className="border mb-2 rounded">
            <Row className="p-2">
                <Col md={1}>
                    <Link to={`/recipes/${comment.recipe.id}`}>
                        <Image
                            width={64}
                            height={64}
                            className="rounded mr-3"
                            src={
                                comment.recipe.photos.length > 0
                                    ? comment.recipe.photos[0].url
                                    : `https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_food_placeholder.jpg`
                            }
                            alt={comment.recipe.title}
                        />
                    </Link>
                </Col>
                <Col>
                    <Row noGutters>
                        <Link to={`/recipes/${comment.recipe.id}`}>{comment.recipe.title}</Link>&nbsp;posted&nbsp;
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
                            isSaveEnabled={isSaveEnabled}
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
