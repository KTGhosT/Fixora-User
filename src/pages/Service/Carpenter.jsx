import React, { Component, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import local carpenter images
import carpenter1 from '../../assets/user/carpenter1.jpg';
import carpenter2 from '../../assets/user/carpenter2.jpg';
import carpenter3 from '../../assets/user/carpenter3.jpg';

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

const Carpenter = () => {
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

          /* Text Overlay */
          .text-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 800px;
            padding: 2rem;
            color: white;
            text-align: center;
            z-index: 2;
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
            background-color: #D2691E;
            border: none;
            color: white;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(210, 105, 30, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .btn-book-now:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(210, 105, 30, 0.4);
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
            color: #8B4513;
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
            scrollbar-color: #8B4513 #f8f9fa;
          }

          .review-scroller::-webkit-scrollbar {
            height: 8px;
          }

          .review-scroller::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 4px;
          }

          .review-scroller::-webkit-scrollbar-thumb {
            background-color: #8B4513;
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
            color: #D2691E;
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
          <div ref={carouselRef} className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000" id="heroCarousel">
            <div className="carousel-inner">
              {[
                { src: carpenter2, alt: 'Woodworking' },
                { src: carpenter1, alt: 'Carpentry Tools' },
                { src: carpenter3, alt: 'Furniture Making' },
              ].map((img, i) => (
                <div key={i} className={`carousel-item${i === 0 ? ' active' : ''}`}>
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    style={i === 2 ? { 
                      objectFit: 'cover', 
                      objectPosition: 'center center',
                      width: '100%',
                      height: '100%'
                    } : {}}
                  />
                  <div className="text-overlay">
                    <h1 className="animated-text">Expert Carpenter Services</h1>
                    <p className="lead-text">Precision Craftsmanship & Quality Woodwork</p>
                    <button
                      className="btn-book-now"
                      onClick={() => navigate('/Booking')}
                    >
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
                  With 20+ years of experience, our master carpenters provide professional solutions for custom furniture, repairs, and installations.
                </p>
                <div className="row mt-5 text-center">
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-warning">20+</h3>
                      <p className="text-muted">Years Experience</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-warning">500+</h3>
                      <p className="text-muted">Projects Completed</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-warning">98%</h3>
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
                <p className="lead">We offer comprehensive carpentry solutions for residential and commercial properties.</p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {[
                {
                  title: 'Custom Furniture',
                  desc: 'Handcrafted tables, chairs, cabinets and more tailored to your specifications.',
                  img: 'https://images.unsplash.com/photo-1687422810663-c316494f725a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Repairs & Restoration',
                  desc: 'Expert repair of damaged wood furniture and restoration of antique pieces.',
                  img: 'https://images.unsplash.com/photo-1708889404035-8b596c5c51a2?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Cabinetry',
                  desc: 'Custom kitchen and bathroom cabinets designed for your space and needs.',
                  img: 'https://images.unsplash.com/photo-1646324554833-f0b6a479fa5d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Deck & Fence Building',
                  desc: 'Professional construction of decks, fences, and outdoor wooden structures.',
                  img: 'https://images.unsplash.com/photo-1708889404014-2a3eee420ca0?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
                        name: 'Robert J.',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        review: 'Built a custom dining table for us - absolutely stunning craftsmanship!',
                        rating: 5,
                      },
                      {
                        name: 'Emily T.',
                        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                        review: "Restored my grandmother's antique cabinet - looks better than new! Highly recommend.",
                        rating: 5,
                      },
                      {
                        name: 'David M.',
                        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
                        review: 'Professional, punctual, and the quality of work exceeded my expectations.',
                        rating: 4,
                      },
                      {
                        name: 'Susan P.',
                        avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
                        review: 'Transformed our overgrown garden into a beautiful oasis!',
                        rating: 5,
                      },
                      {
                        name: 'Mike T.',
                        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
                        review: 'Consistent, reliable service. Our furniture has never looked better.',
                        rating: 5,
                      },
                      {
                        name: 'Carol L.',
                        avatar: 'https://randomuser.me/api/portraits/women/78.jpg',
                        review: 'Professional team that takes pride in their work. Highly recommend!',
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
                <p className="lead text-muted">Everything you need to know about our carpentry services.</p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="accordion" id="faqAccordion">
                  {[
                    {
                      question: 'What types of wood do you work with?',
                      answer:
                        'We work with a wide variety of woods including oak, maple, cherry, walnut, pine, and exotic hardwoods. We can recommend the best wood for your project based on your needs and budget.',
                    },
                    {
                      question: 'How long does a custom furniture project take?',
                      answer:
                        'Timeline varies based on complexity, but most custom furniture projects take 4-8 weeks from design to completion. We provide detailed timelines during our consultation.',
                    },
                    {
                      question: 'Do you offer design services?',
                      answer:
                        'Yes! Our master carpenters provide complete design services, including 3D renderings, material selection, and space planning to ensure your vision comes to life.',
                    },
                    {
                      question: 'Can you match existing furniture or woodwork?',
                      answer:
                        'Absolutely. We specialize in matching existing finishes, styles, and wood grains to create seamless additions or repairs to your current furniture or woodwork.',
                    },
                    {
                      question: 'Do you provide free estimates?',
                      answer:
                        'Yes! We offer free, no-obligation estimates for all projects. Our estimates include detailed breakdowns of materials, labor, and timeline.',
                    },
                    {
                      question: 'What warranty do you offer on your work?',
                      answer:
                        'We stand behind our craftsmanship with a 2-year warranty on all workmanship. Materials are covered by their respective manufacturer warranties.',
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
                          <span className="me-3">🪵</span>
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

export default Carpenter;