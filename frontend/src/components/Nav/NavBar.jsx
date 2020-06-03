import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
// import Jumbotron from 'react-bootstrap/Jumbotron';
import Navbar from 'react-bootstrap/Navbar';

import { AuthContext } from '../../App';
import UserNav from './UserNav';
import AnonNav from './AnonNav';

const NavBar = () => {
    const currentUser = useContext(AuthContext);

    return (
        <Container>
            <Navbar expand variant="light" className="p-0 bg-light fixed-top">
                <Container className="pl-3 pr-3">
                    <Navbar.Brand>
                        <Link to="/">
                            <img
                                src="/logo_black_border.png"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                                alt="chef logo"
                            />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                        {currentUser ? <UserNav currentUser={currentUser} /> : <AnonNav />}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    );
};

export default NavBar;
