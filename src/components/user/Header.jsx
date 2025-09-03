import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import '../../styles/user/header.css';

const Header = () => {
  return (
    <Navbar expand="lg" sticky="top" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="src/assets/user/logo.png"
            alt="Workforce Logo"
            className="logo"
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
            <Nav.Link href="#blog">Feedback Center</Nav.Link>
          </Nav>
          <Nav className="navbar-buttons">
            <Button className="btn-demo me-2">Become a Worker</Button>
            <Button className="btn-try-free">Log in</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
