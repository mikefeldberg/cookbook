import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import App from './App';
import './index.css';


const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/',
    fetchOptions: {
        credentials: "include"
    },
    request: operation => {
        const token = localStorage.getItem('authToken') || ""
        operation.setContext({
            headers: {
                Authorization: `JWT ${token}`
            }
        })
    },

    clientState: {
        defaults: {
            isLoggedIn: !!localStorage.getItem('authToken')
        }
    }
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
    , document.getElementById('root')
);