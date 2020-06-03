import React from 'react';
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

const Footer = () => {
    return (
        <Navbar expand variant="light" className="p-0 pr-2 mt-3 bg-light">
            {/* <Container> */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-between" id="basic-navbar-nav">
                <Nav>
                    <Nav.Item>
                        <Link className="nav-link" to="/terms">
                            <small>Terms of Use</small>
                        </Link>
                    </Nav.Item>
                </Nav>
                <Nav>
                    <Nav.Item className="inline">
                        <small className="text-secondary">© 2020 Under Development LLC</small>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
            {/* </Container> */}
        </Navbar>
    );
};

export default Footer;
