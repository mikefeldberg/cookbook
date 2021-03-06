import React, { useState, useContext, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { RESET_PASSWORD_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';
import Error from '../Shared/Error';

const ResetPassword = ({ match, history }) => {
    const currentUser = useContext(AuthContext);
    const resetCode = match.params.reset_code;
    const { register, handleSubmit, errors, formState, watch } = useForm({ mode: 'onChange' });
    const [formIsSubmitted, setFormIsSubmitted] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = async (data) => {
        const res = await resetPassword({
            variables: { password: data.password, resetCode },
        });
        if (res) {
            if (res.data.resetPassword.user) {
                setFormIsSubmitted(true);
            } else {
                setErrorText('Your password reset link has expired.');
            }
        }
    };

    if (!currentUser) {
        return (
            <>
                <Form className="mb-5 mx-auto w-50 fullWidthOnMobile" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                        <Form.Label>Please enter a new password</Form.Label>
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
                        <small className="text-danger">
                            {formState.touched.password && errors.password && errors.password.message}
                        </small>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Re-enter password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder=""
                            name="password2"
                            ref={register({
                                required: true,
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                                validate: (value) => value === password.current || 'Passwords do not match',
                            })}
                        />
                        <small className="text-danger">
                            {formState.touched.password && errors.password2 && errors.password2.message}
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
                    {formIsSubmitted && <>Your password has been reset. You can now use it to log in.</>}
                </Form>
            </>
        );
    } else {
        return <Redirect to="/" />;
    }
};

export default ResetPassword;
