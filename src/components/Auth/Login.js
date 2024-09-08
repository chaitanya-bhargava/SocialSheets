import { useState } from 'react';
import supabase from '../../supabase';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router";
import { loginRequest, loginSuccess, loginFailure } from '../../actions/index';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null)
    setLoading(true)
    dispatch(loginRequest());

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      dispatch(loginFailure(error.message));
      setError(error.message)
      setLoading(false)
    } else {
      dispatch(loginSuccess(data.user));
      setLoading(false)
      navigate('/')
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true)
    const guestEmail = `guest_${Math.random().toString(36).substring(2, 10)}@example.com`;
  
    const { data, error } = await supabase.auth.signUp({
      email: guestEmail,
      password: Math.random().toString(36).substring(2, 10),
    });
  
    if (error) {
      console.error('Error creating guest account:', error.message);
      setLoading(false)
    } else {
      setLoading(false)
      navigate('/dashboard')
    }
  };

  return (
    <div className='auth'>
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
        <button type="button" className="guest-button" onClick={handleGuestLogin}> Guest Login </button>
      </form>
      {loading && <img className="loading" src="loading.gif" alt="loading"/>}
      {error && <p className='error'>{error}</p>}
    </div>
  );
};

export default Login;
