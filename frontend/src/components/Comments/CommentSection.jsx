import React from 'react';

import Comment from './Comment';
import CreateComment from './CreateComment';

const CommentSection = ({ recipeId, comments }) => {
    return (
        <>
            Here, there be comments
            <CreateComment recipeId={recipeId} />
            {comments.length > 0 &&
                comments.map(comment => (
                    <Comment key={comment.id} comment={comment} />
                ))
            }
        </>
    );
};

export default CommentSection;
