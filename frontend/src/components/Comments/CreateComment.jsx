import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { AuthContext } from '../../App';
import { CREATE_COMMENT_MUTATION, GET_RECIPE_QUERY } from '../../queries/queries';
import StarRating from './StarRating';

const CreateComment = ({ recipeId }) => {
    const currentUser = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState(currentUser ? '' : `Log in to leave a comment`);
    const [commentsDisabled] = useState(currentUser ? false : 'disabled');

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update(cache, { data: { createComment } }) {
            const recipeId = createComment.comment.recipe.id;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });
            const recipe = {...data.recipe};
            recipe.comments = [createComment.comment, ...recipe.comments.slice(0)];

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });
        },
    });

    const handleSubmit = async e => {
        e.preventDefault();

        if (rating || content) {
            const comment = {
                content,
                rating,
                recipeId,
            };
    
            setRating(0)
            setContent('')
    
            await createComment({ variables: { comment } });
        }

    };

    return (
        <Form className="text-right" onSubmit={e => handleSubmit(e)}>
            <fieldset disabled={commentsDisabled}>
                <StarRating rating={rating} setRating={setRating} disabled={commentsDisabled} />
                <Form.Control
                    className="mb-3"
                    value={content}
                    type="text"
                    as="textarea"
                    rows="3"
                    name="content"
                    onChange={e => setContent(e.target.value)}
                />
                <Button className="mb-3" type="submit">
                    Add Comment
                </Button>
            </fieldset>
        </Form>
    );
};

export default CreateComment;
