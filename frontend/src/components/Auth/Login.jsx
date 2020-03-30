import React, { useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { LOGIN_MUTATION } from '../../queries/queries';

const Login = () => {
    const history = useHistory();
    const client = useApolloClient();
    const [tokenAuth] = useMutation(LOGIN_MUTATION);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e, tokenAuth, client) => {
        e.preventDefault();
        const res = await tokenAuth({ variables: { username, password } });
        localStorage.setItem('authToken', res.data.tokenAuth.token);
        client.writeData({ data: { isLoggedIn: true } });
        client.resetStore();
        history.push('/');
    };

    return (
        <Form className="mx-auto w-50" onSubmit={e => handleSubmit(e, tokenAuth, client)}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control onChange={e => setUsername(e.target.value)} type="username" />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control onChange={e => setPassword(e.target.value)} type="password" />
            </Form.Group>
            {/* <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
            </Form.Group> */}
            <ButtonGroup className="w-100" aria-label="Basic example">
                <Button onClick={() => {history.push('/register')}} className="w-50 p-1" variant="outline-primary" type="button">
                    Not a user? Register here!
                </Button>
                <Button className="w-50 p-1" variant="primary" type="submit">
                    Login
                </Button>
            </ButtonGroup>
        </Form>
    );
};

export default Login;
