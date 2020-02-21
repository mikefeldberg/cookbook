import { gql } from 'apollo-boost';

// ~~~~~~~~~~~~~~~~~~~~~~~~~ QUERIES

export const IS_LOGGED_IN_QUERY = gql`
    query {
        isLoggedIn @client
    }
`

export const ME_QUERY = gql`
    {
        me {
            id
            username
            email
        }
    }
`

export const PROFILE_QUERY = gql`
    query ($id: Int!) {
        user(id: $id) {
            id
            username
            dateJoined
            documentSet {
                id
                title
                url
            }
        }
    }
`

export const GET_USERS_QUERY = gql`
    {
        users {
            id
            username
            email
        }
    }
`

// ~~~~~~~~~~~~~~~~~~~~~~~~~ MUTATIONS

export const REGISTER_MUTATION = gql`
    mutation ($username:String!, $email:String!, $password:String!) {
        createUser(username:$username, email:$email, password:$password) {
            user {
                username
                email
            }
        }
    }
`

export const LOGIN_MUTATION = gql`
    mutation ($username:String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
        }
    }
`