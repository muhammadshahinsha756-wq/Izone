
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/common/AdminSidebar";
import UserManagement from "./UserManagement";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");
          navigate("/admin/login", { replace: true });
        }
      } catch (error) {
        console.error("Admin verification failed:", error);

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  const renderContent = () => {
    if (activeMenu === "User Management") {
      return <UserManagement />;
    }

    return (
      <div className="coming-soon">
        <h2>{activeMenu}</h2>
        <p>Coming Soon...</p>
      </div>
    );
  };

  if (loading) {
    return <h3>Loading Admin Dashboard...</h3>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="admin-main">
        <header className="admin-header">
          <h2>{activeMenu}</h2>
        </header>

        <section className="admin-content">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
