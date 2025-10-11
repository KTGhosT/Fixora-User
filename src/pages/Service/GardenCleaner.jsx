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

const GardenCleaner = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Initialize Bootstrap carousel and auto-scroll
  useEffect(() => {
    let carouselInstance = null;
    let autoScrollInterval = null;

    const initializeCarousel = () => {
      if (carouselRef.current && window.bootstrap) {
        // Initialize Bootstrap carousel
        carouselInstance = new window.bootstrap.Carousel(carouselRef.current, {
          interval: false, // Disable Bootstrap's auto interval
          ride: false,
          wrap: true
        });

        // Set up custom auto-scroll
        autoScrollInterval = setInterval(() => {
          if (carouselInstance) {
            carouselInstance.next();
          }
        }, 4000);
      }
    };

    // Load Bootstrap if not available
    if (typeof window.bootstrap === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      script.onload = initializeCarousel;
      document.body.appendChild(script);
    } else {
      initializeCarousel();
    }

    // Cleanup function
    return () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
      if (carouselInstance) {
        carouselInstance.dispose();
      }
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
            height: calc(100vh - 80px);
            margin-top: 80px;
            overflow: hidden;
            background-color: transparent;

          }

          .carousel-item {
             position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            transition: transform 0.6s ease-in-out;
          }

          .carousel-item img {
           width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
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

          /* Static Text */
          .animated-text {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: white;
          }

          .lead-text {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }

          .btn-book-now {
            background-color: #1B5E20;
            border: none;
            color: white;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(27, 94, 32, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .btn-book-now:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(27, 94, 32, 0.4);
          }

          /* Carousel Controls */
          .carousel-control-prev,
          .carousel-control-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.5);
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
          }

          .carousel-control-prev {
            left: 30px;
          }

          .carousel-control-next {
            right: 30px;
          }

          .carousel-control-prev:hover,
          .carousel-control-next:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: translateY(-50%) scale(1.1);
          }

          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            width: 20px;
            height: 20px;
            background-size: 100% 100%;
          }

          /* Carousel Indicators */
          .carousel-indicators {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
          }

          .carousel-indicators button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            background: transparent;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .carousel-indicators button.active {
            background: white;
            border-color: white;
            transform: scale(1.2);
          }

          .carousel-indicators button:hover {
            border-color: white;
            background: rgba(255, 255, 255, 0.7);
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
            color: #1B5E20;
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
            scrollbar-color: #1B5E20 #f8f9fa;
          }

          .review-scroller::-webkit-scrollbar {
            height: 8px;
          }

          .review-scroller::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 4px;
          }

          .review-scroller::-webkit-scrollbar-thumb {
            background-color: #1B5E20;
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
            color: #1B5E20;
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
                { src: 'https://images.unsplash.com/photo-1734079692160-fcbe4be6ab96?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Garden Maintenance' },
                { src: 'https://images.unsplash.com/photo-1689728318937-17d24bc0a65c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGdhcmRlbiUyMGNsZWFuZXJ8ZW58MHx8MHx8fDI%3D', alt: 'Lawn Care' },
                { src: 'https://images.unsplash.com/photo-1668189777890-495c36095340?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGdhcmRlbiUyMGNsZWFuZXJ8ZW58MHx8MHx8fDI%3D', alt: 'Landscaping' },
              ].map((img, i) => (
                <div key={i} className={`carousel-item${i === 0 ? ' active' : ''}`}>
                  <img src={img.src} alt={img.alt} />
                  <div className="blur-box">
                    <h1 className="animated-text">Expert Garden Cleaning Services</h1>
                    <p className="lead-text">Beautiful, Well-Maintained Gardens</p>
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
                  With 20+ years of experience, our professional gardeners provide comprehensive solutions for lawn care, landscaping, and garden maintenance.
                </p>
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
                <p className="lead">We offer comprehensive garden cleaning solutions for residential and commercial properties.</p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {[
                {
                  title: 'Lawn Mowing',
                  desc: 'Regular lawn maintenance to keep your grass looking perfect.',
                  img: 'https://images.unsplash.com/photo-1683316924890-6a8c5ab10d29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FyZGVuJTIwY2xlYW5lcnxlbnwwfHwwfHx8Mg%3D%3D',
                },
                {
                  title: 'Weed Control',
                  desc: 'Effective weed removal and prevention for healthy gardens.',
                  img: 'https://images.unsplash.com/photo-1621958206813-2e9c0441c5b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FyZGVuJTIwY2xlYW5lcnxlbnwwfHwwfHx8Mg%3D%3D',
                },
                {
                  title: 'Pruning & Trimming',
                  desc: 'Professional pruning of trees, shrubs, and hedges.',
                  img: 'https://images.unsplash.com/photo-1651289082712-bedffb9434fd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Garden Cleanup',
                  desc: 'Complete garden cleanup including leaf removal and debris clearing.',
                  img: 'https://images.unsplash.com/photo-1724556295135-ff92b9aa0a55?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGdhcmRlbiUyMGNsZWFuZXJ8ZW58MHx8MHx8fDI%3D',
                },
              ].map((s, i) => (
                <div key={i} className="col-md-6 col-lg-3">
                  <div className="service-card">
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
                        name: 'Susan P.',
                        avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
                        review: 'Transformed our overgrown garden into a beautiful oasis!',
                        rating: 5,
                      },
                      {
                        name: 'Mike T.',
                        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
                        review: 'Consistent, reliable service. Our lawn has never looked better.',
                        rating: 4,
                      },
                      {
                        name: 'Carol L.',
                        avatar: 'https://randomuser.me/api/portraits/women/78.jpg',
                        review: 'Professional team that takes pride in their work. Highly recommend!',
                        rating: 5,
                      },
                      {
                        name: 'Anna K.',
                        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
                        review: 'Best gardening service I\'ve ever used. My garden sparkles!',
                        rating: 5,
                      },
                      {
                        name: 'David S.',
                        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                        review: 'Reliable, trustworthy, and does an amazing job every time.',
                        rating: 5,
                      },
                      {
                        name: 'Rachel B.',
                        avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
                        review: 'Perfect for our busy family. Worth every penny!',
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
                <p className="lead text-muted">Everything you need to know about our garden cleaning services.</p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="accordion" id="faqAccordion">
                  {[
                    {
                      question: 'How often should I schedule garden maintenance?',
                      answer:
                        'For most gardens, we recommend weekly or bi-weekly maintenance during the growing season (spring-fall) and monthly during winter months.',
                    },
                    {
                      question: 'Do you provide your own equipment?',
                      answer:
                        'Yes! We bring all necessary equipment including lawnmowers, trimmers, leaf blowers, and gardening tools. We also provide all materials like mulch, fertilizer, and plants.',
                    },
                    {
                      question: 'Are your gardening products environmentally friendly?',
                      answer:
                        'Absolutely. We prioritize organic and eco-friendly products for fertilizers, weed control, and pest management. We can also create a completely organic maintenance plan for your garden.',
                    },
                    {
                      question: 'Can you work with my existing garden design?',
                      answer:
                        'Yes! We can maintain your existing garden design or work with you to create improvements. We also offer full landscape design services if you want to transform your outdoor space.',
                    },
                    {
                      question: 'Do you offer seasonal cleanup services?',
                      answer:
                        'Yes! We offer specialized seasonal cleanup services including spring cleanup, summer maintenance, fall leaf removal, and winter preparation.',
                    },
                    {
                      question: 'What payment methods do you accept?',
                      answer:
                        'We accept all major credit/debit cards, cash, checks, and digital payments like Zelle, PayPal, and Venmo. We also offer subscription plans for regular maintenance.',
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
                          <span className="me-3">🌿</span>
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

export default GardenCleaner;