import React from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "./auth/index";
const PrivateRoute = ({ children }) => {
  
    const token = isAuthenticated().token;
    
  if (!token) {
    return <Redirect to="/" />;
  }
  return children;
};
export default PrivateRoute;
