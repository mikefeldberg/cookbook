import React from 'react';

import './styles.css';
import Row from 'react-bootstrap/Row';

const Star = ({ selected = false, onClick = f => f }) => (
    <span className={selected ? 'selected' : 'not-selected'} onClick={onClick}>
        {selected ? <p className="star">&#9733;</p> : <p className="star">&#9734;</p>}
    </span>
);

const StarRating = ({ rating, setRating }) => {
    return (
        <span>
            <Row className="align-items-center" noGutters>
                {[...Array(5)].map((n, i) => (
                    <Star key={i} selected={i < rating} onClick={() => setRating(i + 1)} />
                ))}&nbsp;
                {rating === 0  && `(Leave no rating)`}
                {rating !== 0 && <span onClick={() => {setRating(0)}}>(Clear rating)</span>}
            </Row>
        </span>
    );
};

export default StarRating;
