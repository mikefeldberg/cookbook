import React, { useState, useContext } from 'react';

// import './styles.css';
import Row from 'react-bootstrap/Row';
import { AuthContext } from '../../App';

const onMouseEnter = (e, setHoveredStar) => {
    const currentStar = parseInt(e.currentTarget.attributes.currentstar.value);
    setHoveredStar(currentStar);
};

const onMouseLeave = setHoveredStar => {
    setHoveredStar(0);
};

const Star = ({ currentUser, currentStar, selected = false, hoveredStar, onClick = f => f, onMouseEnter, onMouseLeave }) => (
    <>
        { currentUser &&
            <span
                className={[selected ? 'selected' : 'not-selected', hoveredStar > currentStar ? 'glow' : ''].join(' ')}
                currentstar={currentStar}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {selected ? <p className="star">&#9733;</p> : <p className="star">&#9734;</p>}
            </span>
        }
        { !currentUser &&
            <span
                className="disabled-star not-selected"
            >&#9734;
            </span>
        }
    </>
);

const StarRating = ({ rating, setRating, rated }) => {
    const currentUser = useContext(AuthContext);
    const [hoveredStar, setHoveredStar] = useState(0);

    if (currentUser && !rated) {
        return (
            <span>
                <Row className="align-items-center" noGutters>
                    {[...Array(5)].map((n, i) => (
                        <Star
                            currentUser={currentUser}
                            key={i}
                            currentStar={i}
                            selected={i < rating}
                            hoveredStar={hoveredStar}
                            onClick={() => setRating(i + 1)}
                            onMouseEnter={e => onMouseEnter(e, setHoveredStar)}
                            onMouseLeave={() => onMouseLeave(setHoveredStar)}
                        />
                    ))}
                    &nbsp;
                    {rating === 0 && `(No rating)`}
                    {rating !== 0 && (
                        <span
                            onClick={() => {
                                setRating(0);
                            }}
                        >
                            (Clear rating)
                        </span>
                    )}
                </Row>
            </span>
        );
    } else {
        return (
            <span>
                <Row className="align-items-center" noGutters>
                    {[...Array(5)].map((n, i) => (
                        <Star
                            key={i}
                        />
                    ))}
                    &nbsp;
                    {rated && '(Already rated)'}
                </Row>
            </span>
        );
    }
};

export default StarRating;
