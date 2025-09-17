import React, { Component, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const Electrician = () => {
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

  // Auto-scroll reviews every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const reviewCarousel = document.getElementById('reviewCarousel');
      if (reviewCarousel) {
        const nextButton = reviewCarousel.querySelector('.carousel-control-next');
        if (nextButton) {
          nextButton.click();
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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

    if (typeof window.bootstrap === 'undefined') {
      loadBootstrapJS();
    }

    if (carouselRef.current) {
      const carouselElement = carouselRef.current;
      if (carouselElement && typeof window.bootstrap !== 'undefined') {
        new window.bootstrap.Carousel(carouselElement, {
          interval: false,
          ride: false,
        });
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      {/* Bootstrap CSS */
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
            background-color: #D32F2F;
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
            background-color: #C62828;
            border: none;
            color: white;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(198, 40, 40, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .btn-book-now:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(198, 40, 40, 0.4);
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
            color: #C62828;
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
            scrollbar-color: #C62828 #f8f9fa;
          }

          .review-scroller::-webkit-scrollbar {
            height: 8px;
          }

          .review-scroller::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 4px;
          }

          .review-scroller::-webkit-scrollbar-thumb {
            background-color: #C62828;
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
            color: #C62828;
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
                { src: 'https://images.unsplash.com/photo-1742416180133-cd9ab0816259?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Electrical Work' },
                { src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Wiring Installation' },
                { src: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Electrical Panel' },
              ].map((img, i) => (
                <div key={i} className={`carousel-item${i === 0 ? ' active' : ''}`}>
                  <img src={img.src} alt={img.alt} />
                  <div className="blur-box">
                    <h1 className="animated-text">Expert Electrician Services</h1>
                    <p className="lead-text">Professional Electrical Solutions</p>
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
                  aria-current={i === 0 ? 'true' : 'false'}
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
                  With 20+ years of experience, our certified electricians provide professional solutions for wiring, installations, and electrical emergencies.
                </p>
                <div className="row mt-5 text-center">
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-danger">20+</h3>
                      <p className="text-muted">Years Experience</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-danger">1000+</h3>
                      <p className="text-muted">Projects Completed</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-danger">99%</h3>
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
                <p className="lead">We offer comprehensive electrical solutions for residential and commercial properties.</p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {[
                {
                  title: 'Wiring Installation',
                  desc: 'Professional installation of residential and commercial electrical systems.',
                  img: 'https://images.unsplash.com/photo-1597502310092-31cdaa35b46d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Repairs & Maintenance',
                  desc: 'Fast and reliable repair of electrical faults and routine maintenance.',
                  img: 'https://images.unsplash.com/photo-1595856898575-9d187bd32fd6?q=80&w=1097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Lighting Solutions',
                  desc: 'Custom lighting design and installation for homes and businesses.',
                  img: 'https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Panel Upgrades',
                  desc: 'Modern electrical panel upgrades to meet current safety standards.',
                  img: 'https://images.unsplash.com/photo-1676630444903-163fe485c5d1?q=80&w=1126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
                        name: 'James R.',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        review: 'Fixed our electrical panel quickly and professionally. Highly recommended!',
                        rating: 5,
                      },
                      {
                        name: 'Lisa M.',
                        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                        review: 'Installed new lighting throughout our home. Excellent workmanship!',
                        rating: 4,
                      },
                      {
                        name: 'Tom K.',
                        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
                        review: 'Emergency service at 2 AM - saved us from a potential fire hazard.',
                        rating: 5,
                      },
                      {
                        name: 'Susan P.',
                        avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
                        review: 'Upgraded our old electrical panel to handle modern appliances.',
                        rating: 5,
                      },
                      {
                        name: 'Mike T.',
                        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
                        review: 'Professional, knowledgeable, and did the job right the first time.',
                        rating: 5,
                      },
                      {
                        name: 'Carol L.',
                        avatar: 'https://randomuser.me/api/portraits/women/78.jpg',
                        review: 'Fair pricing and excellent customer service. Will use again!',
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
                <p className="lead text-muted">Everything you need to know about our electrical services.</p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="accordion" id="faqAccordion">
                  {[
                    {
                      question: 'Are you licensed and insured?',
                      answer:
                        'Yes! All our electricians are fully licensed, bonded, and insured. We comply with all local and national electrical codes.',
                    },
                    {
                      question: 'Do you offer emergency services?',
                      answer:
                        'Absolutely. We provide 24/7 emergency electrical services for power outages, electrical fires, and other urgent situations.',
                    },
                    {
                      question: 'How quickly can you respond to a service call?',
                      answer:
                        'For emergencies, we aim to arrive within 60 minutes. For non-urgent requests, we typically schedule same-day or next-day appointments.',
                    },
                    {
                      question: 'Do you provide free estimates?',
                      answer:
                        'Yes! We offer free, no-obligation estimates for all electrical installations, upgrades, and major repairs.',
                    },
                    {
                      question: 'What areas do you service?',
                      answer:
                        'We serve the Greater Metro Area, including Downtown, Northside, East Valley, and West Hills. Contact us to confirm if we cover your neighborhood!',
                    },
                    {
                      question: 'What payment methods do you accept?',
                      answer:
                        'We accept all major credit/debit cards, cash, checks, and digital payments like Zelle and PayPal.',
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
                          <span className="me-3">⚡</span>
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

export default Electrician;