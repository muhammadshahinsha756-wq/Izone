
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./ChangeEmail.css";

function ChangeEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();

    const [email, setEmail] = useState(
        location.state?.newEmail || ""
    );
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const sendOTP = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/send-email-change-otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(data.message || "Failed to send OTP", "error");
                return;
            }

            setOtpSent(true);
            showAlert("OTP sent to your new email", "success");

        } catch (error) {
            showAlert("Failed to send OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/verify-email-change-otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ email, otp })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(data.message || "OTP verification failed", "error");
                return;
            }

            setVerified(true);
            showAlert("Email verified successfully", "success");

        } catch (error) {
            showAlert("OTP verification failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const updateEmail = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/change-email",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(data.message || "Email update failed", "error");
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("email", data.user.email);

            showAlert("Email updated successfully!", "success");
            navigate("/profile")

        } catch (error) {
            showAlert("Email update failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="change-email-container">
                <div className="change-email-card">
                    <p className="change-email-label">
                        ACCOUNT SECURITY
                    </p>

                    <h1>Change Email Address</h1>

                    <p className="change-email-description">
                        Verify your new email address to update
                        your iZone account.
                    </p>

                    <label>NEW EMAIL ADDRESS</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent}
                        placeholder="Enter your new email"
                    />

                    {!otpSent && (
                        <button
                            onClick={sendOTP}
                            disabled={loading || !email.trim()}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    )}

                    {otpSent && !verified && (
                        <>
                            <label>ENTER OTP</label>

                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                            />

                            <button
                                onClick={verifyOTP}
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </>
                    )}

                    {verified && (
                        <button
                            onClick={updateEmail}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Email"}
                        </button>
                    )}

                    <button
                        className="change-email-cancel"
                        onClick={() => navigate("/edit-profile")}
                    >
                        Cancel
                    </button>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default ChangeEmail;
