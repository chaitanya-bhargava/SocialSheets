import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import { useSelector } from 'react-redux';
import Auth from './components/Auth/Auth';
import CustomSpreadsheet from './components/CustomSpreadsheet/CustomSpreadsheet';
import HomePage from './components/HomePage/HomePage';
import InviteHandler from './components/InviteHandler/InviteHandler';
import useSessionRestore from './hooks/useSessionRestore';
import './App.css';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="not-found-link">Go Home</Link>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="app-loading">
      <div className="app-loading-brand">Social Sheets</div>
      <div className="spinner" />
    </div>
  );
}

function App() {
  const loading = useSessionRestore();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/spreadsheet/:id" element={isAuthenticated ? <CustomSpreadsheet /> : <Navigate to="/auth" />} />
        <Route path="/invite/:id" element={isAuthenticated ? <InviteHandler /> : <Navigate to="/auth" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
