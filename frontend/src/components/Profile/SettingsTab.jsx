import React from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import PhotoSettings from './PhotoSettings';
import PasswordSettings from './PasswordSettings';
import UsernameSettings from './UsernameSettings';

const SettingsTab = ({ profile }) => {
    return (
        <Accordion className="border-bottom">
            <Card key="photo">
                <Accordion.Toggle as={Card.Header} eventKey="photo" className="clickable">
                    Add or update profile photo
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="photo">
                    <Card.Body>
                        <PhotoSettings profile={profile} />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card key="password">
                <Accordion.Toggle as={Card.Header} eventKey="password" className="clickable">
                    Change password
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="password">
                    <Card.Body>
                        <PasswordSettings />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card key="username">
                <Accordion.Toggle as={Card.Header} eventKey="username" className="clickable">
                    Change username
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="username">
                    <Card.Body>
                        <UsernameSettings />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};

export default SettingsTab;
