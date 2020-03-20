import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { DELETE_COMMENT_MUTATION, GET_RECIPE_QUERY } from '../../queries/queries';

const DeleteComment = ({ commentId }) => {
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        update(cache, { data: { deleteComment } }) {
            const recipeId = deleteComment.recipeId;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });
            const recipe = {...data.recipe}
            // console.log(recipe)
            const index = recipe.comments.findIndex(comment => comment.id === commentId);
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~debug1');
            // debugger
            recipe.comments = [...recipe.comments.slice(0, index), ...recipe.comments.slice(index + 1)];
            // console.log(recipe)
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!debug2');
            // debugger

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });
        },
    });

    const handleDelete = async () => {
        await deleteComment({ variables: { commentId } });
    };

    return <span onClick={() => handleDelete()}>Confirm Delete</span>;
};

export default DeleteComment;
