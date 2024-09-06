import './Dashboard.css'; // Importing the CSS file
import MySpreadsheets from "../MySpreadsheets/MySpreadsheets";
import JoinedSpreadsheets from '../JoinedSpreadsheets/JoinedSpreadsheets';
import { useDispatch } from 'react-redux';
import { logout } from '../../actions';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async() => {
    dispatch(logout()); 
    let { error } = await supabase.auth.signOut()
    navigate('/'); 
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-content">
        <div className="spreadsheet-section">
          <h3>My Spreadsheets</h3>
          <MySpreadsheets />
        </div>
        <div className="spreadsheet-section">
          <h3>Joined Spreadsheets</h3>
          <JoinedSpreadsheets />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
