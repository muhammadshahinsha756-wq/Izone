import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./AddAddress.css";

function EditAddress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/address/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load address details");
        }

        if (data.address) {
          setFormData({
            fullName: data.address.fullName || "",
            phone: data.address.phone || "",
            addressLine: data.address.addressLine || "",
            city: data.address.city || "",
            state: data.address.state || "",
            pincode: data.address.pincode || "",
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      fetchAddress();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "fullName") {
      updatedValue = value.slice(0, 15);
    }

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "pincode") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = formData.fullName.trim();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedName) {
      setError("Full name cannot be empty");
      return;
    }

    if (trimmedName.length > 15) {
      setError("Name must not exceed 15 characters");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    if (!formData.addressLine.trim()) {
      setError("Please enter your street address");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter your city");
      return;
    }

    if (!formData.state.trim()) {
      setError("Please enter your state");
      return;
    }

    if (!/^[1-9]\d{5}$/.test(formData.pincode)) {
      setError("Enter a valid 6-digit PIN code");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/address/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: trimmedName,
            phone: trimmedPhone,
            addressLine: formData.addressLine.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update address");
      }

      showAlert("Address updated successfully!", "success");
      navigate("/addresses");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="add-address-container">
        <div className="add-address-breadcrumb">
          <Link to="/home">Home</Link>
          <span>/</span>
          <Link to="/profile">My Profile</Link>
          <span>/</span>
          <Link to="/addresses">Saved Addresses</Link>
          <span>/</span>
          <strong>Edit Address</strong>
        </div>

        <div className="add-address-heading">
          <p>DELIVERY INFORMATION</p>
          <h1>Edit Address</h1>
          <span>Update your delivery address details below.</span>
        </div>

        {pageLoading ? (
          <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
            Loading address details...
          </p>
        ) : (
          <form className="add-address-form" onSubmit={handleSubmit}>
            <div className="address-form-grid">
              <div className="address-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  maxLength={15}
                  required
                />
              </div>

              <div className="address-input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  maxLength={10}
                  required
                />
              </div>

              <div className="address-input-group full-width">
                <label>Street Address</label>
                <textarea
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  rows="3"
                  required
                />
              </div>

              <div className="address-input-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="address-input-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="address-input-group">
                <label>PIN Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            {error && <p className="address-form-error">{error}</p>}

            <div className="add-address-actions">
              <Link to="/addresses" className="address-cancel-btn">
                Cancel
              </Link>

              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Address"}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </>
  );
}

export default EditAddress;

