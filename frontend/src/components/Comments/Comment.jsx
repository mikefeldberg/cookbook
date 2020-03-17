import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const Comment = ({ comment }) => {
    // debugger
    return (
        <div className="border mb-2 rounded">
            <Row className="p-2">
                <Col md={1}>
                    <Link to={`/profile/${comment.user.username}`}>
                        <Image
                            width={64}
                            height={64}
                            className="rounded mr-3 greyBorder"
                            src="https://cookbook-test-bucket.s3-us-west-1.amazonaws.com/_avatarplaceholder.png"
                            alt={comment.user.username}
                        />
                    </Link>
                </Col>

                <Col>
                    <Row>
                        <Link to={`/profile/${comment.user.username}`}>{comment.user.username}</Link>&nbsp;posted&nbsp;
                        <Moment from={new Date()}>{comment.createdAt}</Moment>&nbsp;
                        {
                            moment(comment.updatedAt).diff(moment(comment.createdAt), 'minutes') > 1 &&
                            <span>(Updated <Moment from={new Date()}>{comment.updatedAt}</Moment>)</span>
                        }
                    </Row>
                    <Row className="selected">{'★'.repeat(comment.rating)}</Row>
                </Col>
            </Row>
            <Row noGutters className="pl-2 pb-1">
                {comment.content}
            </Row>
        </div>
    );
};

export default Comment;
