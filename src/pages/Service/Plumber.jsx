import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ErrorBoundary removed to fix the error (class fields are not supported in some setups without extra Babel plugins)

const Plumber = () => {
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

  // Initialize Bootstrap carousel after component mounts
  useEffect(() => {
    let script;
    const loadBootstrapJS = () => {
      script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (carouselRef.current && window.bootstrap) {
          new window.bootstrap.Carousel(carouselRef.current, {
            interval: false,
            ride: false,
          });
        }
      };
    };

    if (typeof window.bootstrap === 'undefined') {
      loadBootstrapJS();
    } else if (carouselRef.current && window.bootstrap) {
      new window.bootstrap.Carousel(carouselRef.current, {
        interval: false,
        ride: false,
      });
    }

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <style>
        {`
          .hero-slider {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
            transform: scale(0.5);
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
            background-color: #ef4444;
            border: none;
            color: white;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .btn-book-now:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
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
            color: #0d6efd;
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
            scrollbar-color: #032455ff #f8f9fa;
          }

          .review-scroller::-webkit-scrollbar {
            height: 8px;
          }

          .review-scroller::-webkit-scrollbar-track {
            background: #e2eaf2ff;
            border-radius: 4px;
          }

          .review-scroller::-webkit-scrollbar-thumb {
            background-color: #0d6efd;
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
            color: #d97706;
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
                { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', alt: 'Plumbing Tools' },
                { src: 'https://images.unsplash.com/photo-1676210134188-4c05dd172f89?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Bathroom Plumbing' },
                { src: 'https://images.unsplash.com/photo-1622128109828-306c6fb4b119?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHBsdW1iaW5nfGVufDB8fDB8fHwy', alt: 'Pipe Installation' },
              ].map((img, i) => (
                <div key={i} className={`carousel-item${i === 0 ? ' active' : ''}`}>
                  <img src={img.src} alt={img.alt} />
                  <div className="blur-box">
                    <h1 className="animated-text">Expert Plumbing Services</h1>
                    <p className="lead-text">Fast, Reliable & Affordable Solutions</p>
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

        {/* About Us Section — MOVED HERE */}
        <section id="about" className="py-5 bg-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="mb-4 display-6">About Our Services</h2>
                <p className="lead">
                  With 20+ years of experience, our certified plumbers provide professional solutions for leaks, installations, and emergencies.
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

        {/* Services Section */}
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
                {
                  title: 'Installation',
                  desc: 'Professional pipe and fixture installations with guaranteed quality workmanship.',
                  img: 'https://images.unsplash.com/photo-1749532125405-70950966b0e5?q=80&w=1000',
                },
                {
                  title: 'Repairs',
                  desc: 'Reliable leak and clog repairs with same-day service available.',
                  img: 'https://images.unsplash.com/photo-1553265381-674034b34554?q=80&w=1280&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Maintenance',
                  desc: 'Keep systems running smoothly with our preventative maintenance plans.',
                  img: 'https://plus.unsplash.com/premium_photo-1663133566549-47a5e7fabe4b?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Emergency Services',
                  desc: '24/7 urgent plumbing support with rapid response times.',
                  img: 'https://images.unsplash.com/photo-1606613945100-08e66012e49e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEwfHxlbWVyZ2VuY3l8ZW58MHx8MHx8fDI%3D',
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

        {/* Reviews Section — Scrollable Horizontal Layout */}
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
                        name: 'John D.',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        review: 'Fixed my leak fast! The plumber arrived within an hour and had it fixed in no time.',
                        rating: 4,
                      },
                      {
                        name: 'Sarah K.',
                        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                        review: "Professional and friendly team. They explained everything clearly and didn't overcharge me. Highly recommend!",
                        rating: 5,
                      },
                      {
                        name: 'Mike R.',
                        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
                        review: "Affordable and reliable service. I've used them three times now and they always deliver quality work.",
                        rating: 5,
                      },
                      {
                        name: 'Lisa M.',
                        avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
                        review: 'Emergency call at midnight — they came fast and fixed our issue. Lifesavers!',
                        rating: 5,
                      },
                      {
                        name: 'David T.',
                        avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
                        review: 'Installed a new system safely and efficiently. Explained everything clearly.',
                        rating: 5,
                      },
                      {
                        name: 'Emma R.',
                        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
                        review: 'Fast, reliable, and affordable. They’ve become our go-to for all plumbing needs.',
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
                <p className="lead text-muted">Everything you need to know about our plumbing services.</p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="accordion" id="faqAccordion">
                  {[
                    {
                      question: 'What areas do you service?',
                      answer:
                        'We proudly serve the Greater Metro Area, including Downtown, Northside, East Valley, and West Hills. Contact us to confirm if we cover your neighborhood!',
                    },
                    {
                      question: 'Do you offer emergency services?',
                      answer:
                        'Yes! We provide 24/7 emergency plumbing support for burst pipes, major leaks, sewer backups, and no-water situations. Call us anytime — we’ll be there fast.',
                    },
                    {
                      question: 'Are your plumbers licensed and insured?',
                      answer:
                        'Absolutely. All our technicians are fully licensed, bonded, and insured. Your safety and satisfaction are guaranteed with every job.',
                    },
                    {
                      question: 'How quickly can you respond to a service call?',
                      answer:
                        'For emergencies, we aim to arrive within 60 minutes. For non-urgent requests, we typically schedule same-day or next-day appointments.',
                    },
                    {
                      question: 'Do you provide free estimates?',
                      answer:
                        'Yes! We offer free, no-obligation estimates for all installations, replacements, and major repairs. Just give us a call or book online.',
                    },
                    {
                      question: 'What payment methods do you accept?',
                      answer:
                        'We accept all major credit/debit cards, cash, checks, and digital payments like Zelle and PayPal. Financing options are also available for larger projects.',
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
                          <span className="me-3">💧</span>
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
    </>
  );
};

export default Plumber;