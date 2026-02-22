import './ConfirmDialog.css';

const ConfirmDialog = ({ show, title, message, confirmLabel, onConfirm, onCancel, variant }) => {
  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'confirm-overlay') onCancel();
  };

  return (
    <div className="confirm-overlay" onClick={handleOverlayClick}>
      <div className="confirm-dialog">
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>Cancel</button>
          <button
            className={`confirm-btn confirm-${variant || 'danger'}`}
            onClick={onConfirm}
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
