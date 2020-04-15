import React from 'react';

import Comment from './Comment';
import CreateComment from './CreateComment';

const CommentSection = ({ recipeId, comments }) => {
    return (
        <>
            <h1>Comments</h1>
            <CreateComment
                recipeId={recipeId}
            />
            {comments.length > 0 && comments.map((comment) => <Comment key={comment.id} comment={comment} />)}
        </>
    );
};

export default CommentSection;
