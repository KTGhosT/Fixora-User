import React, { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

const UniqueHeader = ({ user, setUser }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    // Check localStorage for user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setUser]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isServicesDropdownOpen) setIsServicesDropdownOpen(false);
  };

  const toggleServicesDropdown = () => {
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/login');
    closeMobileMenu();
  };

  return (
    <>
      {/* Main Header */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => navigate('/')}>
            <span className={styles.logoText}>FIXORA</span>
            <span className={styles.logoSubtext}>WorkForce Experts</span>
          </div>

          {/* Navigation */}
          <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
            <ul className={styles.navList}>
              <li className={styles.dropdownContainer} ref={dropdownRef}>
                <button
                  className={`${styles.navLink} ${styles.dropdownToggle}`}
                  onClick={toggleServicesDropdown}
                  aria-expanded={isServicesDropdownOpen}
                  aria-haspopup="true"
                >
                  SERVICES
                  <span className={`${styles.dropdownArrow} ${isServicesDropdownOpen ? styles.arrowOpen : ''}`}>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div className={`${styles.dropdownMenu} ${isServicesDropdownOpen ? styles.dropdownOpen : ''}`}>
                  <div className={styles.dropdownContent}>
                    <a href="/services/carpenter" className={styles.dropdownLink} onClick={closeMobileMenu}>
                      <span className={styles.serviceIcon}>🔨</span>
                      <div>
                        <div className={styles.serviceName}>Carpenter</div>
                        <div className={styles.serviceDesc}>Furniture & installations</div>
                      </div>
                    </a>
                    <a href="/services/devicerepair" className={styles.dropdownLink} onClick={closeMobileMenu}>
                      <span className={styles.serviceIcon}>🔧</span>
                      <div>
                        <div className={styles.serviceName}>Device Repair</div>
                        <div className={styles.serviceDesc}>Phones, laptops & more</div>
                      </div>
                    </a>
                    <a href="/services/electrician" className={styles.dropdownLink} onClick={closeMobileMenu}>
                      <span className={styles.serviceIcon}>⚡</span>
                      <div>
                        <div className={styles.serviceName}>Electrician</div>
                        <div className={styles.serviceDesc}>Wiring & electrical issues</div>
                      </div>
                    </a>
                    <a href="/services/gardencleaner" className={styles.dropdownLink} onClick={closeMobileMenu}>
                      <span className={styles.serviceIcon}>🌱</span>
                      <div>
                        <div className={styles.serviceName}>Garden Cleaner</div>
                        <div className={styles.serviceDesc}>Lawn & garden maintenance</div>
                      </div>
                    </a>
                    <a href="/services/housecleaning" className={styles.dropdownLink} onClick={closeMobileMenu}>
                      <span className={styles.serviceIcon}>🏠</span>
                      <div>
                        <div className={styles.serviceName}>House Keeper</div>
                        <div className={styles.serviceDesc}>Cleaning & organization</div>
                      </div>
                    </a>
                    <a href="/services/plumber" className={styles.dropdownLink} onClick={closeMobileMenu}>
                      <span className={styles.serviceIcon}>🚰</span>
                      <div>
                        <div className={styles.serviceName}>Plumber</div>
                        <div className={styles.serviceDesc}>Pipes & fixtures repair</div>
                      </div>
                    </a>
                  </div>
                </div>
              </li>
              <li><a href="#about" className={styles.navLink} onClick={closeMobileMenu}>ABOUT</a></li>
              <li><a href="#blog" className={styles.navLink} onClick={closeMobileMenu}>BLOG</a></li>
              <li><a href="/feedback" className={styles.navLink} onClick={closeMobileMenu}>FEEDBACK CENTER</a></li>
            </ul>

            {/* User Actions */}
            <div className={styles.headerActions}>
              {user ? (
                <div className={styles.profileMenu}>
                  <button
                    className={styles.profileButton}
                    onClick={() => {
                      navigate('/user/account');
                      closeMobileMenu();
                    }}
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
                <div className={styles.floatingAuthButton}>
                  <a href="/login" className={styles.authButton}>
                    <span className={styles.authButtonText}>
                      <span>LOGIN</span>
                      <svg className={styles.authButtonIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                  <a href="/signup" className={styles.authButtonSecondary}>
                    <span className={styles.authButtonText}>
                      <span>SIGN UP</span>
                      <svg className={styles.authButtonIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className={`${styles.menuToggle} ${isMobileMenuOpen ? styles.active : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    </>
  );
};

export default UniqueHeader;