import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHammer, 
  FaWrench, 
  FaBolt, 
  FaSeedling, 
  FaHome, 
  FaTools 
} from 'react-icons/fa';
import './HomeNavbar.css';

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleServicesDropdown = () => {
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };

  const services = [
    { name: 'Carpenter', icon: <FaHammer />, path: '/services/carpenter' },
    { name: 'Device Repair', icon: <FaWrench />, path: '/services/devicerepair' },
    { name: 'Electrician', icon: <FaBolt />, path: '/services/electrician' },
    { name: 'Garden Cleaner', icon: <FaSeedling />, path: '/services/gardencleaner' },
    { name: 'House Keeper', icon: <FaHome />, path: '/services/housecleaning' },
    { name: 'Plumber', icon: <FaTools />, path: '/services/plumber' }
  ];

  return (
    <nav className={`home-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-text">FIXORA</span>
          <span className="logo-subtitle">WorkForce Experts</span>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <div className="navbar-links">
            <div className="dropdown-container">
              <button 
                className="nav-link dropdown-toggle"
                onClick={toggleServicesDropdown}
              >
                Services
                <span className={`dropdown-arrow ${isServicesDropdownOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </button>
              {isServicesDropdownOpen && (
                <div className="dropdown-menu">
                  {services.map((service, index) => (
                    <a 
                      key={index}
                      href={service.path} 
                      className="dropdown-item"
                      onClick={() => setIsServicesDropdownOpen(false)}
                    >
                      {service.name}
                      <span className="service-icon">{service.icon}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#about" className="nav-link">About</a>
            <a href="/feedback" className="nav-link">Feedback</a>
          </div>

          <div className="navbar-actions">
            <button 
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="signup-btn"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="mobile-services">
              <h3>Services</h3>
              {services.map((service, index) => (
                <a 
                  key={index}
                  href={service.path} 
                  className="mobile-service-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {service.name}
                  <span className="service-icon">{service.icon}</span>
                </a>
              ))}
            </div>
            <div className="mobile-links">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a href="/feedback" onClick={() => setIsMobileMenuOpen(false)}>Feedback</a>
            </div>
            <div className="mobile-actions">
              <button 
                className="mobile-login-btn"
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </button>
              <button 
                className="mobile-signup-btn"
                onClick={() => {
                  navigate('/signup');
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;