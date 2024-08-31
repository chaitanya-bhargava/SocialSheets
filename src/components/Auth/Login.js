import { useState } from 'react';
import supabase from '../../supabase';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router";
import { loginRequest, loginSuccess, loginFailure } from '../../actions/index';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginRequest());

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(data)
    
    if (error) {
      dispatch(loginFailure(error.message));
      setError(error.message)
    } else {
      dispatch(loginSuccess(data.user));
      
      navigate('/')
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}!</p>}
    </div>
  );
};

export default Login;
