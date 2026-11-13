
import { Link } from "react-router-dom";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="hero-tag">AUTHORIZED APPLE SPECIALIST</p>

        <h1>
          Experience the
          <span> Apple Difference.</span>
        </h1>

        <p className="hero-description">
          Discover the latest Apple products with trusted service,
          expert guidance and an exceptional shopping experience.
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="hero-primary-btn">
            Shop Now
          </Link>

          <Link to="/signup" className="hero-secondary-btn">
            Explore More
          </Link>
        </div>
      </div>

    
     <div className="hero-visual">
        <img src="https://shop.unicornstore.in/_next/image?url=https%3A%2F%2Fcdn.unicornstore.app%2Fshops%2F6a6b06c869c138bf4512c090%2Fcatalog%2Fuploads%2Fiphone_18_pro_max_burgundy_pdp_image_position_1__en-in-7144c11b.jpg&w=1200&q=75" alt="iphone" className="hero-image"/>

     </div>
    
    </section>
  );
}

export default HeroSection;
