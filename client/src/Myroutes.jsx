import React from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import PrivateRoute from "./auth/PrivateRoute"
import Dashboard from "./user/UserDashboard";



const Myroutes = () => {
    return (
        <BrowserRouter>
            
        <Switch>
            <Route path="/" exact component={Signin} />
            <Route path="/signin" exact component={Signin} />
            <Route path="/signup" exact component={Signup} />
            <PrivateRoute path='/user/dashboard' exact component={ Dashboard}/>
                   
        </Switch>
        </BrowserRouter>
    );

};

export default Myroutes;
