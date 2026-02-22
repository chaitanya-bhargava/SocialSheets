import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast/ToastContext";
import {
  createSpreadsheet,
  linkUserToSpreadsheet,
  getUserSpreadsheets,
  deleteSpreadsheet,
  renameSpreadsheet,
} from "../../services/spreadsheetService";

const MySpreadsheets = ({ searchQuery }) => {
  const user = useSelector((state) => state.auth.user);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spreadsheetName, setSpreadsheetName] = useState('');
  const [error, setError] = useState(null);
  const [confirmState, setConfirmState] = useState({ show: false, id: null, name: '' });
  const [renameState, setRenameState] = useState({ show: false, id: null, name: '' });
  const navigate = useNavigate();
  const toast = useToast();

  const refreshList = async () => {
    const { data, error } = await getUserSpreadsheets(user.id, true);
    if (error) {
      setError('Failed to load spreadsheets: ' + error.message);
      return;
    }
    setSpreadsheets(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!spreadsheetName.trim()) return;

    const { data, error: insertError } = await createSpreadsheet(spreadsheetName);
    if (insertError) {
      setError('Failed to create spreadsheet: ' + insertError.message);
      return;
    }

    const { error: linkError } = await linkUserToSpreadsheet(data[0].id, user.id, true);
    if (linkError) {
      setError('Failed to link spreadsheet: ' + linkError.message);
      return;
    }

    toast('Spreadsheet created!', 'success');
    setSpreadsheetName('');
    setIsModalOpen(false);
    refreshList();
  };

  const handleDelete = async () => {
    const { error } = await deleteSpreadsheet(confirmState.id, user.id);
    if (error) {
      toast('Failed to delete: ' + error.message, 'error');
    } else {
      toast('Spreadsheet deleted', 'success');
      refreshList();
    }
    setConfirmState({ show: false, id: null, name: '' });
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!renameState.name.trim()) return;

    const { error } = await renameSpreadsheet(renameState.id, renameState.name);
    if (error) {
      toast('Failed to rename: ' + error.message, 'error');
    } else {
      toast('Spreadsheet renamed', 'success');
      refreshList();
    }
    setRenameState({ show: false, id: null, name: '' });
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
        + Create Spreadsheet
      </button>
      <div className="spreadsheet-cards">
        {filtered.length === 0 && spreadsheets.length === 0 && (
          <div className="empty-state">
            <p>No spreadsheets yet</p>
            <p>Create your first spreadsheet to get started!</p>
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
                className="card-action-btn"
                title="Rename"
                onClick={(e) => { e.stopPropagation(); setRenameState({ show: true, id: item.spreadsheet_id, name: item.spreadsheets.name }); }}
              >
                &#9998;
              </button>
              <button
                className="card-action-btn card-action-delete"
                title="Delete"
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
            <div className="modal-content-label">Spreadsheet Name:</div>
            <input
              type="text"
              value={spreadsheetName}
              onChange={(e) => setSpreadsheetName(e.target.value)}
              placeholder="Enter spreadsheet name"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Create</button>
        </form>
      </Modal>

      <Modal show={renameState.show} onClose={() => setRenameState({ show: false, id: null, name: '' })}>
        <form onSubmit={handleRenameSubmit}>
          <div>
            <div className="modal-content-label">New Name:</div>
            <input
              type="text"
              value={renameState.name}
              onChange={(e) => setRenameState((s) => ({ ...s, name: e.target.value }))}
              placeholder="Enter new name"
              required
            />
          </div>
          <button type="submit">Rename</button>
        </form>
      </Modal>

      <ConfirmDialog
        show={confirmState.show}
        title="Delete Spreadsheet"
        message={`Are you sure you want to delete "${confirmState.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmState({ show: false, id: null, name: '' })}
      />
    </>
  );
};

export default MySpreadsheets;
