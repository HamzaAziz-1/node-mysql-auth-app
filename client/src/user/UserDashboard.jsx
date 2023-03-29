import React from "react";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";
const Dashboard = () => {
    const { user: { name, email, state } } = isAuthenticated();
    const userLinks = () => {
        return (
          <div className="card text-center">
            <h4 className="card-header"> User Links</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <Link className="nav-link" to={"/cart"}>
                  <button type="button" class="btn btn-outline-danger ">
                    My Cart
                  </button>
                </Link>{" "}
              </li>
              <li className="list-group-item">
                <Link className="nav-link" to={"/profile/update"}>
                  <button type="button" class="btn btn-outline-danger ">
                    Update Profile
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        );
    }

    const userInfo = () => {
        return (
            <div className="card mb-5 text-center">
                <h3 className="card-header">
                    User Information
                </h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">{state}</li>
                </ul>
            </div>
        );
    }
    
    return (
      <Layout title="Dashboard" description={`Hello ${name}!`}>
        <div className="container">
          <div className="row">
            <div className="mt-5 mr-3 ml-5 col-md-4">{userLinks()}</div>
            <div className="mt-5 ml-5 mr-3 col-md-6">{userInfo()}</div>
          </div>
        </div>
      </Layout>
    );
};

export default Dashboard;