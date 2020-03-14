import React, { Component, useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import IngredientRow from './IngredientRow';
import InstructionRow from './InstructionRow';


class RecipeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.user._id,
            ingredients: [{}],
            instructions: [{}],
            skillLevel: 'Easy',
        };
    }

    fetchRecipeData = () => {
        const data = omitDeep(this.props.data, '__typename')
        if (data.recipe) {
            this.setState({
                id: data.recipe.id,
                name: data.recipe.name,
                description: data.recipe.description,
                ingredients: data.recipe.ingredients,
                instructions: data.recipe.instructions,
                skillLevel: data.recipe.skillLevel,
                timePrep: data.recipe.timePrep,
                timeCook: data.recipe.timeCook,
                timeWait: data.recipe.timeWait,
                servings: data.recipe.servings,
                categories: data.recipe.categories,
                displayImage: data.recipe.displayImage,
                images: data.recipe.images,
            });
        }
    };

    componentDidMount = () => {
        this.fetchRecipeData()
    };

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const self = this;
        if (!this.props.match.params.id) {
            this.props
                .addRecipeMutation({
                    variables: {
                        input: {
                            name: this.state.name,
                            description: this.state.description,
                            ingredients: this.state.ingredients,
                            instructions: this.state.instructions,
                            skillLevel: this.state.skillLevel,
                            timePrep: parseInt(this.state.timePrep),
                            timeCook: parseInt(this.state.timeCook),
                            timeWait: parseInt(this.state.timeWait),
                            timeTotal:
                                parseInt(this.state.timePrep) +
                                parseInt(this.state.timeCook) +
                                parseInt(this.state.timeWait),
                            servings: parseInt(this.state.servings),
                            categories: this.state.categories,
                            displayImage: this.state.displayImage,
                            images: this.state.images,
                            userId: this.state.userId,
                        },
                    },
                })
                .then(() => {
                    self.props.history.push(`/`);
                });
        } else {
            this.props.updateRecipeMutation({
                variables: {
                    id: this.state.id,
                    name: this.state.name,
                    description: this.state.description,
                    ingredients: this.state.ingredients,
                    instructions: this.state.instructions,
                    skillLevel: this.state.skillLevel,
                    timePrep: parseInt(this.state.timePrep),
                    timeCook: parseInt(this.state.timeCook),
                    timeWait: parseInt(this.state.timeWait),
                    timeTotal:
                        parseInt(this.state.timePrep) +
                        parseInt(this.state.timeCook) +
                        parseInt(this.state.timeWait),
                    servings: parseInt(this.state.servings),
                    categories: this.state.categories,
                    displayImage: this.state.displayImage,
                    images: this.state.images,
                },
            })
            .then(() => {
                self.props.history.push(`/recipes/${this.props.match.params.id}`);
            });
        }
    };

    handleIngredientChange = idx => e => {
        const { name, value } = e.target;
        const ingredients = [...this.state.ingredients];
        ingredients[idx][name] = value;
        this.setState({
            ingredients,
        });
    };

    handleInstructionChange = idx => e => {
        const { name, value } = e.target;
        const instructions = [...this.state.instructions];
        instructions[idx] = {
            [name]: value,
        };
        this.setState({
            instructions,
        });
    };

    handleAddIngredient = () => {
        const ingredient = {
            quantity: '',
            item: '',
            preparation: '',
        };
        this.setState({
            ingredients: [...this.state.ingredients, ingredient],
        });
    };

    handleAddInstruction = () => {
        const instruction = {
            text: '',
        };
        this.setState({
            instructions: [...this.state.instructions, instruction],
        });
    };

    handleDeleteSpecificIngredient = idx => () => {
        const ingredients = [...this.state.ingredients];
        ingredients.splice(idx, 1);
        this.setState({ ingredients });
    };

    handleDeleteSpecificInstruction = idx => () => {
        const instructions = [...this.state.instructions];
        instructions.splice(idx, 1);
        this.setState({ instructions });
    };

    render() {
        return (
            <div className="container">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Recipe Name</Form.Label>
                        <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Recipe Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                            as="textarea"
                            rows="3"
                        />
                    </Form.Group>
                    <Form.Group controlId="formIngredients">
                        <Form.Label>Ingredients</Form.Label>
                        <div className="row clearfix">
                            <div name="ingredients" className="col-12 column">
                                <table className="table table-bordered table-hover" id="tab_logic">
                                    <thead>
                                        <tr>
                                            <th className="text-center"> </th>
                                            <th className="text-center"> Qty & Unit</th>
                                            <th className="text-center"> Ingredient </th>
                                            <th className="text-center"> Preparation </th>
                                            <th />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.ingredients.map((ingredient, idx) => (
                                            <IngredientRow
                                                ingredient={ingredient}
                                                handleIngredientChange={this.handleIngredientChange}
                                                handleDeleteSpecificIngredient={this.handleDeleteSpecificIngredient}
                                                key={idx}
                                                idx={idx}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                                <button type="button" onClick={this.handleAddIngredient} className="btn btn-primary">
                                    Add Ingredient
                                </button>
                            </div>
                        </div>
                        <Form.Label>Instructions</Form.Label>
                        <div className="row clearfix">
                            <div name="instructions" className="col-md-12 column">
                                <table className="table table-bordered table-hover" id="tab_logic">
                                    <tbody>
                                        {this.state.instructions.map((instruction, idx) => (
                                            <InstructionRow
                                                instruction={instruction}
                                                handleInstructionChange={this.handleInstructionChange}
                                                handleDeleteSpecificInstruction={this.handleDeleteSpecificInstruction}
                                                key={idx}
                                                idx={idx}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                                <button type="button" onClick={this.handleAddInstruction} className="btn btn-primary">
                                    Add Instruction
                                </button>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Servings</Form.Label>
                        <Form.Control
                            type="number"
                            name="servings"
                            value={this.state.servings}
                            onChange={this.handleChange}
                            pattern="\d+"
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrepTime">
                        <Form.Label>Prep Time</Form.Label>
                        <Form.Control
                            type="number"
                            name="timePrep"
                            value={this.state.timePrep}
                            onChange={this.handleChange}
                            pattern="\d+"
                        />
                    </Form.Group>
                    <Form.Group controlId="formCookTime">
                        <Form.Label>Cook Time</Form.Label>
                        <Form.Control
                            type="number"
                            name="timeCook"
                            value={this.state.timeCook}
                            onChange={this.handleChange}
                            pattern="\d+"
                        />
                    </Form.Group>
                    <Form.Group controlId="formWaitTime">
                        <Form.Label>Wait Time</Form.Label>
                        <Form.Control
                            type="number"
                            name="timeWait"
                            value={this.state.timeWait}
                            onChange={this.handleChange}
                            pattern="\d+"
                        />
                    </Form.Group>
                    <Form.Group controlId="formDisplayImage">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="displayImage"
                            value={this.state.displayImage}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Button type="button" variant="primary" onClick={this.handleSubmit}>
                        Save Recipe
                    </Button>
                </Form>
            </div>
        );
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
    graphql(addRecipeMutation, { name: 'addRecipeMutation' }),
    graphql(updateRecipeMutation, { name: 'updateRecipeMutation' })
)(RecipeForm);
