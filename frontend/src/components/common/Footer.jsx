
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">
          <h2>iZone<span>.</span></h2>
          <p>
            Your trusted destination for genuine Apple products,
            expert guidance and exceptional customer service.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>

        <div className="footer-links">
          <h3>Our Products</h3>
          <a href="#iphone">iPhone</a>
          <a href="#mac">MacBook</a>
          <a href="#ipad">iPad</a>
          <a href="#watch">Apple Watch</a>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@izone.com</p>
          <p>Phone: +91 9746346754</p>
          <p>Kerala, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 iZone. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
