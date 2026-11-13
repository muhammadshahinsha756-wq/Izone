import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <div className="home-coming-soon">
        <h1>Coming Soon...</h1>
        <p>Something amazing is on the way!</p>
      </div>

      <Footer />
    </>
  );
}

export default Home;