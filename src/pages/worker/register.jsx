import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, ProgressBar, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './register.module.css';
import axiosInstance from "../../services/api";

const RegisterPage = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: "Electrician",
      company: "ServicePro",
      location: "Los Angeles, CA",
      salary: "$45,000 - $70,000",
      description: "We're looking for an experienced electrician to work on residential and commercial electrical systems. Must have 3+ years experience and valid certification.",
      image: "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      type: "Full-time",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Plumber",
      company: "PipeMaster",
      location: "Chicago, IL",
      salary: "$40,000 - $65,000",
      description: "Join our team as a licensed plumber to handle installations and repairs. Commercial and residential projects available.",
      image: "https://images.unsplash.com/photo-1633886038250a4d2c1cfd667c6d115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      type: "Full-time",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Cleaner",
      company: "CleanSolutions",
      location: "Miami, FL",
      salary: "$25,000 - $35,000",
      description: "Looking for reliable cleaners to maintain our commercial properties. Flexible hours and competitive pay.",
      image: "https://images.unsplash.com/photo-1581578731546-cb6c52ae8c59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      type: "Part-time",
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "Gardener",
      company: "GreenThumb",
      location: "Seattle, WA",
      salary: "$30,000 - $45,000",
      description: "We need gardeners to maintain beautiful landscapes and outdoor spaces. Plant knowledge and maintenance skills required.",
      image: "https://images.unsplash.com/photo-1581578731543-d6c4aee1520d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      type: "Contract",
      posted: "5 days ago"
    }
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    experience_level: '',
    availability: '',
    short_info: '',
    jobId: null,
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      title: "Find Your Dream Job",
      subtitle: "Connect with top employers in the trades industry"
    },
    {
      image: "https://images.unsplash.com/photo-1581578731543-d6c4aee1520d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      title: "Skilled Professionals Wanted",
      subtitle: "Immediate openings with competitive pay"
    },
    {
      image: "https://images.unsplash.com/photo-1581578731546-cb6c52ae8c59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      title: "Build Your Career",
      subtitle: "Grow with companies that value your skills"
    }
  ];

  // Auto slide with useCallback to prevent unnecessary recreations
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setFormData((prev) => ({ ...prev, jobId: job.id }));
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedJob(null);
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      address: '',
      experience_level: '',
      availability: '',
      short_info: '',
      jobId: null,
    });
    setSuccess(false);
    setErrors({});
    setProgress(0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(formData.phone_number.replace(/\D/g, ''))) newErrors.phone_number = 'Phone number is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.experience_level.trim()) newErrors.experience_level = 'Experience level is required';
    if (!formData.availability.trim()) newErrors.availability = 'Availability is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleProgress = () => {
    setProgress((prev) => Math.min(prev + 25, 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    handleProgress();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await axiosInstance.post('api/worker/register', formDataToSend, {
        // Do NOT set Content-Type header here
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      handleProgress();
      setSuccess(true);
      setTimeout(handleClose, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
      setErrors({ submit: errorMessage });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
      handleProgress();
    }
  };

  // Filter jobs by category
  const filteredJobs = activeCategory === 'all' 
    ? jobs 
    : jobs.filter(job => job.title.toLowerCase() === activeCategory.toLowerCase());

  return (
    <Container fluid className="p-0">
      {/* Hero Slider Section */}
      <div className={styles['slider-container']}>
        <div className={styles.slider}>
          <img 
            src={slides[currentSlide].image} 
            alt={`Slide ${currentSlide}`} 
            className={styles['slide-image']} 
          />
          <div className={styles['slider-overlay']}>
            <div className={styles['slider-content']}>
              <h1 className={styles['slider-title']}>{slides[currentSlide].title}</h1>
              <p className={styles['slider-subtitle']}>{slides[currentSlide].subtitle}</p>
              <div className={styles['job-categories']}>
                <button 
                  className={`${styles.category} ${activeCategory === 'all' ? styles.active : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Jobs
                </button>
                {jobs.map((job) => (
                  <button 
                    key={job.id} 
                    className={`${styles.category} ${activeCategory === job.title.toLowerCase() ? styles.active : ''}`}
                    onClick={() => setActiveCategory(job.title.toLowerCase())}
                  >
                    {job.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button className={`${styles['slider-btn']} ${styles.prev}`} onClick={prevSlide} aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className={`${styles['slider-btn']} ${styles.next}`} onClick={nextSlide} aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <div className={styles['slider-dots']}>
            {slides.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <h2 className={styles['section-title']}>Available Positions</h2>
            <p className={styles['section-subtitle']}>
              Browse through our current job openings and find the perfect match for your skills
            </p>
          </Col>
        </Row>
        <Row>
          {filteredJobs.map((job) => (
            <Col md={6} lg={4} xl={3} key={job.id} className="mb-4">
              <Card className={`${styles['job-card']} h-100`}>
                <div className={styles['job-image-container']}>
                  <img
                    src={job.image}
                    alt={job.title}
                    className={styles['job-image']}
                  />
                  <Badge bg="primary" className={styles['job-type']}>{job.type}</Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <span className={styles['posted-date']}>{job.posted}</span>
                  </div>
                  <Card.Title className={styles['job-title']}>{job.title}</Card.Title>
                  <Card.Subtitle className={`mb-2 ${styles['company-name']}`}>{job.company}</Card.Subtitle>
                  <div className={`mb-3 ${styles['job-details']}`}>
                    <div className={styles['job-detail']}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className={styles['job-detail']}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <Card.Text className={`flex-grow-1 ${styles['job-description']}`}>
                    {job.description}
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleJobClick(job)} 
                    className={`mt-auto ${styles['apply-button']}`}
                  >
                    Apply Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Registration Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered className={styles.modal}>
        <Modal.Header closeButton className={styles['modal-header']}>
          <Modal.Title className={styles['modal-title']}>
            Apply for {selectedJob?.title} at {selectedJob?.company}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles['modal-body']}>
          {success ? (
            <div className={styles['success-container']}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles['success-icon']}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className={styles['success-title']}>Application Submitted!</h4>
              <p className={styles['success-message']}>
                Thank you for applying to {selectedJob?.title} at {selectedJob?.company}. 
                We'll review your application and contact you soon.
              </p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit} className={styles.form}>
              <div className="mb-4">
                <h5 className={styles['form-section-title']}>Personal Information</h5>
                <ProgressBar now={progress} className={`mb-3 ${styles.progress}`} />
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles['form-label']}>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        placeholder="Enter your full name"
                        className={styles['form-control']}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles['form-label']}>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="Enter your email"
                        className={styles['form-control']}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles['form-label']}>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        isInvalid={!!errors.phone_number}
                        placeholder="Enter your phone number"
                        className={styles['form-control']}
                      />
                      <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles['form-label']}>Address *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                        placeholder="Enter your address"
                        className={styles['form-control']}
                      />
                      <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="mb-4">
                <h5 className={styles['form-section-title']}>Professional Details</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles['form-label']}>Experience Level *</Form.Label>
                      <Form.Select
                        name="experience_level"
                        value={formData.experience_level}
                        onChange={handleChange}
                        isInvalid={!!errors.experience_level}
                        className={styles['form-control']}
                      >
                        <option value="">Select Experience</option>
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (3-5 years)</option>
                        <option value="senior">Senior Level (6-9 years)</option>
                        <option value="expert">Expert (10+ years)</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.experience_level}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles['form-label']}>Availability *</Form.Label>
                      <Form.Select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        isInvalid={!!errors.availability}
                        className={styles['form-control']}
                      >
                        <option value="">Select Availability</option>
                        <option value="immediate">Immediate</option>
                        <option value="1week">Within 1 Week</option>
                        <option value="2weeks">Within 2 Weeks</option>
                        <option value="1month">Within 1 Month</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.availability}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label className={styles['form-label']}>Short Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="short_info"
                    value={formData.short_info}
                    onChange={handleChange}
                    placeholder="Briefly describe your skills and experience (max 255 characters)"
                    maxLength={255}
                    className={styles['form-control']}
                  />
                  <div className={styles['char-count']}>
                    {formData.short_info.length}/255 characters
                  </div>
                </Form.Group>
              </div>

              {errors.submit && (
                <Alert variant="danger" className={styles.alert}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {errors.submit}
                </Alert>
              )}

              <Button
                variant="primary"
                type="submit"
                className={styles['submit-button']}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Submit Application
                  </>
                )}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RegisterPage;