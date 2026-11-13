
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          const user = data.user || data;

          setName(user.name || "");
          setPhone(user.phone || "");
          setEmail(user.email || "");
          setNewEmail(user.email || "");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      showAlert("Please enter your name and phone number", "warning");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      showAlert("Enter a valid 10-digit phone number", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name, phone }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || "Profile update failed", "error");
        return;
      }

      showAlert("Profile updated successfully!", "success");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = () => {
    if (!newEmail.trim() || newEmail.trim() === email) {
      showAlert("Enter a different email address", "warning");
      return;
    }

    navigate("/change-email", {
      state: {
        currentEmail: email,
        newEmail: newEmail.trim(),
      },
    });
  };

  return (
    <>
      <Navbar />

      <main className="edit-profile-container">
        <div className="edit-profile-breadcrumb">
          <span onClick={() => navigate("/home")}>Home</span>
          <span>/</span>
          <span onClick={() => navigate("/profile")}>My Profile</span>
          <span>/</span>
          <strong>Edit Profile</strong>
        </div>

        <div className="edit-profile-heading">
          <p>ACCOUNT SETTINGS</p>
          <h1>Edit Profile</h1>
          <span>Update your personal information.</span>
        </div>

        <form className="edit-profile-card" onSubmit={handleSave}>
          <div className="edit-field">
            <label>FULL NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="edit-field">
            <label>PHONE NUMBER</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              maxLength={10}
              required
            />
          </div>

          <div className="edit-field">
            <label>EMAIL ADDRESS</label>

            <div className="email-display">
              <input type="email" value={email} readOnly />

              <button
                type="button"
                onClick={() => setShowEmailEdit(!showEmailEdit)}
              >
                Change
              </button>
            </div>

            {showEmailEdit && (
              <div className="new-email-box">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                />

                <button type="button" onClick={handleEmailChange}>
                  Verify Email
                </button>
              </div>
            )}

            <small>Email change requires OTP verification.</small>
          </div>

          <div className="edit-profile-actions">
            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}

export default EditProfile;
