import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { isAuthenticated } from "./auth";

const UpdateForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
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

       setId(id);
       setEmail(email);
       setName(name);
       console.log(id);
     } catch (error) {
       console.log(error.response.data);
       setErrorMessage(error.response.data.error);
     }
   };
   fetchUser();
 }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    const nameRegex = /^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validName = nameRegex.test(name);
    const validEmail = emailRegex.test(email);

    if (!validName || !validEmail) {
      return setErrorMessage("Please enter valid values for all fields.");
    }
    try {
      // Send PUT request to backend server
      await axios.put(
        `http://localhost:8000/auth/users/${id}`,
        {
          name,
          email,
          password,
        });

      // Display success message
      setSuccessMessage("User updated successfully!");
      setErrorMessage("");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      // Display error message
      console.log(error.response.data);
      setErrorMessage(error.response.data.error);
      setSuccessMessage("");
    }
  };

  const updateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group mt-5 pt-5">
        <label className="text font-weight-bold">Name</label>
        <input
          type="text"
          className="form-control"
                  value={name}
                  placeholder={name}
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

      <div className="text-center">
        <button type="submit" className="mt-3 btn btn-outline-danger ">
          {" "}
          Update
        </button>
      </div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </form>
  );

  return (
    <Layout
      title="Update User Page"
      description="Update User Info"
      className="container col-md-5 text-align-centre"
    >
      {updateForm()}
    </Layout>
  );
};

export default UpdateForm;
