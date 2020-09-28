import React from 'react';
import { Link } from 'react-router-dom';

import Row from 'react-bootstrap/Row';

const UserAvatar = ({ user, size, showLabel = false }) => {
    return (
        <Link style={{ textDecoration: 'none' }} to={`/profile/${user.username}`}>
            <Row noGutters>
                <div
                    className={'mr-2 user-avatar user-avatar-' + size}
                    style={{
                        backgroundImage: `url(${user.photos.length > 0 ? user.photos[0].url : '/avatar_placeholder.png'})`,
                    }}
                ></div>
                {showLabel && <span className="link">{user.username}</span>}
            </Row>
        </Link>
    );
};

export default UserAvatar;
