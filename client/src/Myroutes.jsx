import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./SignupForm";
import Signin from "./SigninForm";
import Home from "./Home";


const Myroutes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/home" exact component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default Myroutes;
