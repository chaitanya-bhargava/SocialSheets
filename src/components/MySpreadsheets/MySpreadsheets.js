import { useSelector } from "react-redux";
import supabase from "../../supabase";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom";

const MySpreadsheets = () => {
  const user = useSelector((state) => state.authReducer.user);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spreadsheetName, setSpreadsheetName] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setSpreadsheetName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (spreadsheetName.trim()) {
      const { data } = await supabase
        .from("spreadsheets")
        .insert([{ name: spreadsheetName }])
        .select("id");
      await supabase
        .from("users_spreadsheets")
        .insert([{ spreadsheet_id: data[0].id, user_id: user.id, owner:true }]);
      const response = await supabase
        .from("users_spreadsheets")
        .select("spreadsheet_id,spreadsheets (name)")
        .eq("user_id", user.id)
        .eq("owner",true);
        
      setSpreadsheets(response.data);
      setSpreadsheetName(''); // Clear the input field after submission
      closeModal();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSpreadsheetHandler = (spreadsheetId) => {
    navigate(`/spreadsheet/${spreadsheetId}`); // Navigate to the spreadsheet page
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("users_spreadsheets")
        .select("spreadsheet_id,spreadsheets (name)")
        .eq("user_id", user.id)
        .eq("owner",true);
      
      setSpreadsheets(data);
    };

    fetchData();
  }, [user]);

  return (
    <>
      <button className="create-button" onClick={openModal}>Create Spreadsheet</button>
      <div className="divider"></div>
      <div className="spreadsheet-cards">
        {spreadsheets.map((item) => (
          <div
            key={item.spreadsheet_id}
            className="spreadsheet-card"
            onClick={() => {
              openSpreadsheetHandler(item.spreadsheet_id);
            }}
          >
            {item.spreadsheets.name}
          </div>
        ))}
      </div>
      <Modal show={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="modal-content-label">Spreadsheet Name:</div>
            <input
              type="text"
              id="spreadsheetName"
              value={spreadsheetName}
              onChange={handleChange}
              placeholder="Enter spreadsheet name"
              required
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </Modal>
    </>
  );
};

export default MySpreadsheets;
