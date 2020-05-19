import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { AuthContext } from '../../App';
import { CREATE_COMMENT_MUTATION, GET_RECIPE_QUERY } from '../../queries/queries';
import NewCommentStarRating from './Comments/NewCommentStarRating'

const CreateComment = ({ recipeId, newRatingIsDisabled, setNewRatingIsDisabled }) => {
    const currentUser = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update(cache, { data: { createComment } }) {
            const recipeId = createComment.comment.recipe.id;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });
            const recipe = { ...data.recipe };
            recipe.comments = [createComment.comment, ...recipe.comments.slice(0)];

            if (createComment.comment.rating > 0) {
                recipe.rating = (recipe.rating * recipe.ratingCount + createComment.comment.rating) / (recipe.ratingCount + 1)
                recipe.ratingCount += 1
            }

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });

            if (createComment.comment.rating) {
                setNewRatingIsDisabled(true);
            }
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating || content) {
            const comment = {
                content,
                rating,
                recipeId,
            };

            setRating(0);
            setContent('');

            await createComment({ variables: { comment } });
        }
    };

    return (
        <Form className="text-right" onSubmit={(e) => handleSubmit(e)}>
            <fieldset disabled={!currentUser}>
                <NewCommentStarRating
                    rating={rating}
                    setRating={setRating}
                    newRatingIsDisabled={newRatingIsDisabled}
                />
                <Form.Control
                    className="mb-3 shadow-sm"
                    value={currentUser ? content : 'Log in to rate or comment'}
                    type="text"
                    as="textarea"
                    rows="3"
                    style={{minHeight:"80px", maxHeight:"300px"}}
                    name="content"
                    onChange={(e) => setContent(e.target.value)}
                />
                <Button disabled={!currentUser} className="mb-3" type="submit">
                    Add Comment
                </Button>
            </fieldset>
        </Form>
    );
};

export default CreateComment;
