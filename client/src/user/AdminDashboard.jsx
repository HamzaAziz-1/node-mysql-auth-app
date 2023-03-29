import React from "react";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
    const { user: { _id, name, email, role } } = isAuthenticated();
    const adminLinks = () => {
        return (
          <div className="card bg-light mb-3 text-center">
            <h4 className="card-header"> Admin Links</h4>
            <ul className="list-group">
              <li className="list-group-item card-text">
                <Link className="nav-link" to={"/create/category"}>
                  <button type="button" class="btn btn-outline-danger ">
                    Create Category
                  </button>
                </Link>{" "}
              </li>
              <li className="list-group-item card-text">
                <Link className="nav-link card-text" to={"/create/product"}>
                  <button type="button" class="btn btn-outline-danger ">
                    Create Product
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        );
    }

   

    const adminInfo = () => {
        return (
           

            <div className="card mb-5 text-center">
                <h3 className="card-header h3">
                    User Information
                </h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">{role === 1 ? 'Admin' : 'Registered User'}</li>
                </ul>
            </div>
           
            
        );
    }
    
    return (
      <Layout title="Dashboard" description={`Hello ${name}!`}>
            <div className="container">
        <div className="row">
          <div className="mt-5 mr-3 ml-5 col-md-4">{adminLinks()}</div>
          <div className="mt-5 ml-5 mr-3 col-md-6">{adminInfo()}</div>
        </div>
        </div>
      </Layout>
    );
};

export default AdminDashboard;