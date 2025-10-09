import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

const UniqueHeader = ({ user, setUser }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSignup = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleCallNow = () => {
    window.location.href = 'tel:+1234567890';
  };

  return (
    <>
      {/* Combined Floating Navbar */}
      <header className={`${styles.combinedNavbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navbarContainer}>
          {/* Top Section */}
          <div className={styles.topSection}>
            {/* Logo Section */}
            <div className={styles.logoSection} onClick={() => navigate('/')}>
              <div>
                <div className={styles.logoText}>Fixora</div>
                <div className={styles.tagline}>WorkForce Experts</div>
              </div>
            </div>

            {/* Center Navigation */}
            <nav className={styles.centerNav}>
              <a href="#about" className={styles.navLink}>About</a>
              <a href="/feedback" className={styles.navLink}>Feedback Center</a>
            </nav>

            {/* Right Section */}
            <div className={styles.rightSection}>
              {/* Call Now Button */}
              <button className={styles.callNowButton} onClick={handleCallNow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59344 1.99522 8.06477 2.16708 8.43820 2.48353C8.81162 2.79999 9.06322 3.23945 9.14999 3.72C9.31072 4.68007 9.58719 5.61273 9.96999 6.5C10.1056 6.88792 10.1329 7.30478 10.0494 7.70618C9.96588 8.10759 9.77404 8.47549 9.48999 8.76L8.12999 10.12C9.42741 12.6551 11.3449 14.5727 13.88 15.87L15.24 14.51C15.5245 14.226 15.8924 14.0341 16.2938 13.9506C16.6952 13.8671 17.1121 13.8944 17.5 14.03C18.3873 14.4128 19.3199 14.6893 20.28 14.85C20.7658 14.9368 21.2094 15.1934 21.5265 15.5737C21.8437 15.954 22.0122 16.4326 21.9999 16.92H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Call Now
              </button>

              {/* Auth Buttons or User Section */}
              {user ? (
                <div className={styles.userSection}>
                  <button
                    className={styles.profileButton}
                    onClick={() => navigate('/profile')}
                    aria-label="Go to account page"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{user.name}</span>
                  </button>
                  <button className={styles.logoutButton} onClick={logout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <div className={styles.authButtons}>
                  <button className={styles.signInButton} onClick={handleLoginSignup}>
                    Sign in
                  </button>
                  <button className={styles.signUpButton} onClick={handleLoginSignup}>
                    Sign up
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className={styles.mobileMenuToggle}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`}></div>
                <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`}></div>
                <div className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`}></div>
              </button>
            </div>
          </div>

          {/* Services Section */}
          <div className={styles.servicesSection}>
            <div className={styles.servicesContent}>
              <a href="/services/plumber" className={styles.serviceLink}>Plumber</a>
              <a href="/services/carpenter" className={styles.serviceLink}>Carpenter</a>
              <a href="/services/electrician" className={styles.serviceLink}>Electrician</a>
              <a href="/services/devicerepair" className={styles.serviceLink}>Device Repair</a>
              <a href="/services/housecleaning" className={styles.serviceLink}>House Keeper</a>
              <a href="/services/gardencleaner" className={styles.serviceLink}>Garden Cleaner</a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}>
          <div className={styles.mobileMenuContent} onClick={(e) => e.stopPropagation()}>
            {/* Navigation Links */}
            <div className={styles.mobileNavLinks}>
              <a href="#about" className={styles.mobileNavLink} onClick={closeMobileMenu}>About</a>
              <a href="/feedback" className={styles.mobileNavLink} onClick={closeMobileMenu}>Feedback Center</a>
            </div>

            {/* Services */}
            <div className={styles.mobileServices}>
              <h3 className={styles.mobileServicesTitle}>Services</h3>
              <a href="/services/plumber" className={styles.mobileServiceLink} onClick={closeMobileMenu}>Plumber</a>
              <a href="/services/carpenter" className={styles.mobileServiceLink} onClick={closeMobileMenu}>Carpenter</a>
              <a href="/services/electrician" className={styles.mobileServiceLink} onClick={closeMobileMenu}>Electrician</a>
              <a href="/services/devicerepair" className={styles.mobileServiceLink} onClick={closeMobileMenu}>Device Repair</a>
              <a href="/services/housecleaning" className={styles.mobileServiceLink} onClick={closeMobileMenu}>House Keeper</a>
              <a href="/services/gardencleaner" className={styles.mobileServiceLink} onClick={closeMobileMenu}>Garden Cleaner</a>
            </div>

            {/* Actions */}
            <div className={styles.mobileActions}>
              <button className={styles.mobileCallButton} onClick={handleCallNow}>
                Call Now
              </button>

              {user ? (
                <div className={styles.mobileAuthButtons}>
                  <button className={styles.mobileSignInButton} onClick={() => navigate('/profile')}>
                    Profile ({user.name})
                  </button>
                  <button className={styles.mobileSignUpButton} onClick={logout}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <button className={styles.mobileSignInButton} onClick={handleLoginSignup}>
                    Sign in
                  </button>
                  <button className={styles.mobileSignUpButton} onClick={handleLoginSignup}>
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UniqueHeader;