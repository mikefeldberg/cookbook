import React from 'react';
import CommentSummary from './CommentCard'

const CommentList = ({feedbacks}) => {
    return feedbacks.map(feedback => {
        return <CommentSummary feedback={feedback} key={feedback.id}/>
    });
}
 
export default CommentList;