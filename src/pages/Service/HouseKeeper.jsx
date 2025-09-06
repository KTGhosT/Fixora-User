// HouseKeeper.jsx
import React, { Component, useEffect, useRef } from 'react';
import * as THREE from 'three';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-5">
          <h1>Something went wrong. Please check the console for details.</h1>
          <p>Ensure Three.js is properly loaded.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const HouseKeeper = () => {
  const mountRef = useRef(null);
  const carouselRef = useRef(null);

  // Auto-scroll reviews every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextButton = carouselRef.current.querySelector('.carousel-control-next');
        if (nextButton) {
          nextButton.click();
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js Setup - Create a house keeper-themed animation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 8;

    // Broom
    const broomHandleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    const broomHandleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const broomHandle = new THREE.Mesh(broomHandleGeometry, broomHandleMaterial);
    broomHandle.rotation.x = Math.PI / 4;
    broomHandle.position.set(0, 0.75, 0);
    scene.add(broomHandle);
    
    // Broom bristles
    const bristlesGeometry = new THREE.ConeGeometry(0.2, 0.3, 16);
    const bristlesMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF99 });
    const bristles = new THREE.Mesh(bristlesGeometry, bristlesMaterial);
    bristles.position.set(0, 0.1, 0.3);
    bristles.rotation.x = Math.PI;
    scene.add(bristles);
    
    // Dust particles
    const dustParticles = [];
    for (let i = 0; i < 15; i++) {
      const geometry = new THREE.SphereGeometry(0.04, 6, 6);
      const material = new THREE.MeshStandardMaterial({ color: 0xDDDDDD });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        Math.random() * 1.5 - 0.75,
        Math.random() * 0.5 + 0.2,
        Math.random() * 1.5 - 0.75
      );
      scene.add(particle);
      dustParticles.push(particle);
    }
    
    // Cleaning bucket
    const bucketGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 16);
    const bucketMaterial = new THREE.MeshStandardMaterial({ color: 0x3366CC });
    const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
    bucket.position.set(-1, 0.2, 0);
    scene.add(bucket);
    
    // Store references for animation
    scene.userData = { broomHandle, bristles, dustParticles, bucket };

    // Add lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(2, 2, 5);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      
      const { broomHandle, bristles, dustParticles, bucket } = scene.userData;
      const time = Date.now() * 0.001;
      
      // Swing the broom
      broomHandle.rotation.z = Math.sin(time * 1.5) * 0.2;
      bristles.position.x = Math.sin(time * 1.5) * 0.1;
      
      // Make bucket shimmer
      bucket.rotation.y += 0.005;
      
      // Animate dust particles
      dustParticles.forEach((particle, index) => {
        particle.position.y = 0.2 + Math.sin(time * 2 + index * 0.5) * 0.3;
        particle.position.x += Math.sin(time + index) * 0.01;
      });
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <ErrorBoundary>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="hero-section position-relative" style={{ backgroundColor: '#2196F3', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
          <style>
            {`
              .hero-section {
                position: relative;
                overflow: hidden;
              }
              .hero-overlay {
                background: rgba(0,0,0,0.4);
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                z-index: 1;
              }
              .hero-content {
                position: relative;
                z-index: 2;
                padding: 2rem;
              }
              .animated-text {
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                border-right: 2px solid #fff;
                animation: typing 4s steps(30, end), blink 0.7s step-end infinite;
                max-width: 100%;
              }
              @keyframes typing {
                from { width: 0; }
                to { width: 100%; }
              }
              @keyframes blink {
                from, to { border-color: transparent }
                50% { border-color: white }
              }
              .carousel-img {
                height: 600px;
                object-fit: cover;
                width: 100%;
                border-radius: 12px;
              }
              .three-js-container {
                height: 400px;
                width: 100%;
                max-width: 800px;
                margin: 2rem auto;
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              }
              .fade-in {
                animation: fadeIn 1.5s ease-in;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .review-slide {
                animation: slideIn 0.8s ease-out;
                padding: 2rem;
              }
              @keyframes slideIn {
                from { transform: translateX(50px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
              .hover-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
              .hover-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
              }
              .carousel-indicators {
                bottom: 20px;
              }
              .carousel-control-prev-icon,
              .carousel-control-next-icon {
                width: 40px;
                height: 40px;
                font-size: 20px;
              }
              @media (max-width: 768px) {
                .hero-section {
                  min-height: auto;
                  padding-top: 120px;
                  padding-bottom: 60px;
                }
                .carousel-img {
                  height: 400px;
                }
                .three-js-container {
                  height: 300px;
                }
              }
            `}
          </style>
          
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-10">
                <div className="carousel slide" data-bs-ride="carousel" id="heroCarousel">
                  <div className="carousel-inner rounded-4 overflow-hidden">
                    {[
                      { src: 'https://images.unsplash.com/photo-1527515637462-cff96446b4a0', alt: 'House Cleaning' },
                      { src: 'https://images.unsplash.com/photo-1584754253535-293223333d0e', alt: 'Professional Cleaning' },
                      { src: 'https://images.unsplash.com/photo-1583608238874-6a5488e44b1c', alt: 'Home Maintenance' },
                    ].map((img, i) => (
                      <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                        <img src={img.src} className="d-block w-100 carousel-img" alt={img.alt} />
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                  <div className="carousel-indicators">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        type="button"
                        data-bs-target="#heroCarousel"
                        data-bs-slide-to={i}
                        className={`${i === 0 ? 'active' : ''}`}
                        aria-current={i === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${i + 1}`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8">
                <div className="three-js-container" ref={mountRef}></div>
              </div>
            </div>
            
            <div className="text-center text-white mb-5">
              <h1 className="display-1 fw-bold animated-text mb-4" style={{ fontSize: '4rem' }}>
                House Keeping Services
              </h1>
              <p className="lead fade-in mb-5" style={{ fontSize: '1.5rem' }}>
                Sparkling Clean Homes & Offices
              </p>
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary btn-lg px-5 py-3" onClick={() => alert('Booking form would open here')}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-5 bg-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="mb-4 display-6">About Our Services</h2>
                <p className="lead">With 20+ years of experience, our professional housekeepers provide comprehensive cleaning solutions for homes and offices.</p>
                <div className="row mt-5 text-center">
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">20+</h3>
                      <p className="text-muted">Years Experience</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">500+</h3>
                      <p className="text-muted">Projects Completed</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">98%</h3>
                      <p className="text-muted">Customer Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8 text-center">
                <h2 className="mb-5">Our Services</h2>
                <p className="lead">We offer comprehensive house keeping solutions for residential and commercial properties.</p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {[
                { title: 'Regular Cleaning', desc: 'Weekly or bi-weekly cleaning to maintain a spotless home.', img: 'https://images.unsplash.com/photo-1527515637462-cff96446b4a0' },
                { title: 'Deep Cleaning', desc: 'Comprehensive deep cleaning for spring cleaning or before events.', img: 'https://images.unsplash.com/photo-1584754253535-293223333d0e' },
                { title: 'Office Cleaning', desc: 'Professional cleaning services for businesses and offices.', img: 'https://images.unsplash.com/photo-1583608238874-6a5488e44b1c' },
                { title: 'Move In/Out Cleaning', desc: 'Thorough cleaning when moving in or out of a property.', img: 'https://images.unsplash.com/photo-1583608238874-6a5488e44b1c' },
              ].map((s, i) => (
                <div key={i} className="col-md-6 col-lg-3">
                  <div className="card h-100 shadow-sm hover-card border-0">
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img src={s.img} alt={s.title} className="card-img-top w-100 h-100" style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                    </div>
                    <div className="card-body text-center p-4">
                      <h5 className="card-title fw-bold text-primary">{s.title}</h5>
                      <p className="card-text text-muted">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-5 bg-white">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8 text-center">
                <h2 className="mb-5">Customer Reviews</h2>
                <p className="lead">Hear what our satisfied customers have to say about our services.</p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="carousel slide" data-bs-ride="carousel" id="reviewCarousel" ref={carouselRef}>
                  <div className="carousel-inner">
                    {[
                      { name: 'Anna K.', review: 'Best cleaning service I\'ve ever used. My house sparkles! ★★★★★', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
                      { name: 'David S.', review: 'Reliable, trustworthy, and does an amazing job every time. ★★★★☆', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
                      { name: 'Rachel B.', review: 'Perfect for our busy family. Worth every penny! ★★★★★', avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
                    ].map((r, i) => (
                      <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                        <div className="text-center review-slide p-4 bg-light rounded-3">
                          <img src={r.avatar} alt={r.name} className="rounded-circle mb-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                          <h5 className="mb-3 fw-bold">{r.name}</h5>
                          <p className="lead mb-0 fst-italic">"{r.review}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <button className="carousel-control-prev" type="button" data-bs-target="#reviewCarousel" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#reviewCarousel" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default HouseKeeper;