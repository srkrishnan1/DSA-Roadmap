const Modal = ({ show, onClose, title, children, footer }) => {
  return (
    <div
      className={show ? "ModalOpen modaloverlay" : "ModalClosed modaloverlay"}
      onClick={onClose}
    >
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <header className="modalHeader">{title}</header>
        <div className="modalBody">{children}</div>
        <div className="modalFooter">{footer}</div>
      </div>
    </div>
  );
};

export default Modal;
