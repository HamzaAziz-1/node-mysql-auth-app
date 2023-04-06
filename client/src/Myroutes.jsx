import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./SignupForm";
import Signin from "./SigninForm";
import Home from "./Home";
import InputTransactions from "./InputTransactions";
import Dashboard from "./Dashboard";
import ShowTransactions from "./ShowTransactions";
import UpdateTransactions from "./UpdateTransactions";

const Myroutes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/add-transactions" exact component={InputTransactions} />
        <Route path="/show-transactions" exact component={ShowTransactions} />
        <Route path="/update-transactions" exact component={UpdateTransactions} />
      </Switch>
    </BrowserRouter>
  );
};

export default Myroutes;
