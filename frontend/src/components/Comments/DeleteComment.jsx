import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import Button from 'react-bootstrap/Button';

import { DELETE_COMMENT_MUTATION } from '../../queries/queries';

const DeleteComment = ({ commentId }) => {
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);

    const handleDelete = async (e, deleteComment) => {
        e.preventDefault();
        debugger;
        await deleteComment({ variables: { commentId } });
    };

    return <span onClick={e => handleDelete(e, deleteComment)}>Confirm Delete</span>;
};

export default DeleteComment;
