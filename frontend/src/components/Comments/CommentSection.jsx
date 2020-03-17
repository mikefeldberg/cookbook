import React from 'react';

import Comments from './Comments';
import CreateComment from './CreateComment';


const CommentSection = ({comments}) => {
    return (
        <div>
            Here there be comments
            <CreateComment />
            <Comments comments={comments}/>
        </div>
    );
}
 
export default CommentSection;