import React from "react";

const About = () => {
  return (
    <section id="about" className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Image */}
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="src/assets/user/about.jpg" // 👉 replace with your image path
              alt="Fixora workforce"
              className="img-fluid rounded shadow"
            />
          </div>

          {/* Right Content */}
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">About Us</h2>
            <p className="text-muted">
              Fixora is a modern workforce connection platform built to link skilled 
              workers such as electricians, plumbers, cleaners, and more with clients 
              who need their services. With real-time worker availability, location-based 
              matching, and instant notifications, Fixora ensures fast and reliable 
              service for every request.
            </p>
            <p className="text-muted">
              Our mission is to make hiring simple, transparent, and trustworthy – 
              empowering both workers and clients with a seamless digital experience.
            </p>
            <a href="#learn-more" className="btn btn-primary rounded-pill px-4 py-2">
              Learn More →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
