import React,{useState} from "react";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";
import { signup } from "../auth";
import StateDropdown from "./StateDropdown";
const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        state:'',
        error: '',
        success: false
    });

    const { name, email, password,state,success,error } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    }
  
    
    
    
    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name, email, password,state })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, success: false })
                }
                else {
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        password: '',
                        state:'',
                        error: '',
                        success: true
                    });
                }
            });
    };

    const signUpForm = () => (
      <form>
        <div className="form-group mt-5 pt-5">
          <label className="text font-weight-bold">Name</label>
          <input
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            value={name}
          />
        </div>
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
        <div className="form-group">
          <label className="text font-weight-bold">
            State:
            <StateDropdown value={state} onChange={handleChange("state")} />
          </label>
        </div>
        <div className="text-center">
          <button
            onClick={clickSubmit}
            className="mt-3 btn btn-outline-danger "
          >
            {" "}
            Register
          </button>
        </div>
      </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New Account Created.Please <Link to={"/signin"}>Sign In</Link>
        </div>
    );

    return (
        <Layout title="Sign Up Page" description="Sign Up to Online Shopping Website" className="container col-md-5 text-align-centre">
            
            {showSuccess()}
            {showError()}
            {signUpForm()}
          
            
        </Layout>
    );
};


export default Signup;
