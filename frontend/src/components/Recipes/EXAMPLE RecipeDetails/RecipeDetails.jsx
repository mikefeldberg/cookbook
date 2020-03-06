import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import Row from 'react-bootstrap/Row';

import {
    getRecipeQuery,
    updateRecipeMutation,
    deleteRecipeMutation,
    addFeedbackMutation,
    updateFeedbackMutation,
    addFavoriteMutation,
    updateFavoriteMutation,
} from '../../queries/queries';

import RecipeSummary from './RecipeSection/RecipeSummary';
import RecipeDashboard from './RecipeSection/RecipeDashboard';
import RecipeIngredients from './RecipeSection/RecipeIngredients';
import RecipeInstructions from './RecipeSection/RecipeInstructions';
import FeedbackForm from './FeedbackSection/FeedbackForm/FeedbackForm';
import CommentList from './FeedbackSection/CommentList';

class RecipeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackDisabled: false,
            feedbackRating: 0,
            feedbackComment: '',
            editedComment: '',
            editedRating: 0
        };
    }

    checkUser = () => {
        return this.props.user ? this.setState({feedbackDisabled: false }) : this.setState({feedbackDisabled: true })
    }

    componentDidMount = () => {
        this.checkUser()
    }

    handleChange = e => {
        console.log(e.target.name);
        console.log(e.target.value);
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        console.log('feedback submit clicked')
        // this.props.updateRecipeMutation(variables);
        this.props.addFeedbackMutation({
            variables: {
                input: {
                    content: this.state.feedbackComment,
                    rating: this.state.feedbackRating,
                    userId: this.props.user.id,
                    recipeId: this.props.match.params.id,
                },
            },
        });
    };

    handleDelete = e => {
        e.preventDefault();
        const self = this;
        this.props.deleteRecipeMutation({
            variables: {
                id: this.props.match.params.id
            },
        })
        .then(() => {
            self.props.history.push(`/`);
        });
    };

    handleStarClick = (nextValue, prevValue, name) => {
        this.setState({feedbackRating: nextValue});
    };

    displayRecipe = () => {
        let data = this.props.data;
        if (data.recipe) {
            return (
                <div>
                    <RecipeDashboard handleDelete={this.handleDelete} recipe={data.recipe} user={this.props.user} />
                    <RecipeSummary recipe={data.recipe} />
                    <RecipeIngredients recipe={data.recipe} />
                    <RecipeInstructions recipe={data.recipe} />
                    <Row><h2>Comments</h2></Row>
                    <div className="col-md-10 offset-1">
                    <FeedbackForm
                        feedbackDisabled={this.state.feedbackDisabled}
                        recipe={data.recipe}
                        currentRating={this.state.currentRating}
                        feedbackRating={this.state.feedbackRating}
                        feedbackComment={this.state.feedbackComment}
                        handleChange={this.handleChange}
                        handleStarClick={this.handleStarClick}
                        handleSubmit={this.handleSubmit}
                    />
                    <CommentList feedbacks={data.recipe.feedbacks} />
                    </div>
                </div>
            );
        } else {
            return <div>Loading Recipe</div>;
        }
    };

    render() {
        return <div>{this.displayRecipe()}</div>;
    }
}

export default compose(
    graphql(getRecipeQuery, {
        options: props => {
            return {
                variables: {
                    id: props.match.params.id,
                },
            };
        },
    }),
    graphql(updateRecipeMutation, { name: 'updateRecipeMutation' }),
    graphql(deleteRecipeMutation, { name: 'deleteRecipeMutation' }),
    graphql(addFeedbackMutation, { name: 'addFeedbackMutation' }),
    graphql(updateFeedbackMutation, { name: 'updateFeedbackMutation' }),
    graphql(addFavoriteMutation, { name: 'addFavoriteMutation' }),
    graphql(updateFavoriteMutation, { name: 'updateFavoriteMutation' }),
)(RecipeDetails);
