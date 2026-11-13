
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert("Please enter a valid email address", "warning");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/otp/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            purpose: "reset-password",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || "OTP sending failed", "error");
        return;
      }

      showAlert("Reset OTP sent successfully!", "success");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email,
            from: "forgot-password",
            purpose: "reset-password",
          },
        });
      }, 800);

    } catch (error) {
      console.error(error);
      showAlert("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        <Link to="/" className="forgot-logo">
          iZone<span>.</span>
        </Link>

        <h2>Forgot Password?</h2>

        <p>
          Enter your registered email address. We will send you
          a verification code to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">
            Send Reset Code
          </button>
        </form>

        <Link to="/login" className="forgot-back">
          Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ForgotPassword;
