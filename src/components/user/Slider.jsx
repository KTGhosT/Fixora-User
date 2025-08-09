import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../../styles/user/Slider.css';

const Slider = () => {
  return (
    <Carousel fade>
      <Carousel.Item>
        <div className="slider-bg" style={{ backgroundImage: "url('../../Images/slide1.jpg')" }}>
          <div className="slider-caption">
            <h1>Welcome to Fixora</h1>
            <p>Your trusted home service partner</p>
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="slider-bg" style={{ backgroundImage: "url('../../Images/slide2.jpg')" }}>
          <div className="slider-caption">
            <h1>Expert Electricians</h1>
            <p>Safe, professional, and reliable service</p>
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="slider-bg" style={{ backgroundImage: "url('../../Images/slide3.jpg')" }}>
          <div className="slider-caption">
            <h1>Plumbing Solutions</h1>
            <p>Leak-free and hassle-free</p>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
