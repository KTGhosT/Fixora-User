// Home.jsx
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">

      {/* ================= HERO CAROUSEL ================= */}
      <div id="homeCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">

          {/* Plumber */}
          <div className="carousel-item active">
            <img
              src="https://d2bzx2vuetkzse.cloudfront.net/outfits/edefdbde-3700-4703-87ef-3df5ab6f6c5d.png"
              className="d-block w-100 carousel-img"
              alt="Plumber"
            />
            <div className="carousel-caption">
              <h2>Plumber Collection</h2>
              <p>Designed for flexibility and protection in every repair.</p>
            </div>
          </div>

          {/* All Workers */}
          <div className="carousel-item">
            <img
              src="src/assets/images/All/common.png"
              className="d-block w-100 carousel-img"
              alt="All Workers"
            />
            <div className="carousel-caption">
              <h2>Collections of Our Workers</h2>
              <p>Comfort and confidence for every profession.</p>
            </div>
          </div>

          {/* Gardener */}
          <div className="carousel-item">
            <img
              src="src/assets/images/Gardener/g1.png"
              className="d-block w-100 carousel-img"
              alt="Gardener"
            />
            <div className="carousel-caption">
              <h2>Gardener Collection</h2>
              <p>Lightweight comfort and practical design for outdoor tasks.</p>
            </div>
          </div>

          {/* Carpenter */}
          <div className="carousel-item">
            <img
              src="src/assets/images/Carpenter/c1.png"
              className="d-block w-100 carousel-img"
              alt="Carpenter"
            />
            <div className="carousel-caption">
              <h2>Carpenter Uniforms</h2>
              <p>Durable and stylish designs built for craftsmanship.</p>
            </div>
          </div>

          {/* Electrician */}
          <div className="carousel-item">
            <img
              src="src/assets/images/Electrician/e1.png"
              className="d-block w-100 carousel-img"
              alt="Electrician"
            />
            <div className="carousel-caption">
              <h2>Electrician Gear</h2>
              <p>Precision and protection—crafted for safety and skill.</p>
            </div>
          </div>

          {/* Housekeeping */}
          <div className="carousel-item">
            <img
              src="src/assets/images/Housekeeping/h1.png"
              className="d-block w-100 carousel-img"
              alt="Housekeeping"
            />
            <div className="carousel-caption">
              <h2>Housekeeping Attire</h2>
              <p>Elegant, easy-care uniforms for a professional appearance.</p>
            </div>
          </div>

          {/* Device Repair */}
          <div className="carousel-item">
            <img
              src="src/assets/images/DeviceRepair/d1.png"
              className="d-block w-100 carousel-img"
              alt="Device Repair"
            />
            <div className="carousel-caption">
              <h2>Device Repair Outfits</h2>
              <p>Smart, protective uniforms for modern technicians.</p>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      {/* ================= INTRO SECTION ================= */}
      <section className="intro-section py-5 text-center">
        <div className="container intro-wrapper">
          <h1 className="intro-title">
            Welcome to <span className="brand-name">Fixora</span>
          </h1>
          <p className="intro-text mt-3">
            Your one-stop destination for professional uniforms, accessories, and tools — 
            empowering every skilled hand with comfort, confidence, and quality.
          </p>
          <div className="intro-buttons mt-4">
            <Link to="/dresscollection" className="btn btn-primary me-3 px-4 py-2">
              Shop Dress Collection
            </Link>
            <Link to="/accessories" className="btn btn-outline-light px-4 py-2">
              Shop Accessories
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section className="highlights py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-lg-4 col-md-6">
              <div className="highlight-card p-4">
                <i className="bi bi-shield-check icon mb-3"></i>
                <h4>Quality Guaranteed</h4>
                <p>Crafted from premium materials for durability and comfort.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="highlight-card p-4">
                <i className="bi bi-truck icon mb-3"></i>
                <h4>Fast Delivery</h4>
                <p>Reliable service ensuring on-time delivery every time.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-12">
              <div className="highlight-card p-4">
                <i className="bi bi-people icon mb-3"></i>
                <h4>Trusted by Professionals</h4>
                <p>Fixora — the preferred choice of skilled experts worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
