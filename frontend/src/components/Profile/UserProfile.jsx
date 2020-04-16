import React from 'react';
import Moment from 'react-moment';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const UserProfile = ({ profile }) => {
    const renderTooltip = (props) => {
        return (
            <Tooltip {...props}>
                <Moment format="MMMM YYYY">{profile.createdAt}</Moment>
            </Tooltip>
        );
    };

    return (
        <Row className="border rounded-bottom p-0 m-0 mb-5 align-items-center">
            <Col className="pl-0">
                <Image src={`/avatar_placeholder.png`} fluid className="shadow-lg" />
            </Col>
            <Col className="align-content-around">
                <Row className="mb-2"><strong>Username:</strong>&nbsp;{profile.username}</Row>
                <Row className="mb-2">
                    <strong>Joined:</strong>&nbsp;
                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                        <Moment from={new Date()}>{profile.createdAt}</Moment>
                    </OverlayTrigger>
                </Row>
                <Row className="mb-2"><strong>Recipes Submitted:</strong>&nbsp;{profile.recipeSet.length}</Row>
                <Row className="mb-2"><strong>Comments:</strong>&nbsp;{profile.commentSet.length}</Row>
            </Col>
        </Row>
    );
};

export default UserProfile;
