import React,{Fragment} from "react";
import { Link, withRouter } from "react-router-dom";
import { signout,isAuthenticated } from "../auth";


const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: "#C9CCD5" };
    }
    else {
        return { color: '#ffffff' }
    }
       
};
 
const Menu = ({ history }) => (
    
  <div>
    <ul className=" nav nav-dark bg-dark justify-content-center">
      <li className="nav-item ">
        <Link className="nav-link" to="/" style={isActive(history, "/")}>
          Home{" "}
        </Link>
      </li>

    

      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <li className="nav-item ml-4">
          <Link
            className="nav-link"
            to="/user/dashboard"
            style={isActive(history, "/user/dashboard")}
          >
            Dashboard{" "}
          </Link>
        </li>
      )}

      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <li className="nav-item ml-4">
          <Link
            className="nav-link"
            to="/admin/dashboard"
            style={isActive(history, "/admin/dashboard")}
          >
            Dashboard{" "}
          </Link>
        </li>
      )}
      {!isAuthenticated() && (
        <Fragment>
          <li className="nav-item ml-4">
            <Link
              className="nav-link"
              to="/signin"
              style={isActive(history, "/signin")}
            >
              Signin{" "}
            </Link>
          </li>
          <li className="nav-item ml-4">
            <Link
              className="nav-link "
              to="/signup"
              style={isActive(history, "/signup")}
            >
              Signup{" "}
            </Link>
          </li>
        </Fragment>
      )}
      {isAuthenticated() && (
        <Fragment>
          {" "}
          <li className="nav-item ml-4">
            <span
              className="nav-link "
              style={{ cursor: "pointer", color: "#ffffff" }}
              onClick={() =>
                signout(() => {
                  history.push("/");
                })
              }
            >
              SignOut{" "}
            </span>
          </li>
        </Fragment>
      )}
    </ul>
    </div>
    
);

export default withRouter(Menu);