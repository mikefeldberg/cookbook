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

export const GET_USERS_QUERY = gql`
    {
        users {
            id
            username
            email
        }
    }
`

export const GET_RECIPES_QUERY = gql`
    query getRecipesQuery {
        recipes {
            id
            title
            description
            skillLevel
            prepTime
            cookTime
            waitTime
            totalTime
            servings
            user {
                id
                username
            }
        }
    }
`

export const GET_RECIPE_QUERY = gql`
    query getRecipeQuery($id: String!) {
        recipe (id: $id) {
            id
            title
            description
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

export const CREATE_RECIPE_MUTATION = gql`
    mutation ($recipe: RecipeInput!) {
        createRecipe(recipe: $recipe) {
            recipe {
                id
                title
                description
            }
        }
    }
`

export const DELETE_RECIPE_MUTATION = gql`
    mutation($recipeId: String!) {
        deleteRecipe(recipeId: $recipeId) {
            recipeId
        }
    }
`
