import React from 'react';

import CommentList from './CommentList';
import CreateComment from './CreateComment';

const CommentSection = ({ recipeId, comments }) => {
    return (
        <div>
            Here there be comments
            <CreateComment recipeId={recipeId} />
            <CommentList comments={comments} />
        </div>
    );
};

export default CommentSection;
