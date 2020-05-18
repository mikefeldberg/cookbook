import React from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import PhotoSettings from './PhotoSettings';
import PasswordSettings from './PasswordSettings';

const SettingsTab = ({ profile }) => {
    return (
        <Accordion className="border-bottom">
            <Card key="photo">
                <Accordion.Toggle as={Card.Header} eventKey="photo">
                    Add or update profile photo
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="photo">
                    <Card.Body>
                        <PhotoSettings profile={profile} />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card key="password">
                <Accordion.Toggle as={Card.Header} eventKey="password">
                    Change password
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="password">
                    <Card.Body>
                        <PasswordSettings profile={profile} />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};

export default SettingsTab;
