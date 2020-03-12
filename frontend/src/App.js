import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { ME_QUERY } from './queries/queries';

import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import RecipesList from './components/Recipes/RecipesList';
import RecipeDetails from './components/Recipes/RecipeDetails';
import UploadPhoto from './components/Recipes/UploadPhoto';


export const AuthContext = React.createContext();

const App = () => {
    const currentUser = useQuery(ME_QUERY);
    console.log(currentUser);

    return (
        <div className="App">
            <Router>
                <AuthContext.Provider value={currentUser}>
                    <Switch>
                        <Route exact path="/" component={RecipesList} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/logout" component={Logout} />
                        <Route exact path="/recipes/new" component={UploadPhoto} />
                        <Route exact path="/recipes/:id" component={RecipeDetails} />
                    </Switch>
                </AuthContext.Provider>
            </Router>
        </div >
    );
}

export default App;
