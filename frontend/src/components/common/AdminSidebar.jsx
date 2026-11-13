
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

import { LayoutDashboard,Users,ShoppingBag,Package,UserRound, ChartNoAxesColumnIncreasing,Ticket,Tags,Gift,Star,LogOut,} from "lucide-react";

import "./AdminSidebar.css";

function AdminSidebar({ activeMenu, setActiveMenu }) {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "User Management", icon: Users },
    { name: "Orders", icon: ShoppingBag },
    { name: "Products", icon: Package },
    { name: "Customers", icon: UserRound },
    { name: "Sales Report", icon: ChartNoAxesColumnIncreasing },
    { name: "Coupons", icon: Ticket },
    { name: "Categories", icon: Tags },
    { name: "Offers", icon: Gift },
    { name: "Referrals", icon: Star },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login", { replace: true });
  };

 
return (
  <>
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-brand-logo">iZ</div>
        <span>iZone</span>
      </div>

      <div className="admin-sidebar-heading">
        MAIN MENU
      </div>

      <nav className="admin-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              type="button"
              className={
                activeMenu === item.name
                  ? "admin-menu-item active"
                  : "admin-menu-item"
              }
              onClick={() => setActiveMenu(item.name)}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="admin-logout"
      onClick={() => {
  console.log("Logout clicked");
  setShowLogoutModal(true);
  console.log("Modal state should be true");
}}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </aside>

    <ConfirmModal
      isOpen={showLogoutModal}
      title="Logout"
      message="Are you sure you want to logout?"
      confirmText="Yes, Logout"
      cancelText="Cancel"
      danger={true}
      onConfirm={handleLogout}
      onCancel={() => setShowLogoutModal(false)}
    />
  </>
);
}

export default AdminSidebar;
