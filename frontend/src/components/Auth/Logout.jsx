import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

const Logout = () => {
    const client = useApolloClient();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        client.writeData({ data: { isLoggedIn: false } });
        client.resetStore();
    };

    return <span onClick={handleLogout}>Logout</span>;
};

export default Logout;
