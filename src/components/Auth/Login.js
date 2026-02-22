import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginRequest, loginSuccess, loginFailure } from '../../store/authSlice';
import { signIn, signUp } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    dispatch(loginRequest());

    const { data, error } = await signIn(email, password);

    if (error) {
      dispatch(loginFailure(error.message));
      setError(error.message);
      setLoading(false);
    } else {
      dispatch(loginSuccess(data.user));
      setLoading(false);
      navigate('/');
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    const guestEmail = `guest_${Math.random().toString(36).substring(2, 10)}@example.com`;
    const guestPassword = Math.random().toString(36).substring(2, 10);

    const { data, error } = await signUp(guestEmail, guestPassword);

    if (error) {
      setError('Error creating guest account: ' + error.message);
      setLoading(false);
    } else {
      dispatch(loginSuccess(data.user));
      setLoading(false);
      navigate('/dashboard');
    }
  };

  return (
    <>
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
        <button type="submit" disabled={loading}>Login</button>
        <button type="button" className="guest-button" onClick={handleGuestLogin} disabled={loading}>
          Continue as Guest
        </button>
      </form>
      {loading && <div className="spinner" />}
      {error && <p className='error'>{error}</p>}
    </>
  );
};

export default Login;
