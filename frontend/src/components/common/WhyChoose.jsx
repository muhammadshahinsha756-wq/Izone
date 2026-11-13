
import "./WhyChoose.css";

function WhyChoose() {
  const features = [
    {
      icon: "✓",
      title: "Authorized Apple Specialist",
      description: "Shop genuine Apple products with confidence."
    },
    {
      icon: "♧",
      title: "Trusted Quality",
      description: "Enjoy authentic products and reliable service."
    },
    {
      icon: "↗",
      title: "Expert Support",
      description: "Get guidance from our experienced team."
    },
    {
      icon: "♡",
      title: "Customer First",
      description: "We make your shopping experience simple."
    }
  ];

  return (
    <section className="why-section">

      <div className="why-heading">
        <p>WHY CHOOSE US</p>
        <h2>Why Choose iZone?</h2>
        <span>
          More than a store. Your trusted Apple shopping partner.
        </span>
      </div>

      <div className="features-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default WhyChoose;
