
import React, { useEffect, useState } from "react";
import "./UserManagement.css";
import ConfirmModal from "../../components/common/ConfirmModal";
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBlockModal, setShowBlockModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:5000/api/admin/users?page=${page}&limit=5&search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // Block / Unblock user
 

const handleBlockToggle = (user) => {
  setSelectedUser(user);
  setShowBlockModal(true);
};

const confirmBlockToggle = async () => {
  if (!selectedUser) return;

  try {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(
      `http://localhost:5000/api/admin/users/${selectedUser._id}/block`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Failed to update user status");
      return;
    }

    setShowBlockModal(false);
    setSelectedUser(null);
    fetchUsers();

  } catch (error) {
    setError("Something went wrong");
  }
};

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div>
          <h2>User Management</h2>
          <p>Manage all registered users</p>
        </div>

        <span>Total Users: {pagination.totalUsers || 0}</span>
      </div>

     
<div className="user-search">
  <input
    type="text"
    placeholder="Search name, email or phone..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(1);
    }}
  />

  {search && (
    <button
      type="button"
      className="search-clear-btn"
      onClick={() => {
        setSearch("");
        setPage(1);
      }}
    >
      ×
    </button>
  )}
</div>


      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="user-error">{error}</p>
      ) : (
        <>
          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || "N/A"}</td>

                      <td>
                        <span
                          className={
                            user.isBlocked
                              ? "user-status blocked"
                              : "user-status active"
                          }
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        <button
                          type="button"
                          className={
                            user.isBlocked ? "unblock-btn" : "block-btn"
                          }
                          onClick={() => handleBlockToggle(user)}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <ConfirmModal
  isOpen={showBlockModal}
  title={selectedUser?.isBlocked ? "Unblock User" : "Block User"}
  message={
    selectedUser?.isBlocked
      ? "Are you sure you want to unblock this user?"
      : "Are you sure you want to block this user?"
  }
  confirmText={selectedUser?.isBlocked ? "Yes, Unblock" : "Yes, Block"}
  cancelText="Cancel"
  danger={!selectedUser?.isBlocked}
  onConfirm={confirmBlockToggle}
  onCancel={() => {
    setShowBlockModal(false);
    setSelectedUser(null);
  }}
/>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="user-pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.currentPage || 1} of{" "}
              {pagination.totalPages || 0}
            </span>

            <button
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserManagement;
