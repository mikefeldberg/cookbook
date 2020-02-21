import React, { useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { REGISTER_MUTATION,  } from '../../queries/queries';


const Register = () => {
    const client = useApolloClient();
    const [createUser] = useMutation(REGISTER_MUTATION);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e, createUser, client) => {
        e.preventDefault();
        await createUser({ variables: { username, email, password } });
    };

    return (
        <form onSubmit={e => handleSubmit(e, createUser, client)}>
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

