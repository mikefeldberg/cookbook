import React from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import PhotoSettings from './PhotoSettings';

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
        </Accordion>
    );
};

export default SettingsTab;
