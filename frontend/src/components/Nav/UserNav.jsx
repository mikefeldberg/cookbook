import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';

import Logout from '../Auth/Logout';

const UserNav = ({ currentUser }) => {
    const [value, setValue] = useState('');
    const handleSelect = (e) => {
        setValue(e);
        console.log(value);
    };

    return (
        <>
            <Nav.Item>
                <Image
                    width={32}
                    height={32}
                    className="border-light rounded-circle mr-1 shadow-sm"
                    alt={currentUser.username}
                    src={currentUser.photos.length > 0 ? currentUser.photos[0].url : `/avatar_placeholder.png`}
                />
            </Nav.Item>
            <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic"></Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href={`/profile/${currentUser.username}`} >Profile</Dropdown.Item>
                    <Dropdown.Item><Logout /></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {/* <Nav.Item>
                <Link className="navLink nav-link" to={`/profile/${currentUser.id}`}>
                    Hey, {currentUser.username}
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className="navLink nav-link" to="/recipes/new">
                    New Recipe
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link className="navLink nav-link">
                    <Logout />
                </Nav.Link>
            </Nav.Item> */}
        </>
    );
};

export default UserNav;
