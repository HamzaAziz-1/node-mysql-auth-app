import React, { useState,useEffect } from "react";
import Layout from "./Layout";
import { Redirect } from "react-router-dom";
import { authenticate, isAuthenticated, signin } from "./auth";
import { useHistory } from "react-router-dom";
const clientId =
  "133522538881-2j9114vn23tf58143tvn348mivgeaqjr.apps.googleusercontent.com";

  

const SigninForm = () => {
  const [contacts, setContacts] = useState([]);
  const history = useHistory();
    const [values, setValues] = useState({
      email: "",
      password: "",
      error: "",
      loading: false,
      redirect: false,
    });
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleButton;
    document.body.appendChild(script);
  }, []);

const { email, password, loading, error, redirect } = values;
// const { user } = isAuthenticated();
const handleChange = (name) => (event) => {
  setValues({ ...values, error: false, [name]: event.target.value });
};


const clickSubmit = (event) => {
  event.preventDefault();
  setValues({ ...values, error: false, loading: true });
  signin({ email, password }).then((data) => {
    console.log(data);
    if (data.error) {
      setValues({ ...values, error: data.error, loading: false });
    } else {
      authenticate(data, () => {
        setValues({
          ...values,
          redirect: true,
        });
      });
      history.push("/dashboard");
    }
  });
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
    const fetchContacts = async (accessToken) => {
      const response = await fetch(
        `https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&access_token=${accessToken}` 
      );
      const contactsData = await response.json();
      return contactsData.connections;
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
    // Save the token in local storage
    
      const contacts = await fetchContacts(data.accessToken);
    setContacts(contacts);
    console.log(contacts);
    // Navigate to the dashboard
    history.push("/dashboard");
  };


 
  
   const signUpForm = () => (
     <div className="container mt-5 pt-5">
       <form>
         <div className="form-group">
           <label className="text font-weight-bold">Email</label>
           <input
             onChange={handleChange("email")}
             type="email"
             className="form-control"
             value={email}
           />
         </div>
         <div className="form-group">
           <label className="text font-weight-bold">Password</label>
           <input
             onChange={handleChange("password")}
             type="password"
             className="form-control"
             value={password}
           />
         </div>
         {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
         <div className="text-center">
           <button onClick={clickSubmit} className="mt-3 btn btn-outline-dark ">
             {" "}
             Sign In
           </button>
           <div
             style={{ marginLeft: "11em" }}
             className="mt-4"
             id="google-auth-button"
             role="button"
             tabIndex="0"
           ></div>
           <div className="mt-5"></div>
         </div>
       </form>
     </div>
   );
    const showError = () => (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
    const showLoading = () =>
      loading && (
        <div className="alert alert-info">
          <h3>Loading.......</h3>
        </div>
      );
    //  const redirectUser = () => {
    //    if (isAuthenticated()) {
    //      return <Redirect to={"/dashboard"} />;
    //    }
    //  };

   
    return (
      <Layout
        title="Sign In Page"
        description="Sign In to Website"
        className="container col-md-5 text-align-centre"
      >
        {/* {redirectUser()} */}
        {showLoading()}
        {showError()}
        {signUpForm()}
        
      </Layout>
    );
}
export default SigninForm;

