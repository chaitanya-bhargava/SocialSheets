import { useState } from 'react';
import supabase from '../../supabase';
import { useNavigate } from "react-router";
import { loginSuccess } from '../../actions/index';
import { useDispatch } from 'react-redux';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true)

    if(confirmPassword!=password){
      setError('Passwords do not match!');
      setLoading(false)
      return 
    }

    const { data,error } = await supabase.auth.signUp({
      email,
      password,
    });

    

    if (error) {
      setError(error.message);
      setLoading(false)
    } else {
      dispatch(loginSuccess(data.user));
      setLoading(false)
      navigate('/')
    }
  };

  return (
    <div className='auth'>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {loading && <img className="loading" src="loading.gif" alt="loading"/>}
      {error && <p className='error'>{error}</p>}
    </div>
  );
};

export default SignUp;
