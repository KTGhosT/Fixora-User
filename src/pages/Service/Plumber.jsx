import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Plumber = () => {
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
}

          .carousel {
            width: 100%;
            height: 100%;
          }

          .carousel-inner {
            width: 100%;
            height: 100%;
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

          .carousel-item.active {
            display: block;
          }

          /* Blur Box Overlay */
          .blur-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90%;
            width: 100%;
            max-width: 800px;
            padding: 3rem 2rem;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            text-align: center;
            z-index: 10;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
            line-height: 1.2;
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
            opacity: 0.95;
            line-height: 1.4;
          }

          .btn-book-now {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border: none;
            color: white;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 50px;
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
            transition: all 0.3s ease;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .btn-book-now:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(239, 68, 68, 0.5);
            background: linear-gradient(135deg, #dc2626, #b91c1c);
          }

          /* Responsive */
          @media (max-width: 768px) {
            .blur-box {
              padding: 2rem 1.5rem;
              max-width: 95%;
            }
            .animated-text {
              font-size: 2.2rem;
            }
            .lead-text {
              font-size: 1.2rem;
            }
            .btn-book-now {
              padding: 0.8rem 1.5rem;
              font-size: 1rem;
            }
          }

          @media (max-width: 576px) {
            .blur-box {
              padding: 1.5rem 1rem;
            }
            .animated-text {
              font-size: 1.8rem;
            }
            .lead-text {
              font-size: 1.1rem;
            }
            .btn-book-now {
              padding: 0.7rem 1.2rem;
              font-size: 0.9rem;
            }
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
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            background: white;
            height: 100%;
          }

          .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          }

          .service-img {
            width: 100%;
            height: 220px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .service-card:hover .service-img {
            transform: scale(1.1);
          }

          .service-title {
            font-size: 1.4rem;
            color: #0d6efd;
            margin-bottom: 0.8rem;
            font-weight: 700;
          }

          .service-desc {
            color: #6c757d;
            font-size: 1rem;
            line-height: 1.6;
            text-align: center;
            margin-bottom: 0;
          }

          .service-card .p-4 {
            padding: 1.5rem !important;
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
            background: #032455ff;
            border-radius: 4px;
          }

          .review-scroller::-webkit-scrollbar-thumb:hover {
            background: #0056b3;
          }

          .review-row {
            display: flex;
            gap: 20px;
            padding: 0 20px;
            min-width: max-content;
          }

          .review-card {
            flex: 0 0 auto;
            min-width: 300px;
            max-width: 350px;
          }

          .review-card .card {
            height: 100%;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 12px;
          }

          .review-card .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }

          .stars {
            color: #ffc107;
            font-size: 1.2rem;
            letter-spacing: 2px;
          }

          /* Responsive adjustments */
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
            .review-row {
              gap: 15px;
              padding: 0 15px;
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

        {/* Full-Screen Hero Carousel */}
        <section className="hero-slider">
          <div ref={carouselRef} className="carousel slide" data-bs-ride="carousel" id="heroCarousel">
            <div className="carousel-inner">
              {[
                { src: '/src/assets/user/plumber2.jpg', alt: 'Plumbing Tools' },
                { src: '/src/assets/user/plumber1.jpg', alt: 'Bathroom Plumbing' },
                { src: '/src/assets/user/plumber3.jpg', alt: 'Pipe Installation' },
              ].map((img, i) => (
                <div key={i} className={`carousel-item${i === 0 ? ' active' : ''}`}>
                  <img src={img.src} alt={img.alt} />
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
                <h2 className="mb-4 display-6">About Our Sri Lankan Plumbing Experts</h2>
                <p className="lead">
                  With over 15 years of experience serving homes and businesses across Sri Lanka, our certified local plumbers understand the unique plumbing challenges of tropical climate and provide reliable solutions for water supply, drainage, and emergency repairs.
                </p>
                <div className="row mt-5 text-center">
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">15+</h3>
                      <p className="text-muted">Years in Sri Lanka</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">800+</h3>
                      <p className="text-muted">Local Projects</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4">
                      <h3 className="display-4 fw-bold text-primary">95%</h3>
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
                <h2 className="mb-5">Our Specialized Sri Lankan Plumbing Services</h2>
                <p className="lead">We provide comprehensive plumbing solutions tailored for Sri Lankan homes and businesses, addressing tropical climate challenges and local infrastructure needs.</p>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              {[
                {
                  title: 'Water Tank Installation',
                  desc: 'Professional installation and maintenance of overhead and underground water tanks for reliable water storage.',
                  img: 'https://images.unsplash.com/photo-1749532125405-70950966b0e5?q=80&w=1000',
                },
                {
                  title: 'Monsoon Drainage Solutions',
                  desc: 'Specialized drainage systems and repairs to handle heavy monsoon rains and prevent flooding.',
                  img: 'https://images.unsplash.com/photo-1553265381-674034b34554?q=80&w=1280&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: 'Bore Well Services',
                  desc: 'Complete bore well drilling, pump installation, and maintenance for reliable groundwater access.',
                  img: 'https://plus.unsplash.com/premium_photo-1663133566549-47a5e7fabe4b?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                {
                  title: '24/7 Emergency Response',
                  desc: 'Round-the-clock emergency plumbing services across Colombo, Kandy, Galle, and surrounding areas.',
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
                        name: 'Pradeep S.',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        review: 'Excellent service! They fixed our water tank leak during the monsoon season. Very reliable Sri Lankan plumbers.',
                        rating: 5,
                      },
                      {
                        name: 'Chamari P.',
                        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                        review: "Professional team from Colombo. They installed our bore well pump system perfectly. Highly recommend for any plumbing work!",
                        rating: 5,
                      },
                      {
                        name: 'Roshan M.',
                        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
                        review: "Best plumbing service in Kandy area. They understand local water pressure issues and provided perfect solutions.",
                        rating: 5,
                      },
                      {
                        name: 'Nimalka R.',
                        avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
                        review: 'Emergency call during heavy rains in Galle — they came quickly and fixed our drainage problem. Excellent local service!',
                        rating: 5,
                      },
                      {
                        name: 'Kasun T.',
                        avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
                        review: 'Installed overhead water tank system for our new house in Negombo. Professional work and fair pricing.',
                        rating: 5,
                      },
                      {
                        name: 'Sanduni W.',
                        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
                        review: 'Reliable and honest plumbers. They have been maintaining our apartment complex in Mount Lavinia for 3 years.',
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
                      question: 'Which areas in Sri Lanka do you service?',
                      answer:
                        'We provide plumbing services across major cities including Colombo, Kandy, Galle, Negombo, Mount Lavinia, Dehiwala, and surrounding suburban areas. Contact us to confirm coverage in your specific location.',
                    },
                    {
                      question: 'Do you provide emergency services during monsoon season?',
                      answer:
                        'Yes! We offer 24/7 emergency plumbing services, especially crucial during monsoon seasons for drainage blockages, water tank overflows, and flood-related plumbing issues. Our rapid response team is always ready.',
                    },
                    {
                      question: 'Are your plumbers certified for Sri Lankan standards?',
                      answer:
                        'Absolutely. All our technicians are certified according to Sri Lankan plumbing standards, fully licensed, and experienced with local water supply systems, bore wells, and tropical climate challenges.',
                    },
                    {
                      question: 'How quickly can you respond in Colombo and suburbs?',
                      answer:
                        'For emergency calls in Colombo metropolitan area, we typically arrive within 45-60 minutes. For other cities like Kandy or Galle, response time is usually 1-2 hours depending on location and traffic conditions.',
                    },
                    {
                      question: 'Do you install and maintain water tanks and bore wells?',
                      answer:
                        'Yes! We specialize in overhead water tank installation, underground tank systems, bore well drilling, water pump installation, and complete water storage solutions suitable for Sri Lankan homes and businesses.',
                    },
                    {
                      question: 'What payment methods do you accept in Sri Lanka?',
                      answer:
                        'We accept cash payments in Sri Lankan Rupees, bank transfers, mobile payments through eZ Cash and mCash, and major credit/debit cards. We also offer flexible payment plans for larger projects like bore well installations.',
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
    </>
  );
};

export default Plumber;