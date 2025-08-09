import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand fw-bold text-primary" href="#home">
          Fixora
        </a>

        {/* Hamburger Toggle for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links (collapsed on mobile, shown inline on desktop) */}
        <div className="navbar-collapse" id="navbarNav">

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#home">
                Home
              </a>
            </li>

            {/* Services Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#services"
                id="servicesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
                <li><a className="dropdown-item" href="#plumber">Plumber</a></li>
                <li><a className="dropdown-item" href="#carpenter">Carpenter</a></li>
                <li><a className="dropdown-item" href="#electrician">Electrician</a></li>
                <li><a className="dropdown-item" href="#tvrepairing">TV Repairing</a></li>
                <li><a className="dropdown-item" href="#gardencleaner">Garden Cleaner</a></li>
                <li><a className="dropdown-item" href="#housekeeper">House Keeper</a></li>
              </ul>
            </li>

                <li className="nav-item">
              <a className="nav-link" href="#about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
