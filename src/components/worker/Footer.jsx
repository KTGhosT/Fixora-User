// Footer.jsx
import './Footer.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Description */}
        <div className="footer-logo">
          <h2>Fixora</h2>
          <p>Your trusted platform for professional workers and services.</p>
        </div>

        {/* Contact Section */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><i className="bi bi-envelope-fill"></i> fixora.services@gmail.com</p>
          <p><i className="bi bi-telephone-fill"></i> +94 77 123 4567</p>
        </div>

        {/* Social Media */}
        <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a>
            <a href="https://t.me" target="_blank" rel="noreferrer"><i className="bi bi-telegram"></i></a>
            <a href="https://wa.me" target="_blank" rel="noreferrer"><i className="bi bi-whatsapp"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 <span>Fixora</span> — All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
