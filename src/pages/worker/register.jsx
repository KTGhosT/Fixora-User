import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, ProgressBar, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import styles from './register.module.css';
import axiosInstance from "../../services/api";
import ElectricianImg from "../../assets/worker/Electrician.jpg";
import PlumberImg from "../../assets/worker/Plumber.jpg";
import CleanerImg from "../../assets/worker/Cleaner.jpg";
import GardenerImg from "../../assets/worker/Gardener.jpg";

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
    name: '',
    email: '',
    phone_number: '',
    address: '',
    experience_level: '',
    availability: '',
    short_info: '',
    jobId: null,
    // Day Worker specific fields
    is_day_worker: false,
    skills: '',
    available_days: [],
    available_hours_start: '',
    available_hours_end: '',
    service_locations: '',
    has_own_tools: false,
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
    // Day Worker validations
    if (formData.is_day_worker) {
      if (!formData.available_days || formData.available_days.length === 0) newErrors.available_days = 'Select at least one available day';
      if (!formData.available_hours_start || !formData.available_hours_end) newErrors.available_hours = 'Start and end hours are required';
    }
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

  const handleToggleDayWorker = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({ ...prev, is_day_worker: checked }));
  };

  const toggleAvailableDay = (day) => {
    setFormData((prev) => {
      const days = prev.available_days || [];
      const nextDays = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
      return { ...prev, available_days: nextDays };
    });
    if (errors.available_days) setErrors((prev) => ({ ...prev, available_days: '' }));
  };

  const handleToolsToggle = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({ ...prev, has_own_tools: checked }));
  };

  const handleProgress = () => {
    setProgress((prev) => Math.min(prev + 25, 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    handleProgress();

    // Prepare payload with computed availability for day workers
    const payload = { ...formData };
    if (payload.is_day_worker) {
      const days = (payload.available_days || []).join(',');
      payload.availability = `Days:${days} Hours:${payload.available_hours_start}-${payload.available_hours_end}`;
      // Ensure removed fields are not sent
      delete payload.hourly_rate;
      delete payload.max_jobs_per_day;
    }

    const formDataToSend = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formDataToSend.append(key, value.join(','));
      } else if (typeof value === 'boolean') {
        formDataToSend.append(key, value ? '1' : '0');
      } else {
        formDataToSend.append(key, value);
      }
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
            {formData.is_day_worker 
              ? 'Day Worker Registration' 
              : `Apply for ${selectedJob?.title}`}
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
                Thank you for applying to {selectedJob?.title}. 
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
                      <Form.Text className={styles['form-hint']}>Digits only, 10–15 characters.</Form.Text>
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
                      <Form.Text className={styles['form-hint']}>Include city and district for faster matching.</Form.Text>
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

      {/* Day Worker Option */}
      <div className="mb-4">
        <Form.Check
          type="checkbox"
          id="is_day_worker"
          label="Register as Day Worker"
          checked={formData.is_day_worker}
          onChange={handleToggleDayWorker}
          className={styles['form-checkbox']}
        />
      </div>

      {formData.is_day_worker && (
        <div className="mb-4">
          <h5 className={styles['form-section-title']}>Day Worker Details</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className={styles['form-label']}>Skills (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., plumbing, electrical, cleaning"
                  className={styles['form-control']}
                />
              </Form.Group>
            </Col>
            
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className={styles['form-label']}>Available Days *</Form.Label>
                <div className={`${styles['day-chip-group']} d-flex flex-wrap gap-2`}>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                    <Form.Check
                      key={d}
                      type="checkbox"
                      inline
                      className={styles['day-chip']}
                      label={d}
                      checked={formData.available_days?.includes(d)}
                      onChange={() => toggleAvailableDay(d)}
                    />
                  ))}
                </div>
                <Form.Text className={styles['form-hint']}>Pick at least one day.</Form.Text>
                {errors.available_days && (
                  <div className="invalid-feedback d-block">{errors.available_days}</div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className={styles['form-label']}>Available Hours *</Form.Label>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Control
                    type="time"
                    name="available_hours_start"
                    value={formData.available_hours_start}
                    onChange={handleChange}
                    className={styles['form-control']}
                  />
                  <span>to</span>
                  <Form.Control
                    type="time"
                    name="available_hours_end"
                    value={formData.available_hours_end}
                    onChange={handleChange}
                    className={styles['form-control']}
                  />
                </div>
                <Form.Text className={styles['form-hint']}>Specify your working window.</Form.Text>
                {errors.available_hours && (
                  <div className="invalid-feedback d-block">{errors.available_hours}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className={styles['form-label']}>Service Locations</Form.Label>
                <Form.Control
                  type="text"
                  name="service_locations"
                  value={formData.service_locations}
                  onChange={handleChange}
                  placeholder="e.g., Colombo, Kandy"
                  className={styles['form-control']}
                />
              </Form.Group>
            </Col>
            
          </Row>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="has_own_tools"
              label="I have my own tools"
              checked={formData.has_own_tools}
              onChange={handleToolsToggle}
            />
          </Form.Group>
        </div>
      )}
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