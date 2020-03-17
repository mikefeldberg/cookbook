import React from 'react';

import './styles.css';

const Star = ({ selected = false, onClick = f => f }) => (
    <div className={selected ? "selected" : "not-selected"} onClick={onClick}>{selected ? <p className="star">&#9733;</p> : <p className="star">&#9734;</p>}</div>
);

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((n, i) => (
                <Star key={i} selected={i < rating} onClick={() => setRating(i + 1)} />
            ))}
        </div>
    );
};

export default StarRating;
