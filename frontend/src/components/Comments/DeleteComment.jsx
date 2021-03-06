import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { DELETE_COMMENT_MUTATION, GET_RECIPE_QUERY } from '../../queries/queries';

const DeleteComment = ({ commentId, setNewRatingIsDisabled }) => {
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        update(cache, { data: { deleteComment } }) {
            const recipeId = deleteComment.comment.recipeId;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });
            const recipe = {...data.recipe}
            const index = recipe.comments.findIndex(comment => comment.id === commentId);
            recipe.comments = [...recipe.comments.slice(0, index), ...recipe.comments.slice(index + 1)];

            if (deleteComment.comment.rating > 0 && recipe.ratingCount > 1) {
                recipe.rating = (recipe.rating * recipe.ratingCount - deleteComment.comment.rating) / (recipe.ratingCount - 1)
                recipe.ratingCount -= 1
            }
            if (deleteComment.comment.rating > 0 && recipe.ratingCount === 1) {
                recipe.rating = 0
                recipe.ratingCount = 0
            }

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });

            if (deleteComment.comment.rating) {
                setNewRatingIsDisabled(false)
            }
        },
    });

    const handleDelete = async () => {
        await deleteComment({ variables: { commentId } });
    };

    return (
        <ButtonGroup className="w-100" onClick={() => handleDelete()}>
            <Button
                variant="light-outline"
                className="rounded-0 text-left"
            >
                Confirm Delete
            </Button>
        </ButtonGroup>
    );
};

export default DeleteComment;
