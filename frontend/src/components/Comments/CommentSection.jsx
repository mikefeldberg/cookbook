import React from 'react';

import Comments from './Comments';
import CreateComment from './CreateComment';


const CommentSection = ({recipeId, comments}) => {
    return (
        <div>
            Here there be comments
            <CreateComment recipeId={recipeId} />
            <Comments comments={comments} />
        </div>
    );
}
 
export default CommentSection;