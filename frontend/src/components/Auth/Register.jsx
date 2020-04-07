import React, { useState, useContext } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { REGISTER_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';
import Error from '../Shared/Error';

const Register = () => {
    const currentUser = useContext(AuthContext);
    const history = useHistory();
    const [createUser] = useMutation(REGISTER_MUTATION);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitIsDisabled] = useState(false);
    const [errorText, setErrorText] = useState(null);

    const handleSubmit = async (e, createUser) => {
        e.preventDefault();
        try {
            await createUser({ variables: { username, email, password } });
        } catch (e) {
            let errorMessage = e.graphQLErrors[0]['message'];
            if (e.graphQLErrors && errorMessage.includes('duplicate key')) {
                if (errorMessage.includes('username')) {
                    setErrorText('Username already exists');
                }
                if (errorMessage.includes('email')) {
                    setErrorText('Email already exists');
                }
            }
        }
    };

    if (!currentUser) {
        return (
            <>
                <Form className="mx-auto w-50" onSubmit={(e) => handleSubmit(e, createUser)}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control onChange={(e) => setUsername(e.target.value)} type="username" />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" />
                    </Form.Group>
                    <ButtonGroup className="w-100" aria-label="Basic example">
                        <Button
                            onClick={() => {
                                history.push('/login');
                            }}
                            className="w-50 p-1"
                            variant="outline-primary"
                        >
                            Already a user? Login here!
                        </Button>
                        <Button disabled={submitIsDisabled} className="w-50 p-1" variant="primary" type="submit">
                            Register
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

export default Register;
