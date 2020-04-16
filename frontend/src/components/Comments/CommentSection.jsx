import React, {useState, useContext} from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import { AuthContext } from '../../App';
import { GET_USER_RATINGS_QUERY } from '../../queries/queries';
import Comment from './Comment';
import CreateComment from './CreateComment';

const CommentSection = ({ recipeId, comments }) => {
    const client = useApolloClient();
    const currentUser = useContext(AuthContext);
    const [ratingIsDisabled, setRatingIsDisabled] = useState(false);

    const fetchUserRatings = async () => {
        const res = await client.query({
            query: GET_USER_RATINGS_QUERY,
            variables: { id: currentUser.id },
        });

        const commentSet = res.data.user.commentSet;

        for (const c of commentSet) {
            if (c.recipe.id === recipeId && c.rating) {
                setRatingIsDisabled(true);
            }
        }
    };

    if (currentUser) {
        fetchUserRatings();
    }

    return (
        <>
            <h1>Comments</h1>
            <CreateComment
                recipeId={recipeId}
                ratingIsDisabled={ratingIsDisabled}
                setRatingIsDisabled={setRatingIsDisabled}
            />
            {comments.length > 0 && comments.map((comment) => 
                <Comment
                    key={comment.id}
                    comment={comment}
                    setRatingIsDisabled={setRatingIsDisabled}
                />
            )}
        </>
    );
};

export default CommentSection;
