import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { REGISTER_MUTATION } from '../../queries/queries';


const Register = () => {
    const [createUser] = useMutation(REGISTER_MUTATION);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e, createUser) => {
        e.preventDefault();
        await createUser({ variables: { username, email, password } });
    };

    return (
        <form onSubmit={e => handleSubmit(e, createUser)}>
            <label>Username</label>
            <input onChange={e => setUsername(e.target.value)}></input>
            <label>Email</label>
            <input onChange={e => setEmail(e.target.value)}></input>
            <label>Password</label>
            <input onChange={e => setPassword(e.target.value)}></input>
            <button>Register</button>
        </form>
    );
};

export default Register;
