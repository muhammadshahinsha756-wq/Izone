
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./ChangePassword.css";

function ChangePassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/auth/change-password",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Password change failed");
            }

            setMessage(data.message);

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                navigate("/profile");
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="change-password-page">
                <div className="change-password-card">

                    <Link to="/profile" className="back-link">
                        ← Back to Profile
                    </Link>

                    <h2>Change Password</h2>

                    <p className="password-subtitle">
                        Keep your account secure with a strong password.
                    </p>

                    {message && (
                        <div className="password-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="password-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="password-field">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                required
                            />
                        </div>

                        <div className="password-field">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                                minLength="8"
                            />
                        </div>

                        <div className="password-field">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <p className="password-hint">
                            Minimum 8 characters, including uppercase,
                            lowercase, number and special character.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default ChangePassword;
