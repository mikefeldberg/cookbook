import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

import UserNav from './UserNav';
import AnonNav from './AnonNav';
import { AuthContext } from '../../App';


const NavBar = () => {
    const currentUser = useContext(AuthContext)

    return (
        <Jumbotron>
            <Navbar expand="md" className="fixed-top navBack">
            <Container>
                {/* <Navbar.Brand href="#home">Feldberguesa's Cookbook</Navbar.Brand> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Link className="nav-link navLink lead" to="/">
                                Home
                            </Link>
                        </Nav.Item>
                        {currentUser ? <UserNav currentUser={currentUser}/> : <AnonNav />}
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="info">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
            </Navbar>
            <Container>
            <div className="text-center">
            <h3 className="display-4 text-white heroText text-left">Feldberguesa's</h3>
            <h1 className="display-1 text-white heroText text-left ml-5">Cookbook</h1>
            </div>
            </Container>
        </Jumbotron>
    );
};

export default NavBar;
