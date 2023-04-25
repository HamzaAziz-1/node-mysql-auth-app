import React, { useState,useEffect } from "react";
import Layout from "./Layout";
import { Link,useHistory } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const SignupForm = () => {
  const clientId =
    "133522538881-2j9114vn23tf58143tvn348mivgeaqjr.apps.googleusercontent.com";

  
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

  const history = useHistory();
   useEffect(() => {
     const script = document.createElement("script");
     script.src = "https://accounts.google.com/gsi/client";
     script.async = true;
     script.defer = true;
     script.onload = initGoogleButton;
     document.body.appendChild(script);
   }, []);

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
      console.log(error.response.data);
      setErrorMessage(error.response.data.error);
      setSuccessMessage('');
    }
  };
  
   const initGoogleButton = () => {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      cancel_on_tap_outside: false,
      scope:
        "email profile openid https://www.googleapis.com/auth/contacts.readonly", // Add the required scopes here
    });

     window.google.accounts.id.renderButton(
       document.getElementById("google-auth-button"),
       {
         theme: "outline",
         size: "large",
       }
     );
     window.google.accounts.id.prompt();
   };

   const handleCredentialResponse = async (response) => {
     const { client_id, credential } = response;

     // Send the token to your backend for user authentication and creation
     const backendResponse = await fetch(
       "http://localhost:8000/auth/google-signin",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ token: credential }),
       }
     );

     const data = await backendResponse.json();
     console.log("Login success:", data);
     const storageData = {
       accessToken: data.access_token,
       jwt: data.token, // Store the JWT token
       user: data.user, // Store the user data
     };
     localStorage.setItem("user", JSON.stringify(storageData));
     // Save the token in local storage
     localStorage.setItem("jwt", JSON.stringify(data));

     // Navigate to the dashboard
     history.push("/dashboard");
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

      <div className="text-center mt-5 pt-3">
        <button type="submit" className="mt-3 mb-5 btn btn-outline-danger ">
          {" "}
          Register
        </button>
        <div style={{ marginLeft: "11em" }} className="" id="google-auth-button" role="button" tabIndex="0"></div>
        <div className="mt-5"></div>
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
