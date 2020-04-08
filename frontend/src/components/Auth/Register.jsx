import React, { useState, useContext } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
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
            await createUser({ variables: { username: data.username, email: data.email, password: data.password } });
            const { data: responseData, error } = await tokenAuth({
                variables: { username: data.username, password: data.password },
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
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="username"
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
                        {formState.touched.username && errors.username && errors.username.message}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder=""
                            name="email"
                            ref={register({
                                required: true,
                                pattern: {
                                    value: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i,
                                    message: 'Please enter a valid email address',
                                },
                            })}
                        />
                        {formState.touched.email && errors.email && errors.email.message}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder=""
                            name="password"
                            ref={register({
                                required: true,
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                            })}
                        />
                        {errors.password && errors.password.message}
                    </Form.Group>
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
                        <Button disabled={!formState.isValid} className="w-50 p-1" variant="primary" type="submit">
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
