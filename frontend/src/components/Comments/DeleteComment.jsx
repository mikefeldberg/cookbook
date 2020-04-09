import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { DELETE_COMMENT_MUTATION, GET_RECIPE_QUERY } from '../../queries/queries';

const DeleteComment = ({ commentId }) => {
    const client = useApolloClient();
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        update(cache, { data: { deleteComment } }) {
            const recipeId = deleteComment.recipeId;
            const data = cache.readQuery({ query: GET_RECIPE_QUERY, variables: { id: recipeId } });
            const recipe = {...data.recipe}
            const index = recipe.comments.findIndex(comment => comment.id === commentId);
            recipe.comments = [...recipe.comments.slice(0, index), ...recipe.comments.slice(index + 1)];

            cache.writeQuery({
                query: GET_RECIPE_QUERY,
                data: { recipe },
            });
            client.resetStore();
        },
    });

    const handleDelete = async () => {
        await deleteComment({ variables: { commentId } });
    };

    return <span onClick={() => handleDelete()}>Confirm Delete</span>;
};

export default DeleteComment;
