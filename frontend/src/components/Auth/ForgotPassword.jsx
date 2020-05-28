import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { CREATE_PASSWORD_RESET_REQUEST_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';
import Error from '../Shared/Error';

const ForgotPassword = () => {
    const currentUser = useContext(AuthContext);
    const history = useHistory();
    const [createPasswordResetRequest] = useMutation(CREATE_PASSWORD_RESET_REQUEST_MUTATION);
    const { register, handleSubmit, errors, formState } = useForm({ mode: 'onChange' });
    const [errorText, setErrorText] = useState(null);
    const [formIsSubmitted, setFormIsSubmitted] = useState(false);

    const onSubmit = async (data) => {
        createPasswordResetRequest({
            variables: { email: data.email },
        });
        setFormIsSubmitted(true);
    };

    if (!currentUser) {
        return (
            <>
                <Form className="mb-5 mx-auto w-50 fullWidthOnMobile" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                        <Form.Label>Please enter the email address you registered with</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder=""
                            name="email"
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
                    <ButtonGroup className="w-100 mb-3" aria-label="Basic example">
                        <Button
                            onClick={() => {
                                history.push('/login');
                            }}
                            className="w-50 p-1"
                            variant="outline-primary"
                        >
                            Back to Login
                        </Button>
                        <Button disabled={!formState.isValid} className="w-50 p-1" variant="primary" type="submit">
                            Submit
                        </Button>
                    </ButtonGroup>
                    {errorText && <Error error={errorText} setErrorText={setErrorText} />}
                    {formIsSubmitted && <Form.Label>A reset link has been sent to the email address above. It will expire in 10 minutes.</Form.Label>}
                </Form>
            </>
        );
    } else {
        return <Redirect to="/" />;
    }
};

export default ForgotPassword;
