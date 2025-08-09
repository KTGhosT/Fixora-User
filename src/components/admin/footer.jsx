// src/components/admin/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <small>
          &copy; {new Date().getFullYear()} Fixora. All Rights Reserved.
        </small>
      </div>
    </footer>
  );
}

export default Footer;
