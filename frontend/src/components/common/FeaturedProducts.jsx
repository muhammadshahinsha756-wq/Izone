
import { Navigate, useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";

const products = [
  {
    id: 1,
    name: "iPhone 17 Pro",
    category: "iPhone",
    price: "₹1,34,900",
    image: "https://res.cloudinary.com/odcyxbt9/image/upload/v1794495282/IMG-18072189_m_jpeg_1.jpg"
  },
  {
    id: 2,
    name: "iphone 18 pro",
    category: "iphone",
    price: "₹99,900",
    image: "https://res.cloudinary.com/odcyxbt9/image/upload/v1794495282/Apple-iPhone-18-Pro-2up-260909-lp.jpg.news_app_ed.jpg",
  },
  {
    id: 3,
    name: "iPad Pro",
    category: "iPad",
    price: "₹99,900",
    image: "https://res.cloudinary.com/odcyxbt9/image/upload/v1794495281/iphone-17e-colors.png",
  },
  {
    id: 4,
    name: "Apple Watch",
    category: "Watch",
    price: "₹46,900",
    image: "https://res.cloudinary.com/odcyxbt9/image/upload/v1794495281/iphone-17e-colors.png",
  },
];

function FeaturedProducts() {
  return (
    <section className="featured-section">

      <div className="featured-heading">
        <p>OUR COLLECTION</p>
        <h2>Featured Products</h2>
        <span>Discover the latest Apple innovations.</span>
      </div>

      <div className="products-container">
        {products.map((product) => (
          <div className="product-card" key={product.id}>

            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-info">
              <span>{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button>View Product</button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}

export default FeaturedProducts;
