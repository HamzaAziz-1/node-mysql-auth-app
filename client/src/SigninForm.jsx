import React, { useState } from "react";
import Layout from "./Layout";
import { Redirect } from "react-router-dom";
import { authenticate, isAuthenticated,signin } from "./auth";

const SigninForm = () => {
    const [values, setValues] = useState({
      email: "",
      password: "",
      error: "",
      loading: false,
      redirect: false,
    });

const { email, password, loading, error, redirect } = values;
const { user } = isAuthenticated();
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
    }
  });
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
     const redirectUser = () => {
       if (isAuthenticated()) {
         return <Redirect to={"/dashboard"} />;
       }
     };

   
    return (
      <Layout
        title="Sign In Page"
        description="Sign In to Website"
        className="container col-md-5 text-align-centre"
      >
        {redirectUser()}
        {showLoading()}
        {showError()}
        {signUpForm()}
      </Layout>
    );
}
export default SigninForm;

