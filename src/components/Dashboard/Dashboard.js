import { useState } from 'react';
import './Dashboard.css';
import MySpreadsheets from "../MySpreadsheets/MySpreadsheets";
import JoinedSpreadsheets from '../JoinedSpreadsheets/JoinedSpreadsheets';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../services/authService';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = user.email.substring(0, 6) === "guest_" ? 'Guest' : user.email;

  const handleLogout = async () => {
    await signOut();
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>Social Sheets</h1>
        </div>
        <div className="dashboard-header-right">
          <p className="dashboard-greeting">Welcome, <span>{displayName}</span></p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="dashboard-body">
        <div className="dashboard-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search spreadsheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="dashboard-content">
          <div className="spreadsheet-section">
            <h3>My Spreadsheets</h3>
            <MySpreadsheets searchQuery={searchQuery} />
          </div>
          <div className="spreadsheet-section">
            <h3>Joined Spreadsheets</h3>
            <JoinedSpreadsheets searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
