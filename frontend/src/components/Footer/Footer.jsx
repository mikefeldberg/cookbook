import React from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Footer = () => {
    return (
        <Navbar expand="md" variant="dark" className="p-0 bg-dark sticky-bottom navBack text-center">
            <>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-center" id="basic-navbar-nav">
                    <Nav className=" mr-auto">
                        <Nav.Item>
                            <Link className="navLink nav-link" to="/terms">
                                <small>Terms of Service</small>
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link className="navLink nav-link" to="/privacy">
                                <small>Privacy Policy</small>
                            </Link>
                        </Nav.Item>
                    </Nav>
                    <Nav>
                        <Nav.Item className="inline">
                            <small className="text-secondary">© 2020 Under Development LLC</small>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </>
        </Navbar>
    );
};

export default Footer;
