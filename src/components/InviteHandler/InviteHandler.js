import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '../Toast/ToastContext';
import {
  getSpreadsheetById,
  linkUserToSpreadsheet,
} from '../../services/spreadsheetService';
import './InviteHandler.css';

const InviteHandler = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const toast = useToast();
  const [status, setStatus] = useState('loading');
  const [spreadsheetName, setSpreadsheetName] = useState('');

  useEffect(() => {
    const handleInvite = async () => {
      const { data, error } = await getSpreadsheetById(id);

      if (error || !data || data.length === 0) {
        setStatus('not_found');
        return;
      }

      setSpreadsheetName(data[0].name);

      const { error: joinError } = await linkUserToSpreadsheet(id, user.id, false);

      if (joinError) {
        if (joinError.message?.includes('duplicate') || joinError.code === '23505') {
          toast(`You already have access to "${data[0].name}"`, 'info');
          navigate(`/spreadsheet/${id}`);
          return;
        }
        setStatus('error');
        return;
      }

      toast(`Joined "${data[0].name}"!`, 'success');
      navigate(`/spreadsheet/${id}`);
    };

    handleInvite();
  }, [id, user, navigate, toast]);

  if (status === 'not_found') {
    return (
      <div className="invite-page">
        <h2>Invite not found</h2>
        <p>This spreadsheet doesn't exist or the link is invalid.</p>
        <button className="invite-home-btn" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="invite-page">
        <h2>Something went wrong</h2>
        <p>Couldn't join "{spreadsheetName}". Please try again.</p>
        <button className="invite-home-btn" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="invite-page">
      <div className="spinner" />
      <p>Joining spreadsheet...</p>
    </div>
  );
};

export default InviteHandler;
