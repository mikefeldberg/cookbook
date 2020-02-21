import React, { useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { LOGIN_MUTATION } from '../../queries/queries';


const Login = () => {
    const client = useApolloClient();
    const [tokenAuth] = useMutation(LOGIN_MUTATION);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e, tokenAuth, client) => {
        e.preventDefault();
        const res = await tokenAuth({ variables: { username, password } });
        localStorage.setItem('authToken', res.data.tokenAuth.token);
        client.writeData({ data: { isLoggedIn: true } });
    };

    return (
        <form onSubmit={e => handleSubmit(e, tokenAuth, client)}>
            <label>Username</label>
            <input onChange={e => setUsername(e.target.value)}></input>
            <label>Password</label>
            <input onChange={e => setPassword(e.target.value)}></input>
            <button>Login</button>
        </form>
    );
};

export default Login;
