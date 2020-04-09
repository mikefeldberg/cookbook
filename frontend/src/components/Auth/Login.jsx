import React, { useState, useContext } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { LOGIN_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';
import Error from '../Shared/Error';

const Login = () => {
    const currentUser = useContext(AuthContext);
    const client = useApolloClient();
    const history = useHistory();
    const [tokenAuth] = useMutation(LOGIN_MUTATION);
    const { register, handleSubmit, errors, formState } = useForm({ mode: 'onChange' });
    const [errorText, setErrorText] = useState(null);

    const onSubmit = async (data) => {
        try {
            const { data: responseData, error } = await tokenAuth({
                variables: {
                    username: data.username,
                    email: data.email,
                    password: data.password,
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
            if (e.graphQLErrors && errorMessage.includes('enter valid credentials')) {
                setErrorText('Incorrect username or password');
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
                                required: {
                                    value: true,
                                    message: 'Enter your username'
                                }
                            })}
                        />
                        <small className="text-danger">{formState.touched.username && errors.username && errors.username.message}</small>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder=""
                            name="password"
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Enter your password'
                                }
                            })}
                        />
                    <small className="text-danger">{formState.touched.password && errors.password && errors.password.message}</small>
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
                        <Button disabled={!formState.isValid} className="w-50 p-1" variant="primary" type="submit">
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
