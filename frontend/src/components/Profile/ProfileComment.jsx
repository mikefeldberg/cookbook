import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

const ProfileComment = ({ comment }) => {
    return (
        <div className="shadow-sm border mb-2 rounded">
            <Row className="p-2">
                <Col md={1}>
                    <Link style={{ textDecoration: 'none' }} to={`/recipes/${comment.recipe.id}`}>
                        <Image
                            width={64}
                            className="rounded mr-3"
                            src={
                                comment.recipe.photos.length > 0
                                    ? comment.recipe.photos[0].url
                                    : `/recipe_placeholder.png`
                            }
                            alt={comment.recipe.title}
                        />
                    </Link>
                </Col>
                <Col>
                    <Row noGutters>
                        <Link style={{ textDecoration: 'none' }} to={`/recipes/${comment.recipe.id}`}>
                            <span className="link">{comment.recipe.title}</span>
                        </Link>
                        &nbsp;posted&nbsp;
                        <Moment from={new Date()}>{comment.createdAt}</Moment>&nbsp;
                        {moment(comment.updatedAt).diff(moment(comment.createdAt), 'minutes') > 1 && (
                            <span>
                                (Updated <Moment from={new Date()}>{comment.updatedAt}</Moment>)
                            </span>
                        )}
                    </Row>
                    <Row noGutters className="selected" style={{ cursor: 'default' }}>
                        {'★'.repeat(comment.rating)}
                    </Row>
                </Col>
            </Row>
            <Row noGutters className="pl-2 pb-1">
                {comment.content}
            </Row>
        </div>
    );
};

export default ProfileComment;
