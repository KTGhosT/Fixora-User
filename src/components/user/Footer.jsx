import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.footerMain}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            {/* App Download Section */}
            <div className={styles.appDownload}>
              <h3>Download the Fixora App</h3>
              <p>Book services, manage appointments, and more on the go</p>
              <div className={styles.downloadButtons}>
                <a href="#" className={`${styles.appBtn} ${styles.appStore}`}>
                  <span className={styles.btnIcon}>📱</span>
                  <div className={styles.btnText}>
                    <span className={styles.available}>Download on the</span>
                    <span className={styles.store}>App Store</span>
                  </div>
                </a>
                <a href="#" className={`${styles.appBtn} ${styles.googlePlay}`}>
                  <span className={styles.btnIcon}>📱</span>
                  <div className={styles.btnText}>
                    <span className={styles.available}>GET IT ON</span>
                    <span className={styles.store}>Google Play</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Footer Links */}
            <div className={styles.footerLinks}>
              <div className={styles.footerColumn}>
                <h4>Company</h4>
                <a href="#home">Home</a>
                <a href="/about">About Us</a>
                <a href="#careers">Careers</a>
                <a href="#press">Press</a>
              </div>
              
              <div className={styles.footerColumn}>
                <h4>Services</h4>
                <a href="#plumbing">Plumbing</a>
                <a href="#electrical">Electrical</a>
                <a href="#cleaning">Cleaning</a>
                <a href="#repair">Repair</a>
              </div>
              
              <div className={styles.footerColumn}>
                <h4>Resources</h4>
                <a href="#blog">Blog</a>
                <a href="#tips">Tips & Ideas</a>
                <a href="#faq">FAQ</a>
                <a href="#pros">For Professionals</a>
              </div>
              
              <div className={styles.footerColumn}>
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
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.footerBottomContent}>
            <div className={styles.legalLinks}>
              <a href="#terms">Terms of Use</a>
              <span className={styles.separator}>|</span>
              <a href="#privacy">Privacy Policy</a>
              <span className={styles.separator}>|</span>
              <a href="#sitemap">Sitemap</a>
              <span className={styles.separator}>|</span>
              <a href="#accessibility">Accessibility Tools</a>
              <span className={styles.separator}>|</span>
              <a href="#donotsell">Do Not Sell or Share My Personal Information</a>
            </div>
            
            <div className={styles.copyright}>
              <p>&copy; Copyright 1995-{year}, Fixora. All Rights Reserved.</p>
              <small className={styles.currentTime}>
                Current Time: <span className="fw-bold">{currentTime}</span>
              </small>
            </div>
            
            <div className={styles.footerLove}>
              <small>
                Designed with <span className={styles.heart}>❤️</span> by Fixora Team
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;