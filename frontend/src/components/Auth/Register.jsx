import React, { useState, useContext } from 'react';
import { useHistory, Redirect, Link } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { REGISTER_MUTATION, LOGIN_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';
import Error from '../Shared/Error';

const Register = () => {
    const currentUser = useContext(AuthContext);
    const client = useApolloClient();
    const history = useHistory();
    const [createUser] = useMutation(REGISTER_MUTATION);
    const [tokenAuth] = useMutation(LOGIN_MUTATION);
    const [errorText, setErrorText] = useState(null);
    const { register, handleSubmit, errors, formState } = useForm({ mode: 'onChange' });

    const onSubmit = async (data) => {
        try {
            await createUser({
                variables: {
                    username: data.username,
                    email: data.email.toLowerCase(),
                    password: data.password,
                },
            });
            const { data: responseData, error } = await tokenAuth({
                variables: {
                    username: data.email.toLowerCase(),
                    password: data.password
                },
            });
            if (error) {
                setErrorText(error);
            }
            localStorage.setItem('authToken', responseData.tokenAuth.token);
            client.writeData({ data: { isLoggedIn: true } });
            client.resetStore();
        } catch (e) {
            let errorMessage = e.graphQLErrors[0]['message'];
            if (e.graphQLErrors && errorMessage.includes('duplicate key')) {
                if (errorMessage.includes('username')) {
                    setErrorText('Username not available');
                }
                if (errorMessage.includes('email')) {
                    setErrorText('An account with this email address already exists');
                }
            }
        }
    };

    if (!currentUser) {
        return (
            <>
                <Form className="mb-5 mx-auto w-50" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="username"
                            required
                            ref={register({
                                required: true,
                                pattern: {
                                    value: /^\w+$/,
                                    message: 'Username may only contain alphanumeric characters',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Username cannot exceed 20 characters',
                                },
                            })}
                        />
                        <small className="text-danger">
                            {formState.touched.username && errors.username && errors.username.message}
                        </small>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder=""
                            name="email"
                            required
                            ref={register({
                                required: true,
                                pattern: {
                                    value: /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i,
                                    message: 'Please enter a valid email address',
                                },
                            })}
                        />
                        <small className="text-danger">
                            {formState.touched.email && errors.email && errors.email.message}
                        </small>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder=""
                            name="password"
                            required
                            ref={register({
                                required: true,
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                            })}
                        />
                        <small className="text-danger">
                            {formState.touched.password && errors.password && errors.password.message}
                        </small>
                    </Form.Group>
                    <Form.Label className="mb-3">
                        <small>
                            By clicking Register you agree to our{' '}
                            <Link className="link" to="/terms">
                                Terms of Use
                            </Link>
                            .
                        </small>
                    </Form.Label>
                    <ButtonGroup className="w-100" aria-label="Basic example">
                        <Button
                            onClick={() => {
                                history.push('/login');
                            }}
                            className="w-50 p-1"
                            variant="outline-primary"
                        >
                            Already registered? Login here!
                        </Button>
                        <Button className="w-50 p-1" variant="primary" type="submit">
                            Register
                        </Button>
                    </ButtonGroup>
                    {errorText && <Error error={errorText} setErrorText={setErrorText} />}
                </Form>
            </>
        );
    } else {
        return <Redirect to="/" />;
    }
};

export default Register;
