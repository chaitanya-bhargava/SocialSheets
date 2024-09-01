import { useSelector } from "react-redux";
import supabase from "../../supabase";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom";

const JoinedSpreadsheets = () => {
  const user = useSelector((state) => state.authReducer.user);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setSpreadsheetId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (spreadsheetId.trim()) {
      await supabase
        .from("users_spreadsheets")
        .insert([{ spreadsheet_id: spreadsheetId, user_id: user.id,owner:false }]);
      const response = await supabase
        .from("users_spreadsheets")
        .select("spreadsheet_id,spreadsheets (name)")
        .eq("user_id", user.id)
        .eq("owner",false);
      setSpreadsheets(response.data);
      setSpreadsheetId(''); 
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
    navigate(`/spreadsheet/${spreadsheetId}`); 
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("users_spreadsheets")
        .select("spreadsheet_id,spreadsheets (name)")
        .eq("user_id", user.id)
        .eq("owner",false);
      setSpreadsheets(data);
    };

    fetchData();
  }, [user]);

  return (
    <>
      <button className="create-button" onClick={openModal}>Join Spreadsheet</button>
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
            <div className="modal-content-label">Spreadsheet ID:</div>
            <div className="modal-content-label">(Ask from the owner of spreadsheet)</div>
            <input
              type="text"
              id="spreadsheetId"
              value={spreadsheetId}
              onChange={handleChange}
              placeholder="Enter spreadsheet id"
              required
            />
          </div>
          <button type="submit">Join</button>
        </form>
      </Modal>
    </>
  );
};

export default JoinedSpreadsheets;
