
import { useEffect, useState } from "react";
import "./ResetOTP.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";

function ResetOTP() {
  const location = useLocation();
  const { name, email, phone, password, from } = location.state || {};

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(30);

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showAlert("Please enter 6 digit OTP", "warning");
      return;
    }

    try {
      const otpResponse = await fetch(
        "http://localhost:5000/api/otp/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            otp,
            purpose: from === "signup" ? "signup" : "reset-password"
          })
        }
      );

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        showAlert(otpData.message || "Invalid OTP", "error");
        return;
      }

      // Forgot Password Flow
      if (from === "forgot-password") {
        showAlert("OTP verified successfully!", "success");

        setTimeout(() => {
          navigate("/set-new-password", {
            state: { email }
          });
        }, 800);

        return;
      }

      // Signup Registration Flow
      const registerResponse = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            password
          })
        }
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        showAlert(registerData.message || "Registration failed", "error");
        return;
      }

      showAlert("Registration successful!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (error) {
      console.log("Registration Error:", error);
      showAlert("Something went wrong", "error");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/otp/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            purpose: from === "signup" ? "signup" : "reset-password"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || "OTP resend failed", "error");
        return;
      }

      setOtp("");
      setSeconds(30);

      showAlert("New OTP sent successfully!", "success");

    } catch (error) {
      console.log("Resend OTP Error:", error);
      showAlert("Something went wrong", "error");
    }
  };

  return (
    <div className="reset-otp-page">
      <div className="reset-otp-card">

        <Link to="/" className="reset-otp-logo">
          iZone<span>.</span>
        </Link>

        <h2>Verify Reset Code</h2>

        <p>
          Enter the 6-digit verification code sent to your
          registered email address.
        </p>

        <form onSubmit={handleVerify}>
          <label>Verification Code</label>

          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
          />

          <button type="submit">
            Verify OTP
          </button>
        </form>

        <div className="reset-otp-resend">
          {seconds > 0 ? (
            <p>
              Resend OTP in 00:
              {String(seconds).padStart(2, "0")}
            </p>
          ) : (
            <button type="button" onClick={handleResend}>
              Resend OTP
            </button>
          )}
        </div>

        <Link
          to={from === "signup" ? "/signup" : "/forgot-password"}
          className="reset-otp-back"
        >
          Back
        </Link>

      </div>
    </div>
  );
}

export default ResetOTP;
