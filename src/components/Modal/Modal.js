import './Modal.css'; // We'll define some basic styles for the modal

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose(); // Close modal when clicked outside the modal box
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;