import React, {useState, useContext} from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import { AuthContext } from '../../App';
import { GET_USER_RATINGS_QUERY } from '../../queries/queries';
import Comment from './Comment';
import CreateComment from './CreateComment';

const CommentSection = ({ recipeId, comments }) => {
    const client = useApolloClient();
    const currentUser = useContext(AuthContext);
    const [newRatingIsDisabled, setNewRatingIsDisabled] = useState(false);

    const fetchUserRatings = async () => {
        const res = await client.query({
            query: GET_USER_RATINGS_QUERY,
            variables: { id: currentUser.id },
        });

        const commentSet = res.data.user.commentSet;

        for (const c of commentSet) {
            if (c.recipe.id === recipeId && c.rating) {
                setNewRatingIsDisabled(true);
            }
        }
    };

    if (currentUser) {
        fetchUserRatings();
    }

    return (
        <>
            <h2>Comments</h2>
            <CreateComment
                recipeId={recipeId}
                newRatingIsDisabled={newRatingIsDisabled}
                setNewRatingIsDisabled={setNewRatingIsDisabled}
            />
            {comments.length > 0 && comments.map((comment) =>
                <Comment
                    key={comment.id}
                    comment={comment}
                    newRatingIsDisabled={newRatingIsDisabled}
                    setNewRatingIsDisabled={setNewRatingIsDisabled}
                />
            )}
            {comments.length === 0 &&
                <div border="light" className="pt-2 pb-2 shadow-sm text-center text-secondary rounded mb-5">No one has left any comments or ratings yet</div>
            }
        </>
    );
};

export default CommentSection;
