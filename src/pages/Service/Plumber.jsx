import React, { Component, useEffect, useRef } from 'react';

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
        </div>
      );
    }
    return this.props.children;
  }
}

const Plumber = () => {
  const carouselRef = useRef(null);
  const atomicChainRef = useRef(null);

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

  // Initialize Bootstrap carousel after component mounts
  useEffect(() => {
    // Load Bootstrap JS if not already loaded
    const loadBootstrapJS = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };

    // Check if Bootstrap is already loaded
    if (typeof window.bootstrap === 'undefined') {
      loadBootstrapJS();
    }

    // Initialize carousel manually if needed
    if (carouselRef.current) {
      const carouselElement = carouselRef.current;
      if (carouselElement && typeof window.bootstrap !== 'undefined') {
        new window.bootstrap.Carousel(carouselElement, {
          interval: false, // We're handling auto-scroll manually
          ride: false
        });
      }
    }
  }, []);

  // Create atomic chain animation around the carousel
  useEffect(() => {
    if (!atomicChainRef.current || !carouselRef.current) return;

    const createAtomicChain = () => {
      const chainContainer = atomicChainRef.current;
      chainContainer.innerHTML = ''; // Clear existing chain
      
      // Create 4 sides of the atomic chain
      const sides = ['top', 'right', 'bottom', 'left'];
      
      sides.forEach(side => {
        const chainElement = document.createElement('div');
        chainElement.className = `atomic-chain ${side}`;
        chainContainer.appendChild(chainElement);
        
        // Create atoms for this side
        const atomCount = side === 'top' || side === 'bottom' ? 12 : 6;
        
        for (let i = 0; i < atomCount; i++) {
          const atom = document.createElement('div');
          atom.className = 'atom';
          atom.style.setProperty('--delay', `${i * 0.2}s`);
          
          // Create electron for each atom
          const electron = document.createElement('div');
          electron.className = 'electron';
          
          atom.appendChild(electron);
          chainElement.appendChild(atom);
        }
      });
    };

    // Create the chain initially
    createAtomicChain();

    // Recreate chain on resize
    const handleResize = () => {
      createAtomicChain();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ErrorBoundary>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      <style>
        {`
          /* Atomic Chain Animation Styles */
          .atomic-chain-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
          }
          
          .atomic-chain {
            position: absolute;
            display: flex;
            align-items: center;
          }
          
          .atomic-chain.top {
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
          }
          
          .atomic-chain.bottom {
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
          }
          
          .atomic-chain.left {
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            height: 70%;
            flex-direction: column;
          }
          
          .atomic-chain.right {
            right: -20px;
            top: 50%;
            transform: translateY(-50%);
            height: 70%;
            flex-direction: column;
          }
          
          .atom {
            width: 30px;
            height: 30px;
            position: relative;
            margin: 0 5px;
            animation: pulse 2s infinite var(--delay);
          }
          
          .atom::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #00bfff;
            box-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
          }
          
          .electron {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ffffff;
            transform: translate(-50%, -50%);
            animation: orbit 3s linear infinite;
          }
          
          @keyframes orbit {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(10px) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(10px) rotate(-360deg);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
          
          /* Existing styles */
          .hero-section {
            position: relative;
            overflow: hidden;
          }
          
          .hero-content {
            position: relative;
            z-index: 3;
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
          
          .carousel-container {
            position: relative;
            z-index: 2;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .carousel-img {
            height: 600px;
            object-fit: cover;
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
          }
          
          .carousel-img:hover {
            transform: scale(1.02);
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
          
          .carousel-indicators [data-bs-target] {
            width: 30px;
            height: 3px;
            border-radius: 0;
            background-color: rgba(255,255,255,0.5);
          }
          
          .carousel-indicators .active {
            background-color: white;
          }
          
          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            width: 40px;
            height: 40px;
            background-size: 100% 100%;
          }
          
          /* Add floating animation to hero text */
          .hero-title {
            animation: float 3s ease-in-out infinite;
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          .book-now-btn {
            animation: pulse 2s infinite;
            position: relative;
            overflow: hidden;
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
          }
          
          .book-now-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shine 2s infinite;
          }
          
          @keyframes shine {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
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
            .atomic-chain.top, .atomic-chain.bottom {
              width: 90%;
            }
            .atom {
              width: 20px;
              height: 20px;
            }
            .atom::before {
              width: 8px;
              height: 8px;
            }
            .electron {
              width: 4px;
              height: 4px;
            }
          }
        `}
      </style>
      
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="hero-section position-relative" style={{ backgroundColor: '#1e3a8a', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
          
          <div className="container hero-content">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-10">
                {/* Atomic chain container */}
                <div className="atomic-chain-container" ref={atomicChainRef}></div>
                
                {/* Wrap carousel in a container with higher z-index */}
                <div className="carousel-container" ref={carouselRef}>
                  <div className="carousel slide" data-bs-ride="carousel" id="heroCarousel">
                    <div className="carousel-inner rounded-4 overflow-hidden">
                      {[
                        { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', alt: 'Plumbing Tools' },
                        { src: 'https://images.unsplash.com/photo-1581093458791-9f3c0b3f9a9f', alt: 'Pipe Installation' },
                        { src: 'https://images.unsplash.com/photo-1618220923150-9c1e4c0e94b2', alt: 'Water Leak Repair' },
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
            </div>
            
            <div className="text-center text-white mb-5">
              <h1 className="display-1 fw-bold animated-text mb-4 hero-title" style={{ fontSize: '4rem' }}>
                Expert Plumbing Services
              </h1>
              <p className="lead fade-in mb-5" style={{ fontSize: '1.5rem' }}>
                Fast, Reliable & Affordable Solutions
              </p>
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary btn-lg px-5 py-3 book-now-btn" onClick={() => alert('Booking form would open here')}>
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
                <p className="lead">With 20+ years of experience, our certified plumbers provide professional solutions for leaks, installations, and emergencies.</p>
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
                <p className="lead">We offer comprehensive plumbing solutions for residential and commercial properties.</p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {[
                { title: 'Installation', desc: 'Professional pipe and fixture installations with guaranteed quality workmanship.', img: 'https://images.unsplash.com/photo-1581093458791-9f3c0b3f9a9f' },
                { title: 'Repairs', desc: 'Reliable leak and clog repairs with same-day service available.', img: 'https://images.unsplash.com/photo-1618220923150-9c1e4c0e94b2' },
                { title: 'Maintenance', desc: 'Keep systems running smoothly with our preventative maintenance plans.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
                { title: 'Emergency Services', desc: '24/7 urgent plumbing support with rapid response times.', img: 'https://images.unsplash.com/photo-1593642634367-d91a135587b6' },
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
                      { name: 'John D.', review: 'Fixed my leak fast! The plumber arrived within an hour and had it fixed in no time. ★★★★☆', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                      { name: 'Sarah K.', review: 'Professional and friendly team. They explained everything clearly and didn\'t overcharge me. Highly recommend!', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                      { name: 'Mike R.', review: 'Affordable and reliable service. I\'ve used them three times now and they always deliver quality work. ★★★★★', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
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
                  <div className="carousel-indicators mt-3">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        type="button"
                        data-bs-target="#reviewCarousel"
                        data-bs-slide-to={i}
                        className={`${i === 0 ? 'active' : ''}`}
                        aria-current={i === 0 ? 'true' : 'false'}
                        aria-label={`Review ${i + 1}`}
                      ></button>
                    ))}
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

export default Plumber;