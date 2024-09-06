import React, { useEffect } from "react";
import './HomePage.css';
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../actions";

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
      const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
          dispatch(loginSuccess(user));
        }
      }
      checkUser();
    },[]);

    const getStartedHandler = () => {
        navigate('/auth');
    }

  return (
    <div className="homepage-container">
      <div className="header">
        <h1>Social Sheets</h1>
        <p>Collaborate in real-time with your team on powerful, easy-to-use spreadsheets.</p>
        <button className="cta-button" onClick={getStartedHandler}>Get Started</button>
      </div>

      <div className="features">
        <div className="feature">
          <img src={'/live-collaboration.png'} alt="Real-Time Collaboration" className="feature-icon"/>
          <h3>Real-Time Collaboration</h3>
          <p>Work together with your team on the same spreadsheet, in real-time, from anywhere in the world.</p>
        </div>
        <div className="feature">
          <img src={'/usability.png'} alt="Intuitive Interface" className="feature-icon"/>
          <h3>Intuitive Interface</h3>
          <p>A user-friendly interface that feels familiar and powerful, helping you get things done faster.</p>
        </div>
        <div className="feature">
          <img src={'/business.png'} alt="Secure and Reliable" className="feature-icon business"/>
          <h3>Secure and Reliable</h3>
          <p>Your data is safe with us. We prioritize security to ensure your information is protected.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
