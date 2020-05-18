import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import Container from 'react-bootstrap/Container';

import { ME_QUERY } from './queries/queries';
import NavBar from './components/Nav/NavBar';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import RecipesList from './components/Recipes/RecipesList';
import RecipeDetails from './components/Recipes/RecipeDetails';
import CreateRecipe from './components/Recipes/RecipeForm/CreateRecipe';
import UpdateRecipe from './components/Recipes/RecipeForm/UpdateRecipe';
import ProfilePage from './components/Profile/ProfilePage';
import Footer from './components/Footer/Footer';
import Terms from './components/Footer/Terms';


export const AuthContext = React.createContext();

const App = () => {
    const { data, loading } = useQuery(ME_QUERY);

    if (loading) return `Loading`
    let currentUser = data ? data.me : null;

    return (
        <div className="App">
            <Router>
                <AuthContext.Provider value={currentUser}>
                    <NavBar />
                    <Container className="content">
                        <Switch>
                            <Route exact path="/" component={RecipesList} />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/logout" component={Logout} />
                            <Route exact path="/forgot" component={ForgotPassword} />
                            <Route exact path="/reset_password/:reset_code" component={ResetPassword} />
                            <Route exact path="/recipes/new" component={CreateRecipe} />
                            <Route exact path="/recipes/:id" component={RecipeDetails} />
                            <Route exact path="/recipes/:id/edit" component={UpdateRecipe} />
                            <Route exact path="/profile/:id" component={ProfilePage} />
                            <Route exact path="/terms" component={Terms} />
                        </Switch>
                    </Container>
                    <Footer />
                </AuthContext.Provider>
            </Router>
        </div >
    );
}

export default App;
