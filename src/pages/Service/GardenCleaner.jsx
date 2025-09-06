// GardenCleaner.jsx
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

const GardenCleaner = () => {
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

    // Three.js Setup - Create a garden cleaner-themed animation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 8;

    // Lawn mower
    const mowerBodyGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.2);
    const mowerBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const mowerBody = new THREE.Mesh(mowerBodyGeometry, mowerBodyMaterial);
    mowerBody.position.set(0, 0.15, 0);
    scene.add(mowerBody);
    
    // Wheels
    const createWheel = (x, y, z) => {
      const geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
      const material = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const wheel = new THREE.Mesh(geometry, material);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, y, z);
      return wheel;
    };
    
    const wheel1 = createWheel(-0.3, 0.15, -0.4);
    const wheel2 = createWheel(0.3, 0.15, -0.4);
    const wheel3 = createWheel(-0.3, 0.15, 0.4);
    const wheel4 = createWheel(0.3, 0.15, 0.4);
    scene.add(wheel1, wheel2, wheel3, wheel4);
    
    // Handle
    const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.x = Math.PI / 4;
    handle.position.set(0, 0.6, -0.8);
    scene.add(handle);
    
    // Grass particles
    const grassParticles = [];
    for (let i = 0; i < 10; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      const material = new THREE.MeshStandardMaterial({ color: 0x7CFC00 });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        Math.random() * 1 - 0.5,
        Math.random() * 0.5 + 0.5,
        Math.random() * 1 - 0.5
      );
      scene.add(particle);
      grassParticles.push(particle);
    }
    
    // Store references for animation
    scene.userData = { mowerBody, wheel1, wheel2, wheel3, wheel4, handle, grassParticles };

    // Add lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(2, 2, 5);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      
      const { mowerBody, wheel1, wheel2, wheel3, wheel4, handle, grassParticles } = scene.userData;
      const time = Date.now() * 0.001;
      
      // Bob the mower up and down slightly
      mowerBody.position.y = 0.15 + Math.sin(time * 2) * 0.05;
      
      // Rotate wheels
      wheel1.rotation.z += 0.03;
      wheel2.rotation.z += 0.03;
      wheel3.rotation.z += 0.03;
      wheel4.rotation.z += 0.03;
      
      // Animate grass particles
      grassParticles.forEach((particle, index) => {
        particle.position.y = 0.5 + Math.sin(time * 2 + index) * 0.3;
        particle.rotation.y = time * 0.5;
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
        <section className="hero-section position-relative" style={{ backgroundColor: '#4CAF50', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
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
                      { src: 'https://images.unsplash.com/photo-1516190415008-6d6229a894d2', alt: 'Garden Maintenance' },
                      { src: 'https://images.unsplash.com/photo-1506317452215-484646d00b45', alt: 'Lawn Care' },
                      { src: 'https://images.unsplash.com/photo-1500280463035-5416b13a28cf', alt: 'Landscaping' },
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
                Garden Cleaning Services
              </h1>
              <p className="lead fade-in mb-5" style={{ fontSize: '1.5rem' }}>
                Beautiful, Well-Maintained Gardens
              </p>
              <div className="d-flex justify-content-center">
                <button className="btn btn-success btn-lg px-5 py-3" onClick={() => alert('Booking form would open here')}>
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
                <p className="lead">With 20+ years of experience, our professional gardeners provide comprehensive solutions for lawn care, landscaping, and garden maintenance.</p>
                <div className="row mt-5 text-center">
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-success">20+</h3>
                      <p className="text-muted">Years Experience</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-success">500+</h3>
                      <p className="text-muted">Projects Completed</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-success">98%</h3>
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
                <p className="lead">We offer comprehensive garden cleaning solutions for residential and commercial properties.</p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {[
                { title: 'Lawn Mowing', desc: 'Regular lawn maintenance to keep your grass looking perfect.', img: 'https://images.unsplash.com/photo-1506317452215-484646d00b45' },
                { title: 'Weed Control', desc: 'Effective weed removal and prevention for healthy gardens.', img: 'https://images.unsplash.com/photo-1500280463035-5416b13a28cf' },
                { title: 'Pruning & Trimming', desc: 'Professional pruning of trees, shrubs, and hedges.', img: 'https://images.unsplash.com/photo-1516190415008-6d6229a894d2' },
                { title: 'Garden Cleanup', desc: 'Complete garden cleanup including leaf removal and debris clearing.', img: 'https://images.unsplash.com/photo-1518057425270-388e48288689' },
              ].map((s, i) => (
                <div key={i} className="col-md-6 col-lg-3">
                  <div className="card h-100 shadow-sm hover-card border-0">
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img src={s.img} alt={s.title} className="card-img-top w-100 h-100" style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                    </div>
                    <div className="card-body text-center p-4">
                      <h5 className="card-title fw-bold text-success">{s.title}</h5>
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
                      { name: 'Susan P.', review: 'Transformed our overgrown garden into a beautiful oasis! ★★★★★', avatar: 'https://randomuser.me/api/portraits/women/56.jpg' },
                      { name: 'Mike T.', review: 'Consistent, reliable service. Our lawn has never looked better. ★★★★☆', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
                      { name: 'Carol L.', review: 'Professional team that takes pride in their work. Highly recommend! ★★★★★', avatar: 'https://randomuser.me/api/portraits/women/78.jpg' },
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

export default GardenCleaner;