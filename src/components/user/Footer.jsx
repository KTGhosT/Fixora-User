import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <footer
      className="text-light py-4 mt-5"
      style={{
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div className="container text-center">
        <p className="mb-2">
          &copy; {year} Fixora. All rights reserved.
        </p>

        <div>
          <a href="#home" className="text-light text-decoration-none me-3">
            Home
          </a>
          <a href="#services" className="text-light text-decoration-none me-3">
            Services
          </a>
          <a href="#about" className="text-light text-decoration-none me-3">
            About
          </a>
          <a href="#contact" className="text-light text-decoration-none">
            Contact
          </a>
        </div>

        <small className="d-block mt-3">
          Current Time: <span className="fw-bold">{currentTime}</span>
        </small>

        <small className="d-block mt-2">
          Designed with <span style={{ color: "#e25555" }}>❤️</span> by Fixora Team
        </small>
      </div>
    </footer>
  );
};

export default Footer;
