import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.module.css';

const RegisterPage = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: "Electrician",
      company: "ServicePro",
      location: "Los Angeles, CA",
      salary: "$45,000 - $70,000",
      description: "We're looking for an experienced electrician to work on residential and commercial electrical systems...",
      image: "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      title: "Plumber",
      company: "PipeMaster",
      location: "Chicago, IL",
      salary: "$40,000 - $65,000",
      description: "Join our team as a licensed plumber to handle installations and repairs...",
      image: "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      title: "Cleaner",
      company: "CleanSolutions",
      location: "Miami, FL",
      salary: "$25,000 - $35,000",
      description: "Looking for reliable cleaners to maintain our commercial properties...",
      image: "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 4,
      title: "Gardener",
      company: "GreenThumb",
      location: "Seattle, WA",
      salary: "$30,000 - $45,000",
      description: "We need gardeners to maintain beautiful landscapes and outdoor spaces...",
      image: "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    availability: '',
    resume: null,
    coverLetter: ''
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const slides = [
    "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1581578731404-b20773b74047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedJob(null);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      address: '',
      experience: '',
      availability: '',
      resume: null,
      coverLetter: ''
    });
    setSuccess(false);
    setErrors({});
    setProgress(0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience level is required';
    }
    
    if (!formData.availability.trim()) {
      newErrors.availability = 'Availability is required';
    }
    
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProgress = () => {
    setProgress(prev => Math.min(prev + 20, 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    handleProgress();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      handleProgress();
      
      console.log('Registration submitted:', { ...formData, jobId: selectedJob.id });
      setSuccess(true);
      handleProgress();
      
      // Reset form after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
      handleProgress();
    }
  };

  return (
    <Container fluid className="p-0">
      {/* Slider Section */}
      <div className="slider-container">
        <div className="slider">
          <img src={slides[currentSlide]} alt={`Slide ${currentSlide}`} className="slide-image" />
          <div className="slider-overlay">
            <h1 className="slider-title">Explore Jobs</h1>
            <div className="job-categories">
              <span className="category">Electrician</span>
              <span className="category">Plumber</span>
              <span className="category">Cleaner</span>
              <span className="category">Gardener</span>
            </div>
          </div>
          <button className="slider-btn prev" onClick={prevSlide}>&#10094;</button>
          <button className="slider-btn next" onClick={nextSlide}>&#10095;</button>
        </div>
      </div>

      {/* Job Listings */}
      <Container className="py-5">
        <h2 className="text-center mb-5 section-title">Available Positions</h2>
        <Row>
          {jobs.map(job => (
            <Col md={6} lg={3} key={job.id} className="mb-4">
              <Card className="job-card h-100 shadow-sm">
                <div className="job-image">
                  <img src={job.image} alt={job.title} className="card-img-top" />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-primary">{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Salary:</strong> {job.salary}</p>
                    <p>{job.description.substring(0, 100)}...</p>
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleJobClick(job)}
                    className="mt-auto"
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
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Register for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success ? (
            <Alert variant="success" className="text-center">
              <h4 className="alert-heading">Application Submitted!</h4>
              <p>Thank you for applying. We'll review your application and contact you soon.</p>
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <ProgressBar now={progress} className="mb-3" />
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      isInvalid={!!errors.address}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Experience Level *</Form.Label>
                    <Form.Select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      isInvalid={!!errors.experience}
                      required
                    >
                      <option value="">Select Experience</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="expert">Expert</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.experience}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Availability *</Form.Label>
                    <Form.Select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      isInvalid={!!errors.availability}
                      required
                    >
                      <option value="">Select Availability</option>
                      <option value="immediate">Immediate</option>
                      <option value="1week">Within 1 Week</option>
                      <option value="2weeks">Within 2 Weeks</option>
                      <option value="1month">Within 1 Month</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.availability}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Cover Letter</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Tell us about yourself and why you're interested in this position..."
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Upload Resume *</Form.Label>
                <Form.Control
                  type="file"
                  name="resume"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                  isInvalid={!!errors.resume}
                  required
                />
                <Form.Text className="text-muted">
                  Supported formats: PDF, DOC, DOCX
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.resume}
                </Form.Control.Feedback>
              </Form.Group>
              
              {errors.submit && (
                <Alert variant="danger" className="mb-3">
                  {errors.submit}
                </Alert>
              )}
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  'Submit Application'
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