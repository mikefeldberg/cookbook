import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { ME_QUERY } from './queries/queries';

import Container from 'react-bootstrap/Container';

import NavBar from './components/Nav/NavBar';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import RecipesList from './components/Recipes/RecipesList';
import RecipeDetails from './components/Recipes/RecipeDetails';
import RecipeForm from './components/Recipes/RecipeForm/RecipeForm';


export const AuthContext = React.createContext();

const App = () => {
    const { data, loading } = useQuery(ME_QUERY);
    if (loading) return `Loading`
    const currentUser = null || data.me

    return (
        <div className="App">
            <Router>
                <AuthContext.Provider value={currentUser}>
                    <NavBar />
                    <Container>
                        <Switch>
                            <Route exact path="/" component={RecipesList} />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/logout" component={Logout} />
                            <Route exact path="/recipes/new" component={RecipeForm} />
                            <Route exact path="/recipes/:id" component={RecipeDetails} />
                        </Switch>
                    </Container>
                </AuthContext.Provider>
            </Router>
        </div >
    );
}

export default App;
