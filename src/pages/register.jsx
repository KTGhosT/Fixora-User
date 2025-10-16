import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, ProgressBar, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import styles from './register.module.css';
import axiosInstance from "../services/api";
import { createWorkerProfileApi } from "../services/workers";
import ElectricianImg from "../assets/worker/Electrician.jpg";
import PlumberImg from "../assets/worker/Plumber.jpg";
import CleanerImg from "../assets/worker/Cleaner.jpg";
import GardenerImg from "../assets/worker/Gardener.jpg";

// Fallback handler in case a job image fails to load
const handleJobImageError = (e) => {
  // Use a known-good local image as a visual fallback
  e.currentTarget.src = CleanerImg;
  e.currentTarget.alt = `${e.currentTarget.alt} (image unavailable)`;
};

const RegisterPage = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: "Electrician",
      company: "ServicePro",
      location: "Colombo",
      salary: "LKR 4,000 - 10,000 per job",
      description: "We're looking for an experienced electrician to work on residential and commercial electrical systems. Must have 3+ years experience and valid certification.",
      image: ElectricianImg,
      type: "Full-time",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Plumber",
      company: "PipeMaster",
      location: "Kandy",
      salary: "LKR 3,500 - 9,000 per job",
      description: "Join our team as a licensed plumber to handle installations and repairs. Commercial and residential projects available.",
      image: PlumberImg,
      type: "Full-time",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Cleaner",
      company: "CleanSolutions",
      location: "Galle",
      salary: "LKR 1,500 - 4,000 per job",
      description: "Looking for reliable cleaners to maintain our commercial properties. Flexible hours and competitive pay.",
      image: CleanerImg,
      type: "Part-time",
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "Gardener",
      company: "GreenThumb",
      location: "Jaffna",
      salary: "LKR 2,000 - 5,000 per job",
      description: "We need gardeners to maintain beautiful landscapes and outdoor spaces. Plant knowledge and maintenance skills required.",
      image: GardenerImg,
      type: "Contract",
      posted: "5 days ago"
    }
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    work_role: '',
    bio: '',
    experience_level: '',
    availability: '',
    short_info: '',
    minimum_education: '',
    jobId: null,
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const slides = [
    {
      image: ElectricianImg,
      title: "Find Your Dream Job",
      subtitle: "Connect with top employers in the trades industry"
    },
    {
      image: GardenerImg,
      title: "Skilled Professionals Wanted",
      subtitle: "Immediate openings with competitive pay"
    },
    {
      image: CleanerImg,
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

  const scrollToJobs = () => {
    const el = document.getElementById('jobs');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setFormData((prev) => ({ 
      ...prev, 
      jobId: job.id,
      work_role: job.title.toLowerCase()
    }));
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedJob(null);
    setFormData({
      work_role: '',
      bio: '',
      experience_level: '',
      availability: '',
      short_info: '',
      minimum_education: '',
      jobId: null,
    });
    setSuccess(false);
    setErrors({});
    setProgress(0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check if user is authenticated and has required personal info
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      newErrors.submit = 'User not authenticated. Please log in first.';
      setErrors(newErrors);
      return false;
    }
    
    const userData = JSON.parse(savedUser);
    if (!userData.name || !userData.email || !userData.phone) {
      newErrors.submit = 'Please complete your profile with name, email, and phone number before registering as a worker.';
      setErrors(newErrors);
      return false;
    }
    
    // Work role validation
    if (!formData.work_role.trim()) newErrors.work_role = 'Work role is required';
    
    // Experience level validation
    if (!formData.experience_level.trim()) newErrors.experience_level = 'Experience level is required';
    
    // Availability validation
    if (!formData.availability.trim()) newErrors.availability = 'Availability is required';
    
    // Bio validation
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    else if (formData.bio.trim().length < 10) newErrors.bio = 'Bio must be at least 10 characters';
    else if (formData.bio.trim().length > 255) newErrors.bio = 'Bio must be 255 characters or less';
    
    // Short info validation
    if (formData.short_info && formData.short_info.length > 255) {
      newErrors.short_info = 'Short info must be 255 characters or less';
    }
    
    // Education validation
    if (!formData.minimum_education.trim()) newErrors.minimum_education = 'Minimum education is required';
    
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

    // Get user information from localStorage
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setErrors({ submit: 'User not authenticated. Please log in first.' });
      setIsSubmitting(false);
      return;
    }
    
    const userData = JSON.parse(savedUser);

    // Prepare worker data - include personal info from user profile (required by backend)
    const workerData = {
      // Personal information from user profile (required by backend API)
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || userData.phone_number || '',
      
      // Worker-specific information
      work_role: formData.work_role,
      bio: formData.bio,
      experience_level: formData.experience_level,
      availability: formData.availability,
      short_info: formData.short_info,
      minimum_education: formData.minimum_education,
      status: 'pending',
      user_id: userData.id
    };

    try {
      // Use the clean worker profile API
      const response = await createWorkerProfileApi(workerData);
      
      // Handle successful response
      console.log('Worker registration successful:', response);
      
      // Store worker information if returned
      if (response.worker_id || response.id) {
        const workerInfo = {
          worker_id: response.worker_id || response.id,
          user_id: response.user_id || userData.id,
          work_role: response.work_role || formData.work_role,
          status: response.status || 'pending',
          created_at: response.created_at || new Date().toISOString()
        };
        
        // Store worker info in localStorage for future use
        localStorage.setItem('worker_profile', JSON.stringify(workerInfo));
      }
      
      handleProgress();
      setSuccess(true);
      setTimeout(handleClose, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to register as worker. Please try again.';
      setErrors({ submit: errorMessage });
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
      handleProgress();
    }
  };

  // Filter jobs by category
  const normalizeType = (str) => (str || '').toLowerCase().replace(/\s|-/g, '');

  // Salary is already provided as an LKR range string per job; no conversion needed
  const baseTypes = ['Full-time', 'Part-time', 'Contract', 'Dayworker'];
  const dynamicTypes = Array.from(new Set(
    (jobs || []).map((j) => j.type).filter(Boolean)
  )).filter((t) => !baseTypes.map(normalizeType).includes(normalizeType(t)));
  const typeOptions = ['all', ...baseTypes, ...dynamicTypes];

  const filteredByCategory = activeCategory === 'all'
    ? jobs
    : jobs.filter(job => job.title.toLowerCase() === activeCategory.toLowerCase());
  const filteredJobs = activeType === 'all'
    ? filteredByCategory
    : filteredByCategory.filter(job => normalizeType(job.type) === normalizeType(activeType));

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
              <Link to="/" className={styles['back-home-btn']} aria-label="Go to Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10l9-7 9 7" />
                  <path d="M5 10v10h14V10" />
                </svg>
              </Link>
              <h1 className={styles['slider-title']}>{slides[currentSlide].title}</h1>
              <p className={styles['slider-subtitle']}>{slides[currentSlide].subtitle}</p>
              <button type="button" className={styles['cta-btn']} onClick={scrollToJobs}>
                Browse Jobs
              </button>
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
      <div className={styles['light-section']}>
        <Container className="py-5" id="jobs">
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <h2 className={styles['section-title']}>Available Positions</h2>
            <p className={styles['section-subtitle']}>
              Browse through our current job openings and find the perfect match for your skills
            </p>
            {/* Type Filters */}
            <div className={styles['type-filters']}>
              {typeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles['type-filter']} ${activeType === type ? styles.active : ''}`}
                  onClick={() => setActiveType(type)}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
            {(() => {
              const normType = normalizeType(activeType);
              const InfoIcon = (
                <svg
                  className={styles['type-info-icon']}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" fill="#eaf2ff" />
                  <path d="M12 8a1 1 0 100-2 1 1 0 000 2zm-1 3h2v7h-2v-7z" fill="#3b82f6" />
                </svg>
              );
              if (normType === normalizeType('Full-time')) {
                return (
                  <div className={styles['type-info']}>
                    {InfoIcon}
                    <span>Full-time roles: 8-hour shifts across multiple days; stable schedules.</span>
                  </div>
                );
              }
              if (normType === normalizeType('Part-time')) {
                return (
                  <div className={styles['type-info']}>
                    {InfoIcon}
                    <span>Part-time roles: fewer hours per day; flexible scheduling options.</span>
                  </div>
                );
              }
              if (normType === normalizeType('Contract')) {
                return (
                  <div className={styles['type-info']}>
                    {InfoIcon}
                    <span>Contract roles: fixed-term projects with defined deliverables and timelines.</span>
                  </div>
                );
              }
              if (normType === normalizeType('Dayworker')) {
                return (
                  <div className={styles['type-info']}>
                    {InfoIcon}
                    <span>Dayworker roles: single-day gigs ideal for quick assignments.</span>
                  </div>
                );
              }
              return null;
            })()}
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
                    loading="lazy"
                    onError={handleJobImageError}
                  />
                  <Badge bg="primary" className={styles['job-type']}>{job.type}</Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <span className={styles['posted-date']}>{job.posted}</span>
                  </div>
                  <Card.Title className={styles['job-title']}>{job.title}</Card.Title>
                  {/* Company removed per request; keep only required fields */}
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
                        <path d="M12 1v22M5 8h7a3 3 0 0 1 0 6H6a4 4 0 0 0 0 8h11" />
                      </svg>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <Card.Text className={`flex-grow-1 ${styles['job-description']}`}>
                    {String(job.description || '').length > 140
                      ? `${job.description.slice(0, 140)}...`
                      : job.description}
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
      </div>

      {/* Registration Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered className={styles.modal}>
        <Modal.Header closeButton className={styles['modal-header']}>
          <Modal.Title className={styles['modal-title']}>
            Register as {selectedJob?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles['modal-body']}>
          {success ? (
            <div className={styles['success-container']}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles['success-icon']}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className={styles['success-title']}>Registration Successful!</h4>
              <p className={styles['success-message']}>
                Thank you for registering as a {selectedJob?.title}. 
                We'll review your profile and contact you soon with job opportunities.
              </p>
              {localStorage.getItem('worker_profile') && (
                <div className="mt-3">
                  <small className="text-muted">
                    Your worker profile has been created and saved.
                  </small>
                </div>
              )}
            </div>
          ) : (
            <Form onSubmit={handleSubmit} className={styles.form}>
              <div className="mb-4">
                <h5 className={styles['form-section-title']}>Worker Profile Information</h5>
                <div className="alert alert-info mb-3">
                  <small>
                    <strong>Note:</strong> Your personal information (name, email, phone) will be taken from your user profile. 
                    Please ensure your profile is complete before registering as a worker.
                  </small>
                </div>
                <ProgressBar now={progress} className={`mb-3 ${styles.progress}`} />
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles['form-label']}>Work Role *</Form.Label>
                      <Form.Control
                        type="text"
                        name="work_role"
                        value={formData.work_role}
                        onChange={handleChange}
                        isInvalid={!!errors.work_role}
                        placeholder="e.g., electrician, plumber, cleaner"
                        className={styles['form-control']}
                        readOnly
                      />
                      <Form.Text className={styles['form-hint']}>Selected from job posting</Form.Text>
                      <Form.Control.Feedback type="invalid">{errors.work_role}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles['form-label']}>Minimum Education *</Form.Label>
                      <Form.Select
                        name="minimum_education"
                        value={formData.minimum_education}
                        onChange={handleChange}
                        isInvalid={!!errors.minimum_education}
                        className={styles['form-control']}
                      >
                        <option value="">Select Education Level</option>
                        <option value="O/L">O/L (Ordinary Level)</option>
                        <option value="A/L">A/L (Advanced Level)</option>
                        <option value="NVQ4">NVQ Level 4</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Degree">Degree</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.minimum_education}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
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
                      <Form.Text className={styles['form-hint']}>Helps us match you to the right roles.</Form.Text>
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
                      <Form.Text className={styles['form-hint']}>When can you start?</Form.Text>
                      <Form.Control.Feedback type="invalid">{errors.availability}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="mb-4">
                <h5 className={styles['form-section-title']}>Professional Bio</h5>
                <Form.Group className="mb-4">
                  <Form.Label className={styles['form-label']}>Bio *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    isInvalid={!!errors.bio}
                    placeholder="Tell us about your skills, experience, and what makes you a great worker (10-255 characters)"
                    maxLength={255}
                    className={styles['form-control']}
                  />
                  <div className={styles['char-count']}>
                    {formData.bio.length}/255 characters
                  </div>
                  <Form.Control.Feedback type="invalid">{errors.bio}</Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className={styles['form-label']}>Additional Information</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="short_info"
                    value={formData.short_info}
                    onChange={handleChange}
                    isInvalid={!!errors.short_info}
                    placeholder="Any additional information you'd like to share (optional, max 255 characters)"
                    maxLength={255}
                    className={styles['form-control']}
                  />
                  <div className={styles['char-count']}>
                    {formData.short_info.length}/255 characters
                  </div>
                  <Form.Control.Feedback type="invalid">{errors.short_info}</Form.Control.Feedback>
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
                    Register as Worker
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