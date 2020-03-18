import React, { useState } from 'react';

import './styles.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

const Star = ({ selected = false, onClick = f => f }) => (
    <span className={selected ? 'selected' : 'not-selected'} onClick={onClick}>
        {selected ? <p className="star">&#9733;</p> : <p className="star">&#9734;</p>}
    </span>
);

const StarRating = ({ rating, setRating }) => {
    const [unrated, setUnrated] = useState(rating === 0 ? true : false);

    const handleRate = (rating, setRating) => {
        setRating(rating)
        setUnrated(false)
    }

    return (
        <div className="star-rating justify-content-start align-items-start">
            <Row noGutters>
                {[...Array(5)].map((n, i) => (
                    <Star key={i} selected={i < rating} onClick={() => handleRate(i + 1, setRating)} />
                ))} 
                {unrated  && `(Leave no rating)`}
                {!unrated && rating !== 0 && <span onClick={() => {setRating(0)}}>(Clear rating)</span>}
            </Row>
        </div>
    );
};

export default StarRating;
