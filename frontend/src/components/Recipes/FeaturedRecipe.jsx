import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import UserAvatar from '../Shared/UserAvatar';
import RecipeSpecs from './RecipeSpecs';

const FeaturedRecipe = ({ featuredRecipe }) => {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }
        console.log(dimensions)
        window.addEventListener('resize', handleResize)
    })

    return (
        <Container>
            {dimensions.width >= 1000 && (
                <Row className="mb-5 align-items-center">
                    <Col>
                        <div
                            className="featured-recipe"
                            rounded
                            style={{
                                backgroundImage: `url(${featuredRecipe.photos.length > 0 ? featuredRecipe.photos[0].url : '/recipe_placeholder.png'})`
                            }}
                        ></div>
                    </Col>
                    <Col>
                        <RecipeSpecs recipe={featuredRecipe} />
                        {/* <UserAvatar user={featuredRecipe.user} size={'med'} showLabel={true} /> */}
                    </Col>
                </Row>
            )}
            {dimensions.width < 1000 && (
                <Col className="p-0 mb-5 align-items-center">
                    <Image
                        rounded
                        src={
                            featuredRecipe.photos.length > 0
                                ? featuredRecipe.photos[0].url
                                : `/recipe_placeholder.png`
                        }
                        fluid
                        className="mb-3 shadow-lg"
                    />
                </Col>
            )}
        </Container>
    );
}

export default FeaturedRecipe;