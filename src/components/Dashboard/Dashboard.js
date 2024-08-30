import { useSelector } from "react-redux";
import supabase from "../../supabase";
import { useEffect, useState } from "react";
import CustomSpreadsheet from "../CustomSpreadsheet/CustomSpreadsheet";

const Dashboard = () => {
  const user = useSelector((state) => state.authReducer.user);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [isOpen,setIsOpen] = useState(false);
  const [openSpreadsheet,setOpenSpreadsheet] = useState('');

  const addSpreadsheetHandler = async () => {
    const { data } = await supabase
      .from("spreadsheets")
      .insert([{}])
      .select("id");
    await supabase
      .from("users_spreadsheets")
      .insert([{ spreadsheet_id: data[0].id, user_id: user.id }]);
    const response = await supabase
      .from("users_spreadsheets")
      .select("spreadsheet_id")
      .eq("user_id", user.id);
      debugger
      setSpreadsheets(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("users_spreadsheets")
        .select("spreadsheet_id")
        .eq("user_id", user.id);
        debugger
        setSpreadsheets(data);
    };

    fetchData();
  }, [user]);

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Spreadsheets</h3>
      <button onClick={addSpreadsheetHandler}>Add Spreadsheet</button>
      {spreadsheets.map((item) => {
        return <div onClick={()=>{
            setIsOpen(true);
            setOpenSpreadsheet(item.spreadsheet_id);
        }}>{item.spreadsheet_id}</div>;
      })}
      {isOpen && <CustomSpreadsheet spreadsheet_id={openSpreadsheet}/>}
    </div>
  );
};

export default Dashboard;
