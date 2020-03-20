import { gql } from 'apollo-boost';

// ~~~~~~~~~~~~~~~~~~~~~~~~~ QUERIES

export const IS_LOGGED_IN_QUERY = gql`
    query {
        isLoggedIn @client
    }
`

export const ME_QUERY = gql`
    query meQuery {
        me {
            id
            username
            email
        }
    }
`

export const PROFILE_QUERY = gql`
    query profileQuery ($id: Int!) {
        user(id: $id) {
            id
            username
            email
            recipeSet {
                id
                title
            }
            commentSet {
                id
                content
                rating
            }
            favoriteSet {
                id
                recipe {
                    id
                }
            }
        }
    }
`

export const GET_USERS_QUERY = gql`
    query getUsersQuery {
        users {
            id
            username
            email
            dateJoined
        }
        recipeSet {
            id
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
            ingredients {
                name
            }
            rating
            ratingCount
            favoriteCount
            photos {
                id
                url
            }
            comments {
                id
            }
            user {
                id
                username
            }
            favorites {
                id
                user {
                    id
                }
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
            skillLevel
            prepTime
            cookTime
            waitTime
            totalTime
            servings
            ingredients {
                id
                quantity
                name
                preparation
            }
            instructions {
                id
                order
                content
            }
            photos {
                id
                url
            }
            favorites {
                user {
                    id
                }
            }
            rating
            ratingCount
            comments {
                id
                content
                rating
                createdAt
                updatedAt
                user {
                    id
                    username
                }
                recipe {
                    id
                }
            }
            user {
                id
                username
                email
            }
            createdAt
            updatedAt
        }
    }
`

// ~~~~~~~~~~~~~~~~~~~~~~~~~ MUTATIONS

// ~~~~~~~~~~~~~~~~~~~~~~~~~ AUTH

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~ RECIPES

export const CREATE_RECIPE_MUTATION = gql`
    mutation ($recipe: RecipeInput!) {
        createRecipe(recipe: $recipe) {
            recipe {
                id
                title
                description
                skillLevel
                prepTime
                cookTime
                waitTime
                totalTime
                servings
                ingredients {
                    name
                }
                rating
                ratingCount
                favoriteCount
                photos {
                    id
                    url
                }
                comments {
                    id
                }
                user {
                    id
                    username
                }
                favorites {
                    id
                    user {
                        id
                    }
                }
            }
        }
    }
`

export const UPDATE_RECIPE_MUTATION = gql`
    mutation ($recipe: RecipeInput!) {
        updateRecipe(recipe: $recipe) {
            recipe {
                id
                title
                description
                ingredients {
                    quantity
                    preparation
                    name
                }
                instructions {
                    content
                    order
                }
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~ PHOTOS

export const CREATE_PHOTO_MUTATION = gql`
    mutation ($photo: PhotoInput!) {
        createPhoto(photo: $photo) {
            photo {
                id
                url
                recipe {
                    id
                }
            }
        }
    }
`

export const DELETE_PHOTO_MUTATION = gql`
    mutation($photoId: String!) {
        deletePhoto(photoId: $photoId) {
            photoId
        }
    }
`

// ~~~~~~~~~~~~~~~~~~~~~~~~~ COMMENTS

export const CREATE_COMMENT_MUTATION = gql`
    mutation ($comment: CommentInput!) {
        createComment(comment: $comment) {
            comment {
                id
                content
                rating
                createdAt
                updatedAt
                recipe {
                    id
                }
                user {
                    id
                    username
                }
            }
        }
    }
`

export const UPDATE_COMMENT_MUTATION = gql`
    mutation ($comment: CommentInput!) {
        updateComment(comment: $comment) {
                comment {
                    id
                    content
                    rating
                }
        }
    }
`

// export const CREATE_COMMENT_MUTATION = gql`
//     mutation ($comment: CommentInput!) {
//         createComment(comment: $comment) {
//                 comment {
//                     id
//                     content
//                     rating
//                     recipe {
//                         id
//                     }
//                 }
//         }
//     }
// `

// export const UPDATE_COMMENT_MUTATION = gql`
//     mutation ($comment: CommentInput!) {
//         updateComment(comment: $comment) {
//                 comment {
//                     id
//                     content
//                     rating
//                 }
//         }
//     }
// `

export const DELETE_COMMENT_MUTATION = gql`
    mutation($commentId: String!) {
        deleteComment(commentId: $commentId) {
            recipeId
        }
    }
`

// ~~~~~~~~~~~~~~~~~~~~~~~~~ FAVORITES

export const CREATE_FAVORITE_MUTATION = gql`
    mutation ($favorite: FavoriteInput!) {
        createFavorite(favorite: $favorite) {
                favorite {
                    user {
                        id
                        username
                    }
                    recipe {
                        id
                        title
                    }
                }
        }
    }
`

export const DELETE_FAVORITE_MUTATION = gql`
    mutation($recipeId: String!) {
        deleteFavorite(recipeId: $recipeId) {
            recipeId
        }
    }
`
