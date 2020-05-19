import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Navbar from 'react-bootstrap/Navbar';

import { AuthContext } from '../../App';
import UserNav from './UserNav';
import AnonNav from './AnonNav';

const NavBar = () => {
    const currentUser = useContext(AuthContext);

    return (
        <Jumbotron className="mb-4">
            <Navbar expand="md" variant="dark" className="p-0 bg-dark fixed-top navBack">
                <Container>
                    <Navbar.Brand>
                        <Link to="/">
                            <img
                                src="/logo_white_border.png"
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
            <Container>
                <div className="text-center">
                    <h3 className="display-4 text-white heroText text-left">Feldberg’s</h3>
                    <h1 className="display-1 text-white heroText text-left ml-5">Cookbook</h1>
                </div>
            </Container>
        </Jumbotron>
    );
};

export default NavBar;
