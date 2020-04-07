import React, { useState, useContext } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { LOGIN_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';
import Error from '../Shared/Error';

const Login = () => {
    const currentUser = useContext(AuthContext);
    const history = useHistory();
    const client = useApolloClient();
    const [tokenAuth] = useMutation(LOGIN_MUTATION);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitIsDisabled] = useState(false);
    const [errorText, setErrorText] = useState(null);

    const handleSubmit = async (e, tokenAuth, client) => {
        e.preventDefault();

        try {
            const { data, error } = await tokenAuth({ variables: { username, password } });
            if (error) {
                return `error`;
            }
            localStorage.setItem('authToken', data.tokenAuth.token);
            client.writeData({ data: { isLoggedIn: true } });
            client.resetStore();
            history.push('/');
        } catch (e) {
            let errorMessage = e.graphQLErrors[0]['message'];
            if (e.graphQLErrors && errorMessage.includes('enter valid credentials')) {
                setErrorText('Incorrect username or password');
            }
        }
    };

    if (!currentUser) {
        return (
            <>
                <Form className="mx-auto w-50" onSubmit={(e) => handleSubmit(e, tokenAuth, client)}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control onChange={(e) => setUsername(e.target.value)} type="username" />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" />
                    </Form.Group>
                    <ButtonGroup className="w-100" aria-label="Basic example">
                        <Button
                            onClick={() => {
                                history.push('/register');
                            }}
                            className="w-50 p-1"
                            variant="outline-primary"
                        >
                            Not a user? Register here!
                        </Button>
                        <Button disabled={submitIsDisabled} className="w-50 p-1" variant="primary" type="submit">
                            Login
                        </Button>
                    </ButtonGroup>
                </Form>
                {errorText && <Error error={errorText} setErrorText={setErrorText} />}
            </>
        );
    } else {
        return <Redirect />;
    }
};

export default Login;
