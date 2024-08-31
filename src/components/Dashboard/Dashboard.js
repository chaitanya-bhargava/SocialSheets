import './Dashboard.css'; // Importing the CSS file
import MySpreadsheets from "../MySpreadsheets/MySpreadsheets";
import JoinedSpreadsheets from '../JoinedSpreadsheets/JoinedSpreadsheets';

const Dashboard = () => {

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <h3>My Spreadsheets</h3>
      <MySpreadsheets/>
      <h3>Joined Spreadsheets</h3>
      <JoinedSpreadsheets/>
    </div>
  );
};

export default Dashboard;
