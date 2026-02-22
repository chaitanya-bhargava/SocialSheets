import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-dismiss" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
