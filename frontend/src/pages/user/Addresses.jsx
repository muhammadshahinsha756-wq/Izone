
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./Addresses.css";

function Addresses() {
  const { showAlert, confirmAlert } = useAlert();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/address",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load addresses"
          );
        }

        setAddresses(data.addresses || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Delete address with custom confirmation
  const handleDelete = async (addressId) => {
    const confirmed = await confirmAlert(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(addressId);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete address"
        );
      }

      setAddresses((prevAddresses) =>
        prevAddresses.filter(
          (item) => item._id !== addressId
        )
      );

      showAlert("Address deleted successfully!", "success");

    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="addresses-container">
        <div className="addresses-breadcrumb">
          <Link to="/home">Home</Link>
          <span>/</span>
          <Link to="/profile">My Profile</Link>
          <span>/</span>
          <strong>Saved Addresses</strong>
        </div>

        <div className="addresses-header">
          <div>
            <p>YOUR IZONE ACCOUNT</p>
            <h1>Saved Addresses</h1>
            <span>Manage your delivery locations.</span>
          </div>

          <Link
            to="/add-address"
            className="add-address-btn"
          >
            + Add New Address
          </Link>
        </div>

        {loading ? (
          <p className="addresses-message">
            Loading addresses...
          </p>
        ) : error ? (
          <p className="addresses-error">{error}</p>
        ) : addresses.length === 0 ? (
          <div className="addresses-empty">
            <div>⌖</div>
            <h2>No saved addresses yet</h2>
            <p>
              Add your first delivery address to get started.
            </p>

            <Link
              to="/add-address"
              className="add-address-btn"
            >
              Add New Address
            </Link>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((item) => (
              <div className="address-card" key={item._id}>
                {item.selectedForDelivery && (
                  <span className="default-address-label">
                    Selected for Delivery
                  </span>
                )}

                <h3>{item.fullName}</h3>

                <p>{item.phone}</p>

                <p>{item.addressLine}</p>

                <p>
                  {item.city}, {item.state} - {item.pincode}
                </p>

                <div className="address-actions">
                  <Link to={`/edit-address/${item._id}`}>
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                  >
                    {deletingId === item._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Addresses;
