import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_RATINGS_QUERY } from '../../queries/queries';
import Comment from './Comment';
import CreateComment from './CreateComment';

const CommentSection = ({ recipeId, comments }) => {
    let rated
    const { data } = useQuery(GET_RATINGS_QUERY, {
        variables: { recipeId }
    });

    if (data) {
        data.ratings.length > 0 ? rated = true : rated = false;
    }

    return (
        <>
            <h1>Comments</h1>
            <CreateComment
                recipeId={recipeId}
                rated={rated}
            />
            {comments.length > 0 &&
                comments.map(comment => (
                    <Comment key={comment.id} comment={comment} />
                ))
            }
        </>
    );
};

export default CommentSection;
