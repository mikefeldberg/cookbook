import React from 'react';
import Moment from 'react-moment';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const Comment = ({ comment }) => {
    return (
        <div className="border p-2 mb-2 rounded">
            {/* <Container> */}
                <div className="row">
                    <div className="col shrink">
                        <img
                            width={64}
                            height={64}
                            className="rounded"
                            src="https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_avatarplaceholder.png"
                        />
                    </div>
                    <div className="col grow">
                        <div className="row">
                            {comment.user.username}
                            {comment.createdAt}
                            {comment.updatedAt}
                        </div>
                        <div className="row">{comment.rating}</div>
                    </div>
                </div>
                <div className="mb-0">
                    {comment.content}
                </div>













                {/* <Row className="p-2">
                    <Col md={1}>
                        <Image
                            width={64}
                            height={64}
                            className="rounded mr-3 greyBorder"
                            src="https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_avatarplaceholder.png"
                            alt={comment.user.username}
                        />
                    </Col>
                    <Col>
                        <Row>{comment.user.username}</Row>
                        <Row>{comment.rating}</Row>
                    </Col>
                </Row>
                <Row>{comment.content}</Row> */}
            {/* </Container> */}
        </div>
    );
};

export default Comment;
