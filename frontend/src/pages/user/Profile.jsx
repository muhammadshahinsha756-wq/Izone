
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./Profile.css";

function Profile() {
  const { showAlert } = useAlert();

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selecting, setSelecting] = useState("");
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message || "Failed to fetch profile"
          );
        }

        setUser(profileData.user || profileData);

        const addressResponse = await fetch(
          "http://localhost:5000/api/address",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const addressData = await addressResponse.json();

        if (!addressResponse.ok) {
          throw new Error(
            addressData.message || "Failed to fetch addresses"
          );
        }

        setAddresses(addressData.addresses || []);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("Please login to view your profile");
      setLoading(false);
    }
  }, [token]);

  // Select delivery address
  const handleSelectDelivery = async (addressId) => {
    try {
      setSelecting(addressId);

      const response = await fetch(
        `http://localhost:5000/api/address/${addressId}/select-delivery`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to select address"
        );
      }

      setAddresses((previousAddresses) =>
        previousAddresses.map((item) => ({
          ...item,
          selectedForDelivery: item._id === addressId,
        }))
      );

      showAlert(
        "Delivery address selected successfully!",
        "success"
      );

    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setSelecting("");
    }
  };

  // Upload profile image
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showAlert("Please select an image", "error");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size must be below 5MB", "error");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(
        "http://localhost:5000/api/auth/profile/upload-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Image upload failed"
        );
      }

      setUser((previousUser) => ({
        ...previousUser,
        profileImage: data.profileImage,
      }));

      showAlert(
        "Profile picture updated successfully!",
        "success"
      );

    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : "U";

  if (loading) {
    return <h3>Loading profile...</h3>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Navbar />

      <div className="profile-page">

        {/* Profile Header */}
        <div className="profile-header">

          <div className="profile-avatar-wrapper">

            <div className="profile-avatar">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="profile-avatar-image"
                />
              ) : (
                initial
              )}
            </div>

            <label className="change-photo">
              {uploading ? "Uploading..." : "Change Photo"}

              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                disabled={uploading}
                hidden
              />
            </label>

          </div>

          <div>
            <h2>{user?.name || user?.fullName}</h2>
            <p>{user?.email}</p>
          </div>

        </div>

        {/* Personal Information */}
        <section className="profile-section">

          <div className="section-heading">
            <h3>Personal Information</h3>

            <Link to="/edit-profile">
              Edit Profile
            </Link>
          </div>

          <div className="profile-info">

            <div>
              <span>Full Name</span>
              <p>
                {user?.name || user?.fullName || "Not added"}
              </p>
            </div>

            <div>
              <span>Email Address</span>
              <p>{user?.email || "Not added"}</p>
            </div>

            <div>
              <span>Phone Number</span>
              <p>{user?.phone || "Not added"}</p>
            </div>

          </div>

        </section>

        {/* Delivery Address */}
        <section className="profile-section">

          <div className="section-heading">

            <div>
              <h3>Delivery Address</h3>
              <p>
                Select the address where you want your order delivered.
              </p>
            </div>

            <Link to="/addresses">
              Manage Addresses
            </Link>

          </div>

          {addresses.length > 0 ? (

            <div className="profile-address-list">

              {addresses.map((item) => (

                <div
                  className={`profile-address-card ${
                    item.selectedForDelivery
                      ? "selected-address"
                      : ""
                  }`}
                  key={item._id}
                >

                  <div className="address-card-heading">

                    <h4>{item.fullName}</h4>

                    {item.selectedForDelivery && (
                      <span className="selected-badge">
                        Selected for delivery
                      </span>
                    )}

                  </div>

                  <p>{item.phone}</p>
                  <p>{item.addressLine}</p>

                  <p>
                    {item.city}, {item.state} - {item.pincode}
                  </p>

                  <label className="select-delivery-label">

                    <input
                      type="checkbox"
                      checked={Boolean(item.selectedForDelivery)}
                      disabled={selecting !== ""}
                      onChange={() =>
                        handleSelectDelivery(item._id)
                      }
                    />

                    {selecting === item._id
                      ? "Selecting..."
                      : "Deliver to this address"}

                  </label>

                </div>

              ))}

            </div>

          ) : (

            <div className="no-address">
              <p>
                You haven't added any delivery address yet.
              </p>

              <Link to="/add-address">
                + Add Address
              </Link>
            </div>

          )}

        </section>

        {/* Account Settings */}
        <section className="profile-section">

          <h3>Account Settings</h3>

          <div className="account-links">

            {!user?.googleId && (
              <>
                <Link to="/change-email">
                  Change Email Address
                </Link>

                <Link to="/change-password">
                  Change Password
                </Link>
              </>
            )}

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

        </section>

      </div>

      <Footer />
    </>
  );
}

export default Profile;
