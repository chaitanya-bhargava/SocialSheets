import React, { useState, useEffect, useRef, useCallback } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  getSpreadsheetCells,
  updateSpreadsheetCells,
  subscribeToSpreadsheet,
  unsubscribeFromSpreadsheet,
  createPresenceChannel,
  subscribePresence,
  leavePresence,
} from '../../services/spreadsheetService';
import { useToast } from '../Toast/ToastContext';
import './CustomSpreadsheet.css';

const DEBOUNCE_MS = 500;

const PRESENCE_COLORS = [
  '#f97316', '#8b5cf6', '#ec4899', '#14b8a6',
  '#f43f5e', '#6366f1', '#22c55e', '#eab308',
];

const getInitials = (email) => {
  if (!email) return '?';
  if (email.startsWith('guest_')) return 'G';
  return email.substring(0, 2).toUpperCase();
};

const getColor = (userId) => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PRESENCE_COLORS[Math.abs(hash) % PRESENCE_COLORS.length];
};

const exportToCsv = (cells, filename) => {
  const csvRows = cells.map((row) =>
    row.map((cell) => {
      const val = cell?.value ?? '';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const CustomSpreadsheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [cells, setCells] = useState([]);
  const [spreadsheetName, setSpreadsheetName] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeCell, setActiveCell] = useState({ value: null });
  const [activeCellCoords, setActiveCellCoords] = useState({ row: 0, column: 0 });
  const [presenceUsers, setPresenceUsers] = useState([]);
  const pendingUpdateRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const channelRef = useRef(null);
  const presenceRef = useRef(null);
  const toast = useToast();

  const flushToSupabase = useCallback(async (cellsToSave) => {
    if (!cellsToSave || cellsToSave.length === 0) return;
    const { error } = await updateSpreadsheetCells(id, cellsToSave);
    if (error) setError('Failed to save changes: ' + error.message);
  }, [id]);

  const scheduleSave = useCallback((cellsToSave) => {
    pendingUpdateRef.current = cellsToSave;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (pendingUpdateRef.current) {
        flushToSupabase(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }
    }, DEBOUNCE_MS);
  }, [flushToSupabase]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getSpreadsheetCells(id);

      if (error) {
        setError('Failed to load spreadsheet: ' + error.message);
        return;
      }
      if (!data || data.length === 0) {
        setError('Spreadsheet not found.');
        return;
      }
      setSpreadsheetName(data[0].name || 'Untitled');
      setActiveCell(data[0].cells.cells[0][0]);
      setCells(data[0].cells.cells);
    };

    fetchData();

    const channel = subscribeToSpreadsheet(id, (payload) => {
      if (payload.new.id === id) setCells(payload.new.cells.cells);
    });
    channelRef.current = channel;

    if (user) {
      const presence = createPresenceChannel(id, user);
      const { channel: presenceChannel } = presence;

      presenceChannel.on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat().map((p) => ({
          user_id: p.user_id,
          email: p.email,
        }));
        setPresenceUsers(users);
      });

      subscribePresence(presence);
      presenceRef.current = presenceChannel;
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        if (pendingUpdateRef.current) {
          flushToSupabase(pendingUpdateRef.current);
          pendingUpdateRef.current = null;
        }
      }
      if (channelRef.current) {
        unsubscribeFromSpreadsheet(channelRef.current);
        channelRef.current = null;
      }
      leavePresence(presenceRef.current);
      presenceRef.current = null;
    };
  }, [id, user, flushToSupabase]);

  const handleChanges = ({ row, column }) => {
    if (activeCell.value !== null) {
      setCells((prevCells) => {
        const updatedCells = prevCells.map((r) => [...r]);
        updatedCells[activeCellCoords.row][activeCellCoords.column] = activeCell;
        scheduleSave(updatedCells);
        return updatedCells;
      });
    }
    setActiveCell({ value: null });
    setActiveCellCoords({ row, column });
  };

  const handleKeyChanges = (event) => {
    const { key } = event;
    if (key.length === 1 || key === 'Enter' || key === 'Backspace') {
      setActiveCell({ value: event.target.value });
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      const inviteUrl = `${window.location.origin}/invite/${id}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast('Invite link copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Failed to copy link', 'error');
    }
  };

  const handleExport = () => {
    if (cells.length === 0) {
      toast('No data to export', 'warning');
      return;
    }
    exportToCsv(cells, spreadsheetName || 'spreadsheet');
    toast('Exported to CSV!', 'success');
  };

  const otherUsers = presenceUsers.filter((p) => p.user_id !== user?.id);

  return (
    <div className="spreadsheet-page">
      <div className="spreadsheet-toolbar">
        <div className="spreadsheet-toolbar-left">
          <button className="back-dashboard-button" onClick={() => navigate('/dashboard')}>
            &#8592; Back
          </button>
          <span className="spreadsheet-name">{spreadsheetName}</span>
          {otherUsers.length > 0 && (
            <>
              <div className="toolbar-separator" />
              <div className="presence-bar">
                {otherUsers.map((p) => (
                  <div
                    key={p.user_id}
                    className="presence-dot"
                    style={{ background: getColor(p.user_id) }}
                    title={p.email?.startsWith('guest_') ? 'Guest' : p.email}
                  >
                    {getInitials(p.email)}
                  </div>
                ))}
                <span className="presence-label">
                  {otherUsers.length} other{otherUsers.length > 1 ? 's' : ''} online
                </span>
              </div>
            </>
          )}
        </div>
        <div className="spreadsheet-toolbar-right">
          <button className="export-csv-button" onClick={handleExport}>
            Export CSV
          </button>
          <div className="toolbar-separator" />
          <button
            className={`export-csv-button ${copied ? 'copy-success' : ''}`}
            onClick={handleCopyInviteLink}
            title="Copy invite link to share with collaborators"
          >
            {copied ? 'Link Copied!' : 'Share Invite Link'}
          </button>
        </div>
      </div>
      {error && <p className="spreadsheet-error">{error}</p>}
      <div className="spreadsheet-container">
        <Spreadsheet data={cells} onActivate={handleChanges} onKeyDown={handleKeyChanges} />
      </div>
    </div>
  );
};

export default CustomSpreadsheet;
