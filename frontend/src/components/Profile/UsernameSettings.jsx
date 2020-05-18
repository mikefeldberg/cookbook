import React, { useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { CHANGE_USERNAME_MUTATION } from '../../queries/queries';
import Error from '../Shared/Error';

const UsernameSettings = () => {
    const client = useApolloClient();
    const history = useHistory();
    const { register, handleSubmit, errors, formState } = useForm({ mode: 'onChange' });
    const [formIsSubmitted, setFormIsSubmitted] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [changeUsername] = useMutation(CHANGE_USERNAME_MUTATION);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        client.writeData({ data: { isLoggedIn: false } });
        client.resetStore();
    };

    const onSubmit = async (data) => {
        try {
            const { data: responseData, error} = await changeUsername({
                variables: { username: data.username },
            });
            if (responseData) {
                if (responseData.changeUsername.user.username) {
                    setFormIsSubmitted(true);
                    handleLogout();
                    history.push('/')
                } else {
                    setErrorText('Update failed. Please try again.');
                }
            }
            if (error) {
                setErrorText(error)
            }
        } catch (e) {
            let errorMessage = e.graphQLErrors[0]['message'];
            if (e.graphQLErrors && errorMessage.includes('duplicate key')) {
                if (errorMessage.includes('username')) {
                    setErrorText('Username not available');
                }
            }
        }

    };

    // if (currentUser) {
        return (
            <>
                <Form className="mx-auto w-50" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-1">
                        <Form.Label>Enter a new username</Form.Label>
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
                        <small className="text-danger">
                            {formState.touched.username && errors.username && errors.username.message}
                        </small>
                    </Form.Group>
                    <Form.Label><small className="text-danger mb-5">Note: You will be automatically logged out upon successful username change</small></Form.Label>
                    <ButtonGroup className="w-100 mb-3" aria-label="Basic example">
                        <Button
                            disabled={!formState.isValid || formIsSubmitted}
                            className="w-50 p-1"
                            variant="primary"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </ButtonGroup>
                    {errorText && <Error error={errorText} setErrorText={setErrorText} />}
                    {formIsSubmitted && <>Your username has been updated.</>}
                </Form>
            </>
        );
    // } else {
    //     return <Redirect to="/" />;
    // }
};

export default UsernameSettings;
