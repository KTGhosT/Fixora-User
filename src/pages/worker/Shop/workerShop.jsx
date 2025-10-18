// Home.jsx
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* ================= HERO CAROUSEL ================= */}
      <div
        id="homeCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >
        <div className="carousel-inner">

          {/* Plumber */}
          <div className="carousel-item active">
            <div className="carousel-overlay"></div>
            <img
              src="src/assets/images/PPA img/plumper/pl01.png"
              className="d-block w-100 carousel-img"
              alt="Plumber"
            />
            <div className="carousel-caption text-center">
              <h2>Plumber Collection</h2>
              <p>Flexible, durable, and ready for every challenge.</p>
            </div>
          </div>

          {/* All Workers */}
          <div className="carousel-item">
            <div className="carousel-overlay"></div>
            <img
              src="src/assets/images/All/all.png"
              className="d-block w-100 carousel-img"
              alt="All Workers"
            />
            <div className="carousel-caption text-center">
              <h2>Collections for Every Worker</h2>
              <p>Designed for pride, purpose, and performance.</p>
            </div>
          </div>

          {/* Gardener */}
          <div className="carousel-item">
            <div className="carousel-overlay"></div>
            <img
              src="src/assets/images/PPA img/garden/gd01.png"
              className="d-block w-100 carousel-img"
              alt="Gardener"
            />
            <div className="carousel-caption text-center">
              <h2>Gardener Collection</h2>
              <p>Breathe easy and move freely with every task.</p>
            </div>
          </div>

          {/* Carpenter */}
          <div className="carousel-item">
            <div className="carousel-overlay"></div>
            <img
              src="src/assets/images/PPA img/Carpenter/cp1.png"
              className="d-block w-100 carousel-img"
              alt="Carpenter"
            />
            <div className="carousel-caption text-center">
              <h2>Carpenter Uniforms</h2>
              <p>Crafted for endurance, precision, and pride.</p>
            </div>
          </div>

          {/* Electrician */}
          <div className="carousel-item">
            <div className="carousel-overlay"></div>
            <img
              src="src/assets/images/PPA img/electrician/el01.png"
              className="d-block w-100 carousel-img"
              alt="Electrician"
            />
            <div className="carousel-caption text-center">
              <h2>Electrician Gear</h2>
              <p>Protective, smart, and made for experts.</p>
            </div>
          </div>

          {/* Housekeeping */}
          <div className="carousel-item">
            <div className="carousel-overlay"></div>
            <img
              src="src/assets/images/PPA img/housekeeping/hp01.png"
              className="d-block w-100 carousel-img"
              alt="Housekeeping"
            />
            <div className="carousel-caption text-center">
              <h2>Housekeeping Attire</h2>
              <p>Elegance and efficiency in every uniform.</p>
            </div>
          </div>

          {/* Device Repair */}
          <div className="carousel-item">
            <div className="carousel-overlay"></div>
            <img
              src="src/assets/images/PPA img/device/de01.png"
              className="d-block w-100 carousel-img"
              alt="Device Repair"
            />
            <div className="carousel-caption text-center">
              <h2>Device Repair Outfits</h2>
              <p>Modern looks for modern problem-solvers.</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      {/* ================= INTRO SECTION ================= */}
      <section className="intro-section py-5 text-center">
        <div className="container intro-wrapper">
          <h1 className="intro-title">
            Welcome to <span className="brand-name">FIXORA</span>
          </h1>
          <p className="intro-text mt-3">
            The home of professional workwear — built for comfort, confidence, and class.
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
                <p>Premium materials built to last, wear after wear.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="highlight-card p-4">
                <i className="bi bi-truck icon mb-3"></i>
                <h4>Fast Delivery</h4>
                <p>Quick, reliable shipping — straight to your door.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-12">
              <div className="highlight-card p-4">
                <i className="bi bi-people icon mb-3"></i>
                <h4>Trusted by Professionals</h4>
                <p>Worn by experts. Designed by Fixora.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
