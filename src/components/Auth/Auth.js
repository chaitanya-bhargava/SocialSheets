import React from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();

  const goHomeHandler = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <SignUp />
      </div>
      <div className="auth-box">
        <Login />
      </div>
      <button className="back-home-button" onClick={goHomeHandler}>Back to Home</button>
    </div>
  );
};

export default Auth;
