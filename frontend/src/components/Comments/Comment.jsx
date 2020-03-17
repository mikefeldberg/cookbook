import React from 'react';
import Moment from 'react-moment'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const Comment = ({comment}) => {
    return (
        <div className="border mb-2 rounded">
            <Row className="p-2">
                <Col md={1}>
                    <Image
                        width={64}
                        height={64}
                        className="rounded mr-3 greyBorder"
                        src="https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_avatarplaceholder.png"
                        alt={comment.user.username}
                    />
                </Col>
                <Col className="d-flex flex-column align-content-around">
                    <Container>
                    {/* <Row className="justify-content-between"> */}
                    <Row>
                        <Row>
                            <p className="text-left">{comment.user.username}&nbsp;</p>
                            <span className="text-muted">
                                <Moment from={new Date()}>{comment.createdAt}</Moment>
                            </span>
                            {comment.updatedAt !== comment.createdAt && (
                                <span className="text-muted">
                                    (Updated <Moment from={new Date()}>{comment.updatedAt}</Moment>){' '}
                                </span>
                            )}
                        </Row>
                        {/* <CommentDashboard /> */}
                    </Row>
                    <Row>
                        <p className="starRating">{'★'.repeat(comment.rating)}</p>
                    </Row>
                    </Container>
                </Col>
                {/* <Col md={{ span: 3, offset: 3 }}></Col> */}
            </Row>
            {comment.content && <p className="p-2 mb-0">{comment.content}</p>}
        </div>
    );
}
 
export default Comment;