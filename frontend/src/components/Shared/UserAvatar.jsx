import React from 'react';
import { Link } from 'react-router-dom';

const UserAvatar = ({ user, size, showLabel = false }) => {
    return (
        <Link style={{ textDecoration: 'none' }} to={`/profile/${user.username}`}>
            <div className={'user-avatar user-avatar-' + size}
                 style={{ backgroundImage: `url(${user.photos.length > 0 ? user.photos[0].url : "/avatar_placeholder.png"})` }}></div>
            { showLabel && <span className="link">{user.username}</span> }
        </Link>
    );
};

export default UserAvatar;
