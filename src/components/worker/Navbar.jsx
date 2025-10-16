import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartCount }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 px-4">
      <div className="container-fluid">
        {/* Brand Name */}
        <Link className="navbar-brand fw-bold text-warning fs-4" to="/">
          Fixora
        </Link>

        {/* Toggle button for mobile */}
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

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>

            {/* Dropdown Menu */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="collectionDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Collections
              </Link>
              <ul className="dropdown-menu" aria-labelledby="collectionDropdown">
                <li>
                  <Link className="dropdown-item" to="/dress">Dress Collection</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/accessories">Accessories</Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Cart Button */}
          <Link to="/cart" className="btn btn-warning cart-btn">
            <i className="bi bi-cart-fill me-1"></i> Cart ({cartCount})
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
