import React, { useState, useContext } from 'react';
// import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';

import { GET_RECIPE_QUERY } from '../../queries/queries';
import { AuthContext } from '../../App';

const RecipeDetails = ({ match }) => {
    const currentUser = useContext(AuthContext);
    const [feedbackEnabled, setFeedbackEnabled] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [editedRating, setEditedRating] = useState(0);
    const [editedComment, setEditedComment] = useState('');

    if (!!currentUser && !feedbackEnabled) {
        setFeedbackEnabled(true);
    }

    const id = match.params.id;
    const { data, loading, error } = useQuery(GET_RECIPE_QUERY, {
        variables: { id },
    });

    if (loading) return `Loading recipe...`;
    if (error) return `Error! ${error}`;

    if (data) {
        const recipe = data.recipe

        return (
            <>
                <div>Title: {recipe.title}</div>
                <div>Description: {recipe.description}</div>
            </>
        );
    }
};

export default RecipeDetails;
