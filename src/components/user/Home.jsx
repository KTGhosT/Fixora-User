import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import bg1 from "../../assets/user/bg1.jpg"; // Update with your image paths
import bg2 from "../../assets/user/bg2.jpg";
import bg3 from "../../assets/user/bg3.jpg";
import "../../styles/user/HomeHero.css"; // We'll create this CSS file

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: bg1,
      title: "Welcome to Fixora",
      subtitle: "Your one-stop solution for home services – plumber, electrician, and more."
    },
    {
      image: bg2,
      title: "Quality Home Services",
      subtitle: "Professional technicians for all your home repair and maintenance needs."
    },
    {
      image: bg3,
      title: "Trusted Professionals",
      subtitle: "Verified experts ready to help with your home projects."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  return (
    <>
      <section className="hero-slider">
        {/* Slide indicators */}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button className="slide-nav prev" onClick={goToPrevSlide} aria-label="Previous slide">
          &#8249;
        </button>
        <button className="slide-nav next" onClick={goToNextSlide} aria-label="Next slide">
          &#8250;
        </button>

        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="container">
              <div className="slide-content">
                <h1 className="slide-title" data-aos="fade-down">
                  {slide.title}
                </h1>
                <p className="slide-subtitle" data-aos="fade-up" data-aos-delay="300">
                  {slide.subtitle}
                </p>
                
                {/* Search Box similar to Angi */}
                <div className="hero-search-box" data-aos="zoom-in" data-aos-delay="500">
                  <h3>Find a Pro for any project</h3>
                  <div className="search-form">
                    <input 
                      type="text" 
                      placeholder="What service do you need?" 
                      className="search-input"
                    />
                    <input 
                      type="text" 
                      placeholder="Zip Code" 
                      className="zip-input"
                    />
                    <button className="search-btn">Search</button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="hero-buttons" data-aos="fade-up" data-aos-delay="700">
                  <a href="#services" className="btn btn-primary">
                    View Services
                  </a>
                  <a href="#about" className="btn btn-outline-light">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

    
    </>
  );
};

export default Home;