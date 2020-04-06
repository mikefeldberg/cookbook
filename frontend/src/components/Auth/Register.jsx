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
    const [formIsDisabled, setFormIsDisabled] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e, createUser) => {
        e.preventDefault();
        try {
            const { data, loading, error } = await createUser({ variables: { username, email, password } });
            if (error) {
                return `error`;
            }
        } catch (e) {
            let errorMessage = e.graphQLErrors[0]['message'];
            if (e.graphQLErrors && errorMessage.includes('duplicate key')) {
                if (errorMessage.includes('username')) {
                    setError('Username already exists');
                }
                if (errorMessage.includes('email')) {
                    setError('Email already exists');
                }
            }
        }
    };

    if (!currentUser) {
        console.log(error);
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
                        <Button disabled={formIsDisabled} className="w-50 p-1" variant="primary" type="submit">
                            Register
                        </Button>
                    </ButtonGroup>
                </Form>
                {error && <Error error={error} setError={setError} />}
            </>
        );
    } else {
        return <Redirect />;
    }
};

export default Register;
