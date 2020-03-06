import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CommentDashboard from './CommentDashboard';

const CommentCard = ({ feedback }) => {
    return (
        <div className="border mb10 rounded">
            <Row className="p-2">
                <Col md={1}>
                    <Image
                        width={64}
                        height={64}
                        className="rounded mr-3 greyBorder"
                        src={feedback.user.avatar}
                        alt={feedback.user.name}
                    />
                </Col>
                <Col className="d-flex flex-column align-content-around">
                    <Row noGutters className="justify-content-between">
                        <Row noGutters>
                            <p>{feedback.user.name}&nbsp;</p>
                            <span className="text-muted">
                                <Moment from={new Date()}>{feedback.createdAt}</Moment>
                            </span>
                            {feedback.updatedAt !== feedback.createdAt && (
                                <span className="text-muted">
                                    (Updated <Moment from={new Date()}>{feedback.updatedAt}</Moment>){' '}
                                </span>
                            )}
                        </Row>
                        <CommentDashboard />
                    </Row>
                    <Row noGutters>
                        <p className="starRating">{'★'.repeat(feedback.rating)}</p>
                    </Row>
                </Col>
                {/* <Col md={{ span: 3, offset: 3 }}></Col> */}
            </Row>
            {feedback.content && <p className="p-2 mb-0">{feedback.content}</p>}
        </div>
    );
};

export default CommentCard;
