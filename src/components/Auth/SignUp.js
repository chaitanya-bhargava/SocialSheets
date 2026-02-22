import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginSuccess } from '../../store/authSlice';
import { signUp } from '../../services/authService';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (confirmPassword !== password) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    const { data, error } = await signUp(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      dispatch(loginSuccess(data.user));
      setLoading(false);
      navigate('/');
    }
  };

  return (
    <>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Sign Up</button>
      </form>
      {loading && <div className="spinner" />}
      {error && <p className='error'>{error}</p>}
    </>
  );
};

export default SignUp;
