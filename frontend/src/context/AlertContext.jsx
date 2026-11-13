
import { createContext, useContext, useRef, useState } from "react";
import "./AlertContext.css";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const confirmResolver = useRef(null);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  // Custom confirmation popup
  const confirmAlert = (message) => {
    return new Promise((resolve) => {
      confirmResolver.current = resolve;
      setConfirmation(message);
    });
  };

  const handleConfirmation = (result) => {
    if (confirmResolver.current) {
      confirmResolver.current(result);
      confirmResolver.current = null;
    }

    setConfirmation(null);
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, confirmAlert }}>
      {children}

      {/* Custom Alert */}
      {alert && (
        <div className={`app-alert ${alert.type}`}>
          <div className="app-alert-content">
            <span className="app-alert-icon">
              {alert.type === "success" && "✓"}
              {alert.type === "error" && "✕"}
              {alert.type === "warning" && "!"}
              {alert.type === "info" && "i"}
            </span>

            <p>{alert.message}</p>
          </div>

          <button onClick={closeAlert}>×</button>
        </div>
      )}

      {/* Custom Confirmation Popup */}
      {confirmation && (
        <div className="confirmation-overlay">
          <div
            className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
          >
            <div className="confirmation-icon">!</div>

            <h2 id="confirmation-title">Are you sure?</h2>

            <p>{confirmation}</p>

            <div className="confirmation-actions">
              <button
                type="button"
                className="confirmation-cancel"
                onClick={() => handleConfirmation(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirmation-delete"
                onClick={() => handleConfirmation(true)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
