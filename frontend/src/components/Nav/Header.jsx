import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import { AuthContext } from '../../App';
import UserNav from './UserNav';
import AnonNav from './AnonNav';

const Header = () => {
    const currentUser = useContext(AuthContext);

    return (
        // <Container>
            <Navbar expand variant="light" className="p-0 bg-light shadow">
                <Container className="pl-3 pr-3">
                    <Navbar.Brand>
                        <Link to="/">
                            <Row>
                                <img
                                    src="/logo_black_border.png"
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top mr-3"
                                    alt="chef logo"
                                />
                                <h5 className="p-0 m-0 link text-dark">Feldberg’s Cookbook</h5>
                            </Row>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                        {currentUser ? <UserNav currentUser={currentUser} /> : <AnonNav />}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        // </Container>
    );
};

export default Header;
