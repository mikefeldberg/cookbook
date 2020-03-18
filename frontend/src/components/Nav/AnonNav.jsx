import React from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';

const AnonNav = () => {
    return (
        <>
            <Nav.Item>
                <Link className="nav-link navLink" to="/login">Login</Link>
            </Nav.Item>
            <Nav.Item>
                <Link className="nav-link navLink" to="/register">Register</Link>
            </Nav.Item>
        </>
    );
};

export default AnonNav;
