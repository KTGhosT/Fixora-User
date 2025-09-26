import React, { Component, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

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

const HouseKeeper = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll hero every 4 seconds
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

  // Remove broken review carousel auto-scroll effect (no such carousel exists)
  // (The original code tried to auto-scroll a non-existent review carousel.)

  // Initialize Bootstrap carousel after component mounts
  useEffect(() => {
    const loadBootstrapJS = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    // Wait for window.bootstrap to be available before initializing
    let cleanup = null;
    if (typeof window.bootstrap === 'undefined') {
      cleanup = loadBootstrapJS();
    } else if (carouselRef.current && window.bootstrap) {
      new window.bootstrap.Carousel(carouselRef.current, {
        interval: false,
        ride: false,
      });
    }

    return () => {
      if (cleanup) cleanup();
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
          /* Full-Screen Hero Carousel */
          .hero-slider {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background-color: #1565C0;
          }

          .carousel-item {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-size: cover;
            background-position: center;
            transition: opacity 0.8s ease-in-out;
          }

          .carousel-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0;
            opacity: 0;
            transform: scale(0.05);
            transition: opacity 0.4s ease-in-out, transform 0.6s ease-in-out;
          }

          .carousel-item.active img {
            opacity: 1;
            transform: scale(1);
          }

          /* Blur Box Overlay */
          .blur-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 800px;
            padding: 2rem;
            background: rgba(69, 67, 67, 0.4);
            backdrop-filter: blur(0.5px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            text-align: center;
            z-index: 2;
            box-shadow: 0 10px 30px rgba(41, 39, 39, 0.3);
          }

          /* Animated Text */
          .animated-text {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid white;
            animation: typing 4s steps(30, end), blink 0.7s step-end infinite;
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }

          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }

          @keyframes blink {
            from, to { border-color: transparent; }
            50% { border-color: white; }
          }

          .lead-text {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }

          .btn-book-now {
            background-color: #0D47A1;
            border: none;
            color: white;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(13, 71, 161, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .btn-book-now:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(13, 71, 161, 0.4);
          }

          /* Controls */
          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            width: 40px;
            height: 40px;
            background-size: 100% 100%;
            opacity: 0.8;
            transition: opacity 0.3s ease;
          }

          .carousel-control-prev-icon:hover,
          .carousel-control-next-icon:hover {
            opacity: 1;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .animated-text {
              font-size: 2rem;
            }
            .lead-text {
              font-size: 1.2rem;
            }
            .btn-book-now {
              padding: 0.6rem 1.2rem;
              font-size: 0.9rem;
            }
          }

          /* Service Card */
          .service-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .service-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
          }

          .service-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .service-card:hover .service-img {
            transform: scale(1.05);
          }

          .service-title {
            font-size: 1.3rem;
            color: #0D47A1;
            margin-bottom: 0.5rem;
            font-weight: bold;
          }

          .service-desc {
            color: #6c757d;
            font-size: 0.95rem;
            line-height: 1.5;
            text-align: center;
          }

          /* Review Carousel - Horizontal Scroll Layout */
          .review-scroller {
            overflow-x: auto;
            padding: 20px 0;
            scrollbar-width: thin;
            scrollbar-color: #0D47A1 #f8f9fa;
          }

          .review-scroller::-webkit-scrollbar {
            height: 8px;
          }

          .review-scroller::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 4px;
          }

          .review-scroller::-webkit-scrollbar-thumb {
            background-color: #0D47A1;
            border-radius: 4px;
          }

          .review-row {
            display: flex;
            gap: 20px;
            padding: 10px 0;
            min-width: max-content;
          }

          .review-card {
            min-width: 300px;
            flex: 0 0 auto;
          }

          .review-card .card {
            height: 100%;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          }

          .review-card .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          }

          /* Star Rating */
          .stars {
            font-size: 1.2rem;
            color: #0D47A1;
            margin-top: 0.5rem;
            letter-spacing: 2px;
          }

          /* Fade-in Animation */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .review-card {
              min-width: 250px;
            }
            .stars {
              font-size: 1rem;
            }
            .review-scroller {
              padding: 10px 0;
            }
          }

          @media (max-width: 576px) {
            .review-card {
              min-width: 220px;
            }
            .review-row {
              gap: 15px;
            }
          }
        `}
      </style>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Full-Screen Hero Carousel */}
        <section className="hero-slider">
          <div ref={carouselRef} className="carousel slide" data-bs-ride="carousel" id="heroCarousel">
            <div className="carousel-inner">
              {[
                { src: 'https://images.unsplash.com/photo-1612857017655-7b035a3d8a5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGhvdXNlJTIwY2xlYW5pbmd8ZW58MHx8MHx8fDI%3D', alt: 'House Cleaning' },
                { src: 'https://images.unsplash.com/photo-1686178827149-6d55c72d81df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGhvdXNlJTIwY2xlYW5pbmd8ZW58MHx8MHx8fDI%3D', alt: 'Professional Cleaning' },
                { src: 'https://images.unsplash.com/photo-1686828751885-040f0a0fb77a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGhvdXNlJTIwY2xlYW5pbmd8ZW58MHx8MHx8fDI%3D', alt: 'Home Maintenance' },
              ].map((img, i) => (
                <div key={i} className={`carousel-item${i === 0 ? ' active' : ''}`}>
                  <img src={img.src} alt={img.alt} />
                  <div className="blur-box">
                    <h1 className="animated-text">Expert House Keeping Services</h1>
                    <p className="lead-text">Sparkling Clean Homes & Offices</p>
                    <button className="btn-book-now" onClick={() => navigate('/booking')}>
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>

            {/* Indicators */}
            <div className="carousel-indicators">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#heroCarousel"
                  data-bs-slide-to={i}
                  className={i === 0 ? 'active' : ''}
                  aria-current={i === 0 ? 'true' : undefined}
                  aria-label={`Slide ${i + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-5 bg-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="mb-4 display-6">About Our Services</h2>
                <p className="lead">
                  With 20+ years of experience, our professional housekeepers provide comprehensive cleaning solutions for homes and offices.
                </p>
                <div className="row mt-5 text-center">
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">20+</h3>
                      <p className="text-muted">Years Experience</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">1000+</h3>
                      <p className="text-muted">Homes Cleaned</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">99%</h3>
                      <p className="text-muted">Customer Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
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
                {
                  title: 'Regular Cleaning',
                  desc: 'Weekly or bi-weekly cleaning to maintain a spotless home.',
                  img: 'https://images.unsplash.com/photo-1568688271711-1aeee5ce0363?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG91c2UlMjBrZWVwZXJ8ZW58MHx8MHx8fDI%3D',
                },
                {
                  title: 'Deep Cleaning',
                  desc: 'Comprehensive deep cleaning for spring cleaning or before events.',
                  img: 'https://images.unsplash.com/photo-1646980241033-cd7abda2ee88?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2UlMjBjbGVhbmluZ3xlbnwwfHwwfHx8Mg%3D%3D',
                },
                {
                  title: 'Office Cleaning',
                  desc: 'Professional cleaning services for businesses and offices.',
                  img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhvdXNlJTIwY2xlYW5pbmd8ZW58MHx8MHx8fDI%3D',
                },
                {
                  title: 'Move In/Out Cleaning',
                  desc: 'Thorough cleaning when moving in or out of a property.',
                  img: 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGhvdXNlJTIwY2xlYW5pbmd8ZW58MHx8MHx8fDI%3D',
                },
              ].map((s, i) => (
                <div key={i} className="col-md-6 col-lg-3">
                  <div className="service-card" onClick={() => alert(`Learn more about ${s.title}`)}>
                    <img src={s.img} alt={s.title} className="service-img" />
                    <div className="p-4 text-center">
                      <h5 className="service-title">{s.title}</h5>
                      <p className="service-desc">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-5 bg-white">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8 text-center">
                <h2 className="mb-5">Customer Reviews</h2>
                <p className="lead">Hear what our satisfied customers have to say about our services.</p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12">
                <div className="review-scroller">
                  <div className="review-row">
                    {[
                      {
                        name: 'Anna K.',
                        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
                        review: 'Best cleaning service I\'ve ever used. My house sparkles!',
                        rating: 5,
                      },
                      {
                        name: 'David S.',
                        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                        review: 'Reliable, trustworthy, and does an amazing job every time.',
                        rating: 4,
                      },
                      {
                        name: 'Rachel B.',
                        avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
                        review: 'Perfect for our busy family. Worth every penny!',
                        rating: 5,
                      },
                      {
                        name: 'Mark T.',
                        avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
                        review: 'Professional and thorough. My apartment has never been cleaner!',
                        rating: 5,
                      },
                      {
                        name: 'Sarah L.',
                        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
                        review: 'Flexible scheduling and excellent attention to detail.',
                        rating: 5,
                      },
                      {
                        name: 'John P.',
                        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
                        review: 'Affordable prices and consistently great service.',
                        rating: 5,
                      },
                    ].map((r, i) => (
                      <div key={i} className="review-card">
                        <div className="card shadow-sm border-0 text-center p-4 h-100">
                          <img
                            src={r.avatar}
                            alt={r.name}
                            className="rounded-circle mb-3"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                          <h5 className="fw-bold mb-3">{r.name}</h5>
                          <p className="text-muted fst-italic mb-2">{r.review}</p>
                          <div className="stars">
                            {[...Array(5)].map((_, j) => (
                              <span key={j}>
                                {j < r.rating ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-5 bg-light" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8 text-center">
                <h2 className="mb-4 display-6">Frequently Asked Questions</h2>
                <p className="lead text-muted">Everything you need to know about our house keeping services.</p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="accordion" id="faqAccordion">
                  {[
                    {
                      question: 'What areas do you clean?',
                      answer:
                        'We clean all areas of your home including bedrooms, bathrooms, kitchen, living areas, and floors. We can also clean inside appliances, windows, and other areas upon request.',
                    },
                    {
                      question: 'Do I need to provide cleaning supplies?',
                      answer:
                        'No! We bring all professional-grade cleaning supplies and equipment. However, if you have specific products you prefer, we can use those instead.',
                    },
                    {
                      question: 'Are your cleaning products safe for pets and children?',
                      answer:
                        'Yes! We use eco-friendly, non-toxic cleaning products that are safe for pets and children. We can also accommodate any specific product requests you may have.',
                    },
                    {
                      question: 'How often should I schedule cleaning services?',
                      answer:
                        'This depends on your needs. Many of our clients choose weekly, bi-weekly, or monthly cleaning. We also offer one-time deep cleaning for special occasions.',
                    },
                    {
                      question: 'Do you offer a satisfaction guarantee?',
                      answer:
                        'Absolutely! If you\'re not completely satisfied with our cleaning, please let us know within 24 hours and we\'ll return to address any concerns at no additional cost.',
                    },
                    {
                      question: 'What payment methods do you accept?',
                      answer:
                        'We accept all major credit/debit cards, cash, checks, and digital payments like Zelle, PayPal, and Venmo. We also offer subscription plans for regular cleaning.',
                    },
                  ].map((faq, index) => (
                    <div className="accordion-item mb-3 shadow-sm rounded-3 border-0" key={index}>
                      <h3 className="accordion-header">
                        <button
                          className="accordion-button fw-bold fs-5 py-3 px-4 collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq-${index}`}
                          aria-expanded="false"
                          aria-controls={`faq-${index}`}
                          style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            transition: 'box-shadow 0.3s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)')}
                          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                        >
                          <span className="me-3">🧹</span>
                          {faq.question}
                        </button>
                      </h3>
                      <div id={`faq-${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body py-4 px-4 fs-5 text-muted">{faq.answer}</div>
                      </div>
                    </div>
                  ))}
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