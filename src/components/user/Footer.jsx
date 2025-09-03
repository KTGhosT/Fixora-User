import React from "react";
import "../../styles/user/Footer.css"; // We'll create this CSS file

const Footer = () => {
  const year = new Date().getFullYear();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* App Download Section */}
            <div className="app-download">
              <h3>Download the Fixora App</h3>
              <p>Book services, manage appointments, and more on the go</p>
              <div className="download-buttons">
                <a href="#" className="app-btn app-store">
                  <span className="btn-icon">📱</span>
                  <div className="btn-text">
                    <span className="available">Download on the</span>
                    <span className="store">App Store</span>
                  </div>
                </a>
                <a href="#" className="app-btn google-play">
                  <span className="btn-icon">📱</span>
                  <div className="btn-text">
                    <span className="available">GET IT ON</span>
                    <span className="store">Google Play</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Footer Links */}
            <div className="footer-links">
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#home">Home</a>
                <a href="#about">About Us</a>
                <a href="#careers">Careers</a>
                <a href="#press">Press</a>
              </div>
              
              <div className="footer-column">
                <h4>Services</h4>
                <a href="#plumbing">Plumbing</a>
                <a href="#electrical">Electrical</a>
                <a href="#cleaning">Cleaning</a>
                <a href="#repair">Repair</a>
              </div>
              
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#blog">Blog</a>
                <a href="#tips">Tips & Ideas</a>
                <a href="#faq">FAQ</a>
                <a href="#pros">For Professionals</a>
              </div>
              
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#contact">Contact Us</a>
                <a href="#help">Help Center</a>
                <a href="#safety">Safety</a>
                <a href="#feedback">Feedback</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="legal-links">
              <a href="#terms">Terms of Use</a>
              <span className="separator">|</span>
              <a href="#privacy">Privacy Policy</a>
              <span className="separator">|</span>
              <a href="#sitemap">Sitemap</a>
              <span className="separator">|</span>
              <a href="#accessibility">Accessibility Tools</a>
              <span className="separator">|</span>
              <a href="#donotsell">Do Not Sell or Share My Personal Information</a>
            </div>
            
            <div className="copyright">
              <p>&copy; Copyright 1995-{year}, Fixora. All Rights Reserved.</p>
              <small className="current-time">
                Current Time: <span className="fw-bold">{currentTime}</span>
              </small>
            </div>
            
            <div className="footer-love">
              <small>
                Designed with <span className="heart">❤️</span> by Fixora Team
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;