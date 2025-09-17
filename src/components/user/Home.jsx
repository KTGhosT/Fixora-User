import React, { useState, useEffect } from "react";
import styles from "./HomeHero.module.css";
import HomePageImage from "../../assets/Home/HomePage.jpg";
import ElectricianImage from "../../assets/Home/Electrician.png";
import PlumberImage from "../../assets/Home/Plumber.png";

const UniqueHero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [HomePageImage, ElectricianImage, PlumberImage];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero} id="home" aria-label="Hero Section">
      <div className={styles.container}>
        {/* Hero Visual */}
        <div className={styles.heroVisual} data-aos="zoom-in" data-aos-delay="800">
          <div className={styles.slider}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className={`${styles.heroImage} ${
                  index === currentImageIndex ? styles.active : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <h2 className={styles.heroSubtitle} data-aos="fade-up" data-aos-delay="100">
            Online Service Provider
          </h2>
          <h1 className={styles.heroTitle} data-aos="fade-up" data-aos-delay="200">
            Creating a <span className={styles.titleHighlight}>Better Future</span> through Online Service
          </h1>

          {/* Stats */}
          <div className={styles.heroStats} data-aos="fade-up" data-aos-delay="500">
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Services Completed</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>200+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.heroButtons} data-aos="fade-up" data-aos-delay="600">
            <a href="#services" className={`${styles.btn} ${styles.btnPrimary}`}>
              BECOME A WORKER
            </a>
            <a href="#contact" className={`${styles.btn} ${styles.btnSecondary}`}>
              FIND A WORKER
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollArrow}></div>
        <span className={styles.scrollText}>Scroll</span>
      </div>
    </section>
  );
};

export default UniqueHero;
