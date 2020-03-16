import React from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';

const UserNav = props => {
    const handleLogout = () => {
        localStorage.removeItem('authToken');
    };
    return (
        <React.Fragment>
            <Nav.Item>
                <Link className="navLink nav-link" to="/profile">
                    Hey, {props.currentUser.username}
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className="navLink nav-link" to="/recipes/new">
                    New Recipe
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link className="navLink nav-link" onClick={() => handleLogout()}>
                    Logout
                </Nav.Link>
            </Nav.Item>
        </React.Fragment>
    );
};

export default UserNav;
