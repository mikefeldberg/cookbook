import React, { useContext } from "react";
import { useApolloClient } from "@apollo/react-hooks";

import Button from 'react-bootstrap/Button';
import { AuthContext } from "../../App";

const Logout = () => {
    const client = useApolloClient();
    let currentUser = useContext(AuthContext)

    const handleLogout = (currentUser) => {
        // debugger
        localStorage.removeItem('authToken')
        client.writeData({ data: {isLoggedIn: false} })
        currentUser = null
        console.log('signed out user', client)
        client.resetStore()
    }

    return (
        <span onClick={() => handleLogout(currentUser)}>
            Logout
        </span>
    )
};

export default Logout;
