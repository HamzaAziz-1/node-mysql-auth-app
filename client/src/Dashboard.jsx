import React from "react";
import { isAuthenticated } from "./auth";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userid, setuserId] = useState("");
  const [password, setPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = isAuthenticated().token;
  useEffect(() => {
    // Fetch the current user's information and update the form fields
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { id, name, email } = response.data;

        setuserId(id);
        setEmail(email);
        setName(name);
        console.log("User id is: "+id);
      } catch (error) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
      }
    };
    fetchUser();
  }, []);


  const userLinks = () => {
    return (
      <div className="card text-center">
        <h4 className="card-header"> User Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to={"/add-transactions"}>
              <button type="button" className="btn btn-outline-danger ">
                Input Transactions
              </button>
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to={"/show-transactions"}>
              <button type="button" className="btn btn-outline-danger ">
                View Transactions
              </button>
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5 text-center">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          
        </ul>
      </div>
    );
  };

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
