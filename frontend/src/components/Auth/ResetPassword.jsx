import React, { useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { RESET_PASSWORD_MUTATION } from '../../queries/queries';
import { AuthContext } from '../../App';
import Error from '../Shared/Error';

const ResetPassword = ({match}) => {
    const resetCode = match.params.reset_code;

    const currentUser = useContext(AuthContext);
    const history = useHistory();
    const { register, handleSubmit, errors, formState } = useForm({ mode: 'onChange' });
    const [errorText, setErrorText] = useState(null);
    const [formIsSubmitted, setFormIsSubmitted] = useState(false);

    const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

    const onSubmit = async (data) => {
        // createPasswordResetRequest({
        //     variables: { email: data.email },
        // });
        setFormIsSubmitted(true);
    };

    if (!currentUser) {
        return (
            <>
                <Form className="mx-auto w-50 mb-5" onSubmit={handleSubmit(onSubmit)}>
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

export default ResetPassword;
