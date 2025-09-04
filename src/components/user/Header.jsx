import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Navbar expand="lg" sticky="top" className={styles.customNavbar}>
      <Container>
        <Navbar.Brand href="/">
          <img
            src="src/assets/user/logo.png"
            alt="Workforce Logo"
            className={styles.logo}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#products">Home</Nav.Link>

            {/* Services with Dropdown */}
            <NavDropdown
              title="Services"
              id="services-dropdown"
              className="services-dropdown"
            >
              <NavDropdown.Item href="#service1">Electrician</NavDropdown.Item>
              <NavDropdown.Item href="#service2">Plumber</NavDropdown.Item>
              <NavDropdown.Item href="#service3">Cleaner</NavDropdown.Item>
              <NavDropdown.Item href="#service4">Gardener</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#resources">About</Nav.Link>
            <Nav.Link href="#customers">Customers</Nav.Link>
            <Nav.Link href="#blog">Find a worker</Nav.Link>
            <Nav.Link href="#blog">Feedback Center</Nav.Link>
          </Nav>

          <Nav className="navbar-buttons">
            {!user && (
              <>
                <Button className="btn-demo me-2" onClick={() => navigate('/register')}>
                  Become a Worker
                </Button>
                <Button className="btn-try-free" onClick={() => navigate('/login')}>
                  Log in
                </Button>
              </>
            )}

            {user && (
              <>
                <span className="me-3">Hello, {user.name}</span>
                <Button className="btn-try-free" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
