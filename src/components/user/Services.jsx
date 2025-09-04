import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Services.module.css";

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
    <section className={styles.servicesSection} id="services">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Popular Services Near You</h2>
        
        <div className={styles.servicesGrid}>
          {services.length > 0 ? (
            services.map((service, i) => {
              const details = serviceDetails[service.name] || { rating: 4.5, reviews: "1k+", price: 200 };
              return (
                <div className={styles.serviceCard} key={i}>
                  <div className={styles.serviceImage}>
                    <img src={service.image} alt={service.name} className={styles.serviceImg} />
                  </div>

                  <div className={styles.serviceContent}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    
                    <div className={styles.serviceRating}>
                      <span className={styles.ratingStars}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={index}
                            className={`${styles.star} ${index < Math.floor(details.rating) ? styles.filled : ""}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className={styles.ratingValue}>{details.rating}</span>
                      </span>
                      <span className={styles.reviews}>({details.reviews})</span>
                    </div>
                    
                    <div className={styles.servicePrice}>from ${details.price}</div>
                    
                    <button className={styles.serviceBtn}>View Details</button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noServices}>
              <p>No services available</p>
            </div>
          )}
        </div>

        <div className={styles.textCenter}>
          <button className={styles.btnViewAll}>View All Services</button>
        </div>
      </div>
    </section>
  );
};

export default Services;
