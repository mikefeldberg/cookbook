import React from 'react';

const Comments = ({comments}) => {
    if (comments.length > 0) {
        return (
            <>
                {comments.length > 0 && 
                    comments.map(comment => (
                        <div key={comment.id}>
                            <div>{comment.rating}</div>
                            <div>{comment.content}</div>
                        </div>
                    ))
                }
            </>
        );
    } else {
        return 'Nothing here yet'
    }
}
 
export default Comments;