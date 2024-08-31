import React from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import './Auth.css';

const Auth = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <SignUp />
      </div>
      <div className="auth-box">
        <Login />
      </div>
    </div>
  );
};

export default Auth;
