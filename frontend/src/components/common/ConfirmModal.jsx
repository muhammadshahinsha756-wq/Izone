
import React from "react";
import "./ConfirmModal.css";

function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "Do you want to continue?",
  onConfirm,
  onCancel,
  confirmText = "Yes, Continue",
  cancelText = "Cancel",
  danger = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-icon">
          !
        </div>

        <h3>{title}</h3>
        <p>{message}</p>

        <div className="custom-modal-actions">
          <button
            className="modal-cancel-btn"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={
              danger
                ? "modal-confirm-btn danger"
                : "modal-confirm-btn"
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
