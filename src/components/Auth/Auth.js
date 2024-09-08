import SignUp from "./SignUp";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import './Auth.css';
import React, { useEffect } from "react";
import supabase from '../../supabase';
import { loginSuccess } from "../../actions";
import { useDispatch } from "react-redux";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
        dispatch(loginSuccess(user));
        navigate('/dashboard');
      }
    }
    checkUser();
  },[]);

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
