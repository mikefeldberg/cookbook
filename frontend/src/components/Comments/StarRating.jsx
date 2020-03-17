import React from 'react';

import "./styles.css";

const Star = ({ selected = false, onClick = f => f }) => (
    // <div className={selected ? [styles.selected, styles.star].join() : styles.star} onClick={onClick} />
    <div className={selected ? "star selected" : "star"} onClick={onClick} />
  );
  
const StarRating = ({ rating, setRating }) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((n, i) => (
          <Star
            key={i}
            selected={i < rating}
            onClick={() => setRating(i + 1)}
          />
        ))}
      </div>
    );
  };

export default StarRating;
