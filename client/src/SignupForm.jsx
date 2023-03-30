import React, { useState } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
const SignupForm = () => {
 const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const statenames = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    const nameRegex = /^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
    const validName = nameRegex.test(name);
    const validEmail = emailRegex.test(email);
   

    if (!validName || !validEmail || !state) {
      return setErrorMessage('Please enter valid values for all fields.');
    }

    try {
      // Send POST request to backend server
      await axios.post("http://localhost:8000/auth/signup", {
        name,
        email,
        password,
        state,
      });

      // Display success message
      setSuccessMessage('User created successfully!');
      setErrorMessage('');
      setName('');
      setEmail('');
      setPassword('');
      setState('');
    } catch (error) {
      // Display error message
      setErrorMessage('An error occurred while creating the user.');
      setSuccessMessage('');
    }
  };
  

  const signUpForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group mt-5 pt-5">
        <label className="text font-weight-bold">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="text font-weight-bold">Email</label>
        <input
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text font-weight-bold">Password</label>
        <input
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="form-control"
          value={password}
        />
      </div>

      <div className="form-group">
        <label className="text font-weight-bold">State</label>
        <Select
          options={statenames.map((state) => ({ value: state, label: state }))}
          value={{ value: state, label: state }}
          onChange={(selectedOption) => setState(selectedOption.value)}
          placeholder="Select a state..."
        />
      </div>

      <div className="text-center">
        <button type="submit" className="mt-3 btn btn-outline-danger ">
          {" "}
          Register
        </button>
      </div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </form>
  );

 

  return (
    <Layout
      title="Sign Up Page"
      description="Sign Up to  Website"
      className="container col-md-5 text-align-centre"
    >
      
      {signUpForm()}
    </Layout>
  );
};

export default SignupForm;
