import React, { useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

export default function Header() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={expanded}
      className="shadow-sm"
      sticky="top"
    >
      <Container>
        <Navbar.Brand href="#home" className="fw-bold">
          🔧 Fixora Admin
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          

          <Nav>
            <NavDropdown
              title="Boss Venu"
              id="basic-nav-dropdown"
              align="end"
              onSelect={() => setExpanded(false)}
            >
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
