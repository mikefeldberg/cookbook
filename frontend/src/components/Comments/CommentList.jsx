import React from 'react';
import Comment from './Comment';

const CommentList = ({ comments }) => {
    if (comments.length > 0) {
        return (
            <>
                {comments.map(comment => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </>
        );
    } else {
        return 'Nothing here yet';
    }
};

export default CommentList;