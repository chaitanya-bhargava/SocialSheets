import { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1>Social Sheets</h1>
        </div>
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>
        <div className="auth-form-container">
          {activeTab === 'login' ? <Login /> : <SignUp />}
        </div>
      </div>
      <button className="back-home-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

export default Auth;
