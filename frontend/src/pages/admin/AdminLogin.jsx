
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/admin/dashboard",{ replace: true });
    } catch (error) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-wrapper">

        <div className="admin-brand">
          <div className="admin-logo">iZ</div>
          <span className="admin-logo-dot"></span>
        </div>

        <div className="admin-login-card">

          <div className="admin-login-header">
            <h2>Admin Login</h2>
            <p>Sign in to access the central management console.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleLogin}>

            <div className="admin-input-group">
              <label>Admin Email</label>

              <div className="admin-input-box">
                <span className="admin-input-icon">✉</span>
                <input
                  type="email"
                  placeholder="admin@izone.store"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label>Password</label>

              <div className="admin-input-box">
                <span className="admin-input-icon">♙</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p className="admin-login-error">{error}</p>
            )}

            <button
              className="admin-login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Console →"}
            </button>

          </form>

        

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
