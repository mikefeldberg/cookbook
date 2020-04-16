import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { DELETE_COMMENT_MUTATION, GET_RECIPE_QUERY } from '../../queries/queries';

const DeleteComment = ({ commentId, setRatingIsDisabled }) => {
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        update(cache, { data: { deleteComment } }) {
            const recipeId = deleteComment.comment.recipeId;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });
            const recipe = {...data.recipe}
            const index = recipe.comments.findIndex(comment => comment.id === commentId);
            recipe.comments = [...recipe.comments.slice(0, index), ...recipe.comments.slice(index + 1)];

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });

            if (deleteComment.comment.rating) {
                setRatingIsDisabled(false)
            }
        },
    });

    const handleDelete = async () => {
        await deleteComment({ variables: { commentId } });
    };

    return <span onClick={() => handleDelete()}>Confirm Delete</span>;
};

export default DeleteComment;
