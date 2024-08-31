import { useState } from 'react';
import supabase from '../../supabase';
import { useNavigate } from "react-router";
import { loginSuccess } from '../../actions/index';
import { useDispatch } from 'react-redux';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    const { data,error } = await supabase.auth.signUp({
      email,
      password,
    });

    debugger

    if (error) {
      setError(error.message);
    } else {
      setMessage('');
      dispatch(loginSuccess(data.user));
      navigate('/')
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;
