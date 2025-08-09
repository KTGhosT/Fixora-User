import React from "react";
import { Link } from 'react-router-dom';
import bg from "../../assets/user/bg.jpg"; // Update path as needed

const Home = () => {
  return (
    <>
      <header
        className="text-white text-center d-flex align-items-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80vh",
        }}
      >
        <div className="container">
          <h1 className="display-4 text-white fw-bold" data-aos="fade-down">
            Welcome to Fixora
          </h1>

          <p className="lead" data-aos="fade-up" data-aos-delay="300">
            Your one-stop solution for home services – plumber, electrician, and more.
          </p>

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-3 mt-3">
            <a
              href="#services"
              className="btn btn-primary"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              View Services
            </a>

            <a
              href="#about"
              className="btn btn-outline-light"
              data-aos="zoom-in"
              data-aos-delay="700"
            >
              Learn More
            </a>
          </div>
        </div>
      </header>
      <div className="text-center mt-5">
          <Link to="/register" className="btn btn-success" style={{ marginTop: '-20px' }}>Register as Worker</Link>
      </div>
    </>
  );
};

export default Home;