import React, { useState } from 'react';

import './styles.css';
import Row from 'react-bootstrap/Row';

const onMouseEnter = (e, setHoveredStar) => {
    const currentStar = parseInt(e.currentTarget.attributes.currentstar.value);
    setHoveredStar(currentStar);
};

const onMouseLeave = (setHoveredStar) => {
    setHoveredStar(0);
};

const Star = ({ currentStar, selected = false, hoveredStar, onClick = f => f, onMouseEnter, onMouseLeave}) => (
    <span className={[selected ? 'selected' : 'not-selected', hoveredStar > currentStar ? 'glow' : ''].join(' ')}
          currentstar={currentStar}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
        {selected ? <p className="star">&#9733;</p> : <p className="star">&#9734;</p>}
    </span>
);

const StarRating = ({ rating, setRating }) => {
    const [hoveredStar, setHoveredStar] = useState(0);

    return (
        <span>
            <Row className="align-items-center" noGutters>
                {[...Array(5)].map((n, i) => (
                    <Star key={i}
                          currentStar={i}
                          selected={i < rating}
                          hoveredStar={hoveredStar} onClick={() => setRating(i + 1)}
                          onMouseEnter={e => onMouseEnter(e, setHoveredStar)}
                          onMouseLeave={() => onMouseLeave(setHoveredStar)}/>
                ))}&nbsp;
                {rating === 0  && `(Leave no rating)`}
                {rating !== 0 && <span onClick={() => {setRating(0)}}>(Clear rating)</span>}
            </Row>
        </span>
    );
};

export default StarRating;
