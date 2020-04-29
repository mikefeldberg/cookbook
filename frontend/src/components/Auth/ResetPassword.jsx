import React, { useState, useContext } from 'react';
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
    const { register, handleSubmit, errors, formState } = useForm({ mode: 'onChange' });
    const [formIsSubmitted, setFormIsSubmitted] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

    const onSubmit = async (data) => {
        const res = await resetPassword({
            variables: { password: data.password, resetCode },
        });
        if (res) {
            if (res.data.user) {
                setFormIsSubmitted(true)
            } else {
                setErrorText('Your password reset link has expired.')
            }
            
        }
    };

    if (!currentUser) {
        return (
            <>
                {!formIsSubmitted && (
                    <Form className="mx-auto w-50 mb-5" onSubmit={handleSubmit(onSubmit)}>
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
                    </Form>
                )}
                {formIsSubmitted &&
                    <div>success!@</div>
                }
            </>
        );
    } else {
        return <Redirect to="/" />;
    }
};

export default ResetPassword;
