
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import "./SetNewPassword.css";

function SetNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const { email } = location.state || {};

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showAlert("Please fill all fields", "warning");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      showAlert(
        "Password must contain 8 characters, uppercase, lowercase, number and special character",
        "warning"
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || "Password reset failed", "error");
        return;
      }

      showAlert("Password reset successful!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (error) {
      console.error("Password Reset Error:", error);
      showAlert("Something went wrong", "error");
    }
  };

  return (
    <div className="new-password-page">
      <div className="new-password-card">

        <Link to="/" className="new-password-logo">
          iZone<span>.</span>
        </Link>

        <h2>Set New Password</h2>

        <p>Create a new password for your account.</p>

        <form onSubmit={handleSubmit}>

          <label>New Password</label>

          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="new-password-btn">
            Reset Password
          </button>

        </form>

        <Link to="/login" className="new-password-back">
          Back to Login
        </Link>

      </div>
    </div>
  );
}

export default SetNewPassword;
