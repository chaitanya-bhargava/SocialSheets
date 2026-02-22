import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast/ToastContext";
import {
  linkUserToSpreadsheet,
  getUserSpreadsheets,
  getSpreadsheetById,
  leaveSpreadsheet,
} from "../../services/spreadsheetService";

const JoinedSpreadsheets = ({ searchQuery }) => {
  const user = useSelector((state) => state.auth.user);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [error, setError] = useState(null);
  const [confirmState, setConfirmState] = useState({ show: false, id: null, name: '' });
  const navigate = useNavigate();
  const toast = useToast();

  const refreshList = async () => {
    const { data, error } = await getUserSpreadsheets(user.id, false);
    if (error) {
      setError('Failed to load spreadsheets: ' + error.message);
      return;
    }
    setSpreadsheets(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!spreadsheetId.trim()) return;

    const { data: found, error: lookupError } = await getSpreadsheetById(spreadsheetId.trim());
    if (lookupError || !found || found.length === 0) {
      setError('Spreadsheet not found. Check the ID and try again.');
      return;
    }

    const { error: joinError } = await linkUserToSpreadsheet(spreadsheetId.trim(), user.id, false);
    if (joinError) {
      setError('Failed to join: ' + joinError.message);
      return;
    }

    toast(`Joined "${found[0].name}"!`, 'success');
    setSpreadsheetId('');
    setIsModalOpen(false);
    refreshList();
  };

  const handleLeave = async () => {
    const { error } = await leaveSpreadsheet(confirmState.id, user.id);
    if (error) {
      toast('Failed to leave: ' + error.message, 'error');
    } else {
      toast('Left spreadsheet', 'success');
      refreshList();
    }
    setConfirmState({ show: false, id: null, name: '' });
  };

  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filtered = searchQuery
    ? spreadsheets.filter((item) =>
        item.spreadsheets.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : spreadsheets;

  return (
    <>
      <button className="create-button" onClick={() => { setIsModalOpen(true); setError(null); }}>
        + Join Spreadsheet
      </button>
      <div className="spreadsheet-cards">
        {filtered.length === 0 && spreadsheets.length === 0 && (
          <div className="empty-state">
            <p>No joined spreadsheets</p>
            <p>Join a spreadsheet using its ID to collaborate!</p>
          </div>
        )}
        {filtered.length === 0 && spreadsheets.length > 0 && (
          <div className="empty-state">
            <p>No matching spreadsheets</p>
          </div>
        )}
        {filtered.map((item) => (
          <div key={item.spreadsheet_id} className="spreadsheet-card-wrapper">
            <div
              className="spreadsheet-card"
              onClick={() => navigate(`/spreadsheet/${item.spreadsheet_id}`)}
            >
              <div className="spreadsheet-card-info">
                <span className="spreadsheet-card-name">{item.spreadsheets.name}</span>
              </div>
            </div>
            <div className="spreadsheet-card-actions">
              <button
                className="card-action-btn card-action-delete"
                title="Leave"
                onClick={(e) => { e.stopPropagation(); setConfirmState({ show: true, id: item.spreadsheet_id, name: item.spreadsheets.name }); }}
              >
                &#10005;
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="modal-content-label">Spreadsheet ID:</div>
            <div className="modal-content-label" style={{ fontWeight: 400, fontSize: '0.8rem' }}>
              Ask the owner for the spreadsheet ID
            </div>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="Enter spreadsheet ID"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Join</button>
        </form>
      </Modal>

      <ConfirmDialog
        show={confirmState.show}
        title="Leave Spreadsheet"
        message={`Are you sure you want to leave "${confirmState.name}"?`}
        confirmLabel="Leave"
        variant="danger"
        onConfirm={handleLeave}
        onCancel={() => setConfirmState({ show: false, id: null, name: '' })}
      />
    </>
  );
};

export default JoinedSpreadsheets;
