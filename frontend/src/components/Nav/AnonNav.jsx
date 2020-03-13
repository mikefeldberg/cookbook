import React from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';

const AnonNav = () => {
    return (
        <React.Fragment>
            <Nav.Item>
                <Link className="nav-link navLink" to="/login">Login</Link>
            </Nav.Item>
            <Nav.Item>
                <Link className="nav-link navLink" to="/signup">Sign Up</Link>
            </Nav.Item>
        </React.Fragment>
    );
};

export default AnonNav;
