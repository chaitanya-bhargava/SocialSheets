import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import { useSelector } from 'react-redux';
import Auth from './components/Auth/Auth';
import CustomSpreadsheet from './components/CustomSpreadsheet/CustomSpreadsheet';
import HomePage from './components/HomePage/HomePage';

function App() {
  const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage/>}/>
        <Route path="/auth" element={<Auth/>} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard/> : <Navigate to="/auth" />}/>
        <Route path="/spreadsheet/:id" element={<CustomSpreadsheet />} />
      </Routes>
    </Router>
  );
}

export default App;
