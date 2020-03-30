import React from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Logout from '../Auth/Logout';

const UserNav = ({currentUser}) => {
    return (
        <>
            <Nav.Item>
                <Link className="navLink nav-link" to={`/profile/${currentUser.id}`}>
                    Hey, {currentUser.username}
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className="navLink nav-link" to="/recipes/new">
                    New Recipe
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link className="navLink nav-link">
                    <Logout />
                </Nav.Link>
            </Nav.Item>
        </>
    );
};

export default UserNav;
