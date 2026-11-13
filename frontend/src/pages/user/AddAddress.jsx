
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./AddAddress.css";

function AddAddress() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedValue = type === "checkbox" ? checked : value;

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
        "http://localhost:5000/api/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            fullName: trimmedName,
            phone: trimmedPhone,
            addressLine: formData.addressLine.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add address");
      }

      navigate("/profile");
    } catch (error) {
      setError(error.message);
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
          <strong>Add Address</strong>
        </div>

        <div className="add-address-heading">
          <p>DELIVERY INFORMATION</p>
          <h1>Add New Address</h1>
          <span>Enter your delivery address details below.</span>
        </div>

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

          <label className="default-address-checkbox">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            Set as my default delivery address
          </label>

          {error && <p className="address-form-error">{error}</p>}

          <div className="add-address-actions">
            <Link to="/addresses" className="address-cancel-btn">
              Cancel
            </Link>

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}

export default AddAddress;
