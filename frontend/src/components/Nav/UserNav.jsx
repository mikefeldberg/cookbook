import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

// import Logout from '../Auth/Logout';

const UserNav = ({ currentUser }) => {
    const client = useApolloClient();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        client.writeData({ data: { isLoggedIn: false } });
        client.resetStore();
    };

    const history = useHistory();
    return (
        <>
            <Nav>
                <Nav.Item className="mr-2">
                    <Link className="nav-link navLink" to="/recipes/new">
                        Add Recipe
                    </Link>
                </Nav.Item>
            </Nav>
            <Link to={`/profile/${currentUser.username}`}>
                <Image
                    width={32}
                    height={32}
                    className="border-light rounded-circle mr-1 shadow-sm"
                    alt={currentUser.username}
                    src={currentUser.photos.length > 0 ? currentUser.photos[0].url : `/avatar_placeholder.png`}
                />
            </Link>
            <Dropdown drop="down">
                <Dropdown.Toggle variant="dark" id="dropdown-basic"></Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="p-0">
                        <ButtonGroup className="w-100">
                            <Button
                                onClick={() => {
                                    history.push(`/profile/${currentUser.username}`);
                                }}
                                variant="light-outline"
                                className="rounded-0 text-left"
                            >
                                Profile
                            </Button>
                        </ButtonGroup>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-0">
                        <ButtonGroup className="w-100">
                            <Button onClick={handleLogout} variant="light-outline" className="rounded-0 text-left">
                                Logout
                            </Button>
                        </ButtonGroup>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default UserNav;
