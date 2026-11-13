
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
  console.log("Signup button clicked!");
    if (
      !name.trim() ||
      !email.trim() ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      showAlert("Please fill all fields", "warning");
      return;
    }

    // Phone must contain exactly 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      showAlert("Phone number must contain exactly 10 digits", "warning");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      showAlert(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
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
        "http://localhost:5000/api/otp/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            purpose: "signup",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || "OTP sending failed", "error");
        return;
      }

      localStorage.setItem("signupEmail", email.trim());

      showAlert("OTP sent successfully!", "success");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            name: name.trim(),
            email: email.trim(),
            phone,
            password,
            from: "signup",
            purpose: "signup",
          },
        });
      }, 800);
    } catch (error) {
      console.log("OTP Error:", error);
      showAlert("Something went wrong", "error");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <Link to="/" className="signup-logo">
          iZone<span>.</span>
        </Link>

        <h2>Create Account</h2>

        <p className="signup-subtitle">
          Join iZone and explore the Apple experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="signup-input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
               maxLength={20}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="signup-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="signup-input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
          </div>

          <div className="signup-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              maxLength={20}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="signup-input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
               maxLength={20}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="signup-submit-btn">
            Create Account
          </button>
        </form>

        <p className="signup-login">
          Already have an account?
          <Link to="/login"> Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;