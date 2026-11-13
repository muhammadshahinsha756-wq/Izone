
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { useAlert } from "../../context/AlertContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowpass] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: credentialResponse.credential
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message, "error");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("email", data.user.email);

      window.dispatchEvent(new Event("authChange"));

      navigate("/home", { replace: true });

    } catch (error) {
      console.log("Google login error:", error);
      showAlert("Something went wrong", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showAlert("Please enter email and password", "warning");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message, "error");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("email", data.user.email);

     window.dispatchEvent(new Event("authChange"));

showAlert("Login Successful!", "success");

setTimeout(() => {
  navigate("/home", { replace: true });
}, 800);

    } catch (error) {
      console.log("Login Error:", error);
      showAlert("Something went wrong", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <Link to="/" className="login-logo">
          iZone<span>.</span>
        </Link>

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to continue your iZone experience.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="login-input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowpass(!showPass)}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="login-options">

            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button type="submit" className="login-submit-btn">
            Sign In
          </button>

        </form>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              showAlert("Google Login Failed", "error");
            }}
          />
        </div>

        <p className="login-register">
          Don't have an account?
          <Link to="/signup"> Create Account</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
