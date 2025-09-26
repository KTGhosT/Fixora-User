import React, { useState, useEffect } from "react";
import styles from "./HomeHero.module.css";
import HomePageImage from "../../assets/Home/HomePage.jpg";
import ElectricianImage from "../../assets/Home/Electrician.png";
import PlumberImage from "../../assets/Home/Plumber.png";

const UniqueHero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const images = [HomePageImage, ElectricianImage, PlumberImage];

  useEffect(() => {
    // Set component as visible after mount for animation
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`${styles.hero} ${isVisible ? styles.visible : ''} hero-with-floating-header`} id="home" aria-label="Hero Section">
      {/* Animated background elements */}
      <div className={styles.animatedBackground}>
        <div className={styles.floatingCircle}></div>
        <div className={styles.floatingCircle}></div>
        <div className={styles.floatingCircle}></div>
      </div>
      
      <div className={styles.container}>
        {/* Hero Content */}
        
        <div className={styles.heroContent}>
          <h2 className={styles.heroSubtitle} data-aos="fade-up" data-aos-delay="100">
            <span className={styles.subtitleHighlight}>Premium Service Provider</span>
          </h2>
          <h1 className={styles.heroTitle} data-aos="fade-up" data-aos-delay="200">
            Transforming <span className={styles.titleHighlight}>Homes</span> with 
            <span className={styles.titleGradient}> Expert Care</span>
          </h1>

          {/* <p className={styles.heroDescription} data-aos="fade-up" data-aos-delay="300">
            
          </p> */}

          {/* Stats */}
          <div className={styles.heroStats} data-aos="fade-up" data-aos-delay="500">
            <div className={styles.statItem}>
              <div className={styles.statContent}>
                <span className={styles.statNumber} data-count="500">0</span>
                <span className={styles.statPlus}>+</span>
              </div>
              <span className={styles.statLabel}>Services Completed</span>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statContent}>
                <span className={styles.statNumber} data-count="200">0</span>
                <span className={styles.statPlus}>+</span>
              </div>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
            
          </div>

          {/* Buttons */}
          <div className={styles.heroButtons} data-aos="fade-up" data-aos-delay="600">
            <a href="#services" className={`${styles.btn} ${styles.btnPrimary}`}>
              <span>BECOME A WORKER</span>
              <div className={styles.btnHoverEffect}></div>
            </a>
            <a href="#contact" className={`${styles.btn} ${styles.btnSecondary}`}>
              <span>FIND A WORKER</span>
              <div className={styles.btnHoverEffect}></div>
            </a>
          </div>
        </div>

        {/* Hero Visual */}
        <div className={styles.heroVisual} data-aos="zoom-in" data-aos-delay="800">
          <div className={styles.imageContainer}>
            <div className={styles.slider}>
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`${styles.imageWrapper} ${
                    index === currentImageIndex ? styles.active : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`Professional Service ${index + 1}`}
                    className={styles.heroImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
              ))}
            </div>
            
            {/* Floating elements around the image */}
            <div className={styles.floatingElement}></div>
            <div className={styles.floatingElement}></div>
            <div className={styles.floatingElement}></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine}></div>
        <div className={styles.scrollArrow}></div>
        <span className={styles.scrollText}>Explore Services</span>
      </div>
    </section>
  );
};

export default UniqueHero;