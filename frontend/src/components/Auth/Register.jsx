import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { REGISTER_MUTATION } from '../../queries/queries';

const Register = () => {
    const history = useHistory();
    const [createUser] = useMutation(REGISTER_MUTATION);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e, createUser) => {
        e.preventDefault();
        await createUser({ variables: { username, email, password } });
    };

    return (
        <Form className="mx-auto w-50" onSubmit={e => handleSubmit(e, createUser)}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control onChange={e => setUsername(e.target.value)} type="username" />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control onChange={e => setEmail(e.target.value)} type="email" />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control onChange={e => setPassword(e.target.value)} type="password" />
            </Form.Group>
            <ButtonGroup className="w-100" aria-label="Basic example">
                <Button onClick={() => {history.push('/login')}} className="w-50 p-1" variant="outline-primary">
                    Already a user? Login here!
                </Button>
                <Button className="w-50 p-1" variant="primary" type="submit">
                    Register
                </Button>
            </ButtonGroup>
        </Form>
    );
};

export default Register;
