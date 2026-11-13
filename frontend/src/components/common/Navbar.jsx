
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import { useAlert } from "../../context/AlertContext";
function Navbar() {
  const { confirmAlert } = useAlert();
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const navigate = useNavigate();
  const location = useLocation();



  useEffect(() => {
  const checkLogin = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  };

  checkLogin();

  window.addEventListener("authChange", checkLogin);

  return () => {
    window.removeEventListener("authChange", checkLogin);
  };
}, [location.pathname]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user.email || localStorage.getItem("email") || "";
const handleSignOut = async () => {
  const confirmed = await confirmAlert(
    "Are you sure you want to sign out?"
  );

  if (!confirmed) return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("email");

  setIsLoggedIn(false);
  setShowProfile(false);

  window.dispatchEvent(new Event("authChange"));

  navigate("/login");
};

  return (
    <nav className="navbar">

      <Link to="/home" className="logo">
        iZone
      </Link>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/iphone">iPhone</Link>
        <Link to="/mac">Mac</Link>
        <Link to="/ipad">iPad</Link>
        <Link to="/apple-watch">Apple Watch</Link>
        <Link to="/airpods">AirPods</Link>
        <Link to="/accessories">Accessories</Link>
        <Link to="/deals">Deals</Link>
      </div>

      <div className="nav-icons">

        <Link to="/cart" className="cart-icon">
          🛍️
          <span className="cart-count">2</span>
        </Link>

        {!isLoggedIn ? (
          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>
        ) : (
          <div className="profile-wrapper">

            <button
              className="profile-icon"
              onClick={() => setShowProfile(!showProfile)}
            >
              👤
            </button>

            {showProfile && (
              <div className="profile-popup">

                <div className="profile-popup-header">
                  <h3>{email}</h3>
                  <span>IZONE MEMBER</span>
                </div>

                <div className="profile-menu-section">
                  <p>Personal</p>

                  <Link to="/profile" onClick={() => setShowProfile(false)}>
                    👤 My Profile
                  </Link>
                  <small>Personal details & saved addresses</small>
                </div>

                <div className="profile-menu-section">

                  <Link to="/orders" onClick={() => setShowProfile(false)}>
                    📦 My Orders
                  </Link>
                  <small>1 Active · Track shipments & invoices</small>

                  <Link to="/wishlist" onClick={() => setShowProfile(false)}>
                    ♡ My Wishlist
                  </Link>
                  <small>2 saved Apple items</small>

                  <Link to="/wallet" onClick={() => setShowProfile(false)}>
                    💳 My Wallet
                  </Link>
                  <small>₹1,250 Cashback Credit</small>

                  <Link to="/refer" onClick={() => setShowProfile(false)}>
                    🎁 Refer & Earn
                  </Link>
                  <small>Give ₹1,000, get ₹1,000 credit</small>

                  <Link to="/support" onClick={() => setShowProfile(false)}>
                    🎧 Support
                  </Link>
                  <small>24/7 Specialist AppleCare+ desk</small>

                </div>

                <button
                  className="profile-signout"
                  onClick={handleSignOut}
                >
                  ↪ Sign Out
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
