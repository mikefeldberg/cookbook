import React, {useContext} from "react";
import { useApolloClient } from "@apollo/react-hooks";

import Button from 'react-bootstrap/Button';
import { AuthContext } from "../../App";

const Logout = () => {
    const client = useApolloClient();
    let currentUser = useContext(AuthContext)

    const handleLogout = (currentUser) => {
        localStorage.removeItem('authToken')
        client.writeData({ data: {isLoggedIn: false} })
        currentUser = null
        console.log('signed out user', client)
    }

    return (
        <AuthContext.Consumer>
            {currentuser => (
                <span onClick={() => handleLogout(currentUser)}>
                    Logout
                </span>
            )}
        </AuthContext.Consumer>
    )
};

export default Logout;


// import React from "react";
// import { ApolloConsumer } from "@apollo/react-hooks";

// import Button from 'react-bootstrap/Button';

// const Logout = ({ classes }) => {
//     const handleLogout = client => {
//         localStorage.removeItem('authToken')
//         client.writeData({ data: {isLoggedIn: false} })
//         console.log('signed out user', client)
//     }

//     return (
//         <ApolloConsumer>
//             {client => (
//                 <span onClick={() => handleLogout(client)}>
//                     Logout
//                 </span>
//             )}
//         </ApolloConsumer>
//     )
// };

// export default Logout;
