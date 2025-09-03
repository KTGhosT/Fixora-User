import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/user/Services.css";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  // Sample data structure for demonstration
  const serviceDetails = {
    "Plumbing Services": { rating: 4.4, reviews: "26.7k+", price: 210 },
    "Electrical Services": { rating: 4.6, reviews: "18.3k+", price: 190 },
    "Carpentry": { rating: 4.5, reviews: "12.4k+", price: 250 },
    "Home Cleaning": { rating: 4.5, reviews: "31.4k+", price: 85 },
    "Appliance Repair": { rating: 4.7, reviews: "27.4k+", price: 264 },
    "Painting": { rating: 4.3, reviews: "9.8k+", price: 320 },
    "Gardening": { rating: 4.2, reviews: "7.5k+", price: 120 },
    "Pest Control": { rating: 4.8, reviews: "317+", price: 186 }
  };

  return (
    <section className="services-section" id="services">
      <div className="container">
        <h2 className="section-title">Popular Services Near You</h2>
        
        <div className="services-grid">
          {services.length > 0 ? (
            services.map((service, i) => {
              const details = serviceDetails[service.name] || { rating: 4.5, reviews: "1k+", price: 200 };
              return (
                <div className="service-card" key={i}>
                  <div className="service-image">
                    <img src={service.image} alt={service.name} className="service-img" />
                  </div>

                  <div className="service-content">
                    <h3 className="service-name">{service.name}</h3>
                    
                    <div className="service-rating">
                      <span className="rating-stars">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={index}
                            className={`star ${index < Math.floor(details.rating) ? "filled" : ""}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-value">{details.rating}</span>
                      </span>
                      <span className="reviews">({details.reviews})</span>
                    </div>
                    
                    <div className="service-price">from ${details.price}</div>
                    
                    <button className="service-btn">View Details</button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-services">
              <p>No services available</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button className="btn-view-all">View All Services</button>
        </div>
      </div>
    </section>
  );
};

export default Services;
