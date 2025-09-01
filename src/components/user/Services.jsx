import React, { useEffect, useState } from "react";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  return (
    <section className="py-5 bg-light" id="services">
      <div className="container">
        <h2 className="text-center mb-5" data-aos="zoom-in">
          Our Services
        </h2>
        <div className="row g-4">
          {services.length > 0 ? (
            services.map((service, i) => (
              <div
                className="col-md-4"
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="card h-100 text-center shadow">
                  <img
                    src={service.image}
                    alt={service.name}
                    width="200"
                    className="mx-auto mt-3"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{service.name}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No services available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
