import React from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

const Banner = () => {
    return (
        <Jumbotron className="rounded-0">
            <Container>
                <div className="text-center jumbotron-text">
                    <h3 className="text-white text-left">x</h3>
                    <h1 className="text-white text-left ml-5">x</h1>
                </div>
            </Container>
        </Jumbotron>
    );
};

export default Banner;
