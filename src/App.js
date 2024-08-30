import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import { Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import { useSelector } from 'react-redux';

function App() {
  const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
  debugger

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <div>Home</div>}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard/> : <Navigate to="/login" />}/>
      </Routes>
    </Router>
  );
}

export default App;
