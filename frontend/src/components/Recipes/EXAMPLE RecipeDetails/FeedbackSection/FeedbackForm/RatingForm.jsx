import React from 'react';
import StarRatingComponent from 'react-star-rating-component';

const RatingForm = props => {
    return (
        <StarRatingComponent
            name={props.recipe.name}
            value={props.feedbackRating}
            renderStarIcon={() => <span>{props.recipe.ratingCount > 0 ? '★' : '☆'}</span>}
            onStarClick={props.handleStarClick.bind(this)}
            // onStarHover={Function(nextValue, prevValue, name)} /* on icon hover handler */
            // onStarHoverOut={Function(nextValue, prevValue, name)} /* on icon hover out handler */
            // renderStarIcon={Function(nextValue, prevValue, name)} /* it should return string or react component */
            starcount={5}
            starColor={'#ffb400'}
            emptyStarColor={'#ffb400'}
            editing={props.feedbackDisabled ? false : true}
            className="mr5"
        />
    );
};

export default RatingForm;
