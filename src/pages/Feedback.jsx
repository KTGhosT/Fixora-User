import React, { useState, useEffect } from 'react';
import { Star, Send, Eye, Trash2, Filter, Search, MessageSquare, User, Calendar, Award } from 'lucide-react';

const Feedback = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    category: 'general',
    subject: '',
    message: '',
    anonymous: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Load feedback from localStorage on component mount
  useEffect(() => {
    const savedFeedback = localStorage.getItem('feedbackData');
    if (savedFeedback) {
      const parsed = JSON.parse(savedFeedback);
      setFeedbackList(parsed);
      setFilteredFeedback(parsed);
    }
  }, []);

  // Filter feedback based on search and rating
  useEffect(() => {
    let filtered = feedbackList;
    
    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRating !== 'all') {
      filtered = filtered.filter(feedback => feedback.rating == filterRating);
    }
    
    setFilteredFeedback(filtered);
  }, [feedbackList, searchTerm, filterRating]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newFeedback = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    const updatedFeedback = [...feedbackList, newFeedback];
    setFeedbackList(updatedFeedback);
    localStorage.setItem('feedbackData', JSON.stringify(updatedFeedback));
    
    setFormData({
      name: '',
      email: '',
      rating: 0,
      category: 'general',
      subject: '',
      message: '',
      anonymous: false
    });
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id) => {
    const updatedFeedback = feedbackList.filter(feedback => feedback.id !== id);
    setFeedbackList(updatedFeedback);
    localStorage.setItem('feedbackData', JSON.stringify(updatedFeedback));
  };

  const markAsRead = (id) => {
    const updatedFeedback = feedbackList.map(feedback =>
      feedback.id === id ? { ...feedback, status: 'read' } : feedback
    );
    setFeedbackList(updatedFeedback);
    localStorage.setItem('feedbackData', JSON.stringify(updatedFeedback));
  };

  const renderStars = (rating, interactive = false, size = 'fs-5') => {
    return (
      <div className="d-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${interactive ? 'cursor-pointer' : ''} ${
              star <= (interactive ? (hoveredStar || rating) : rating)
                ? 'text-warning'
                : 'text-muted'
            }`}
            fill={star <= (interactive ? (hoveredStar || rating) : rating) ? 'currentColor' : 'none'}
            onClick={interactive ? () => handleRatingClick(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          />
        ))}
      </div>
    );
  };

  const getRatingText = (rating) => {
    const texts = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    return texts[rating] || 'No rating';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      general: 'primary',
      bug: 'danger',
      feature: 'success',
      ui: 'info',
      performance: 'warning'
    };
    return colors[category] || 'secondary';
  };

  if (!isAdmin) {
    return (
      <div className="min-vh-100 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="d-flex justify-content-center mb-3">
                  <MessageSquare size={48} className="text-primary" />
                </div>
                <h1 className="display-5 fw-bold text-dark mb-3">We Value Your Feedback</h1>
                <p className="lead text-muted">Help us improve by sharing your experience and suggestions</p>
              </div>

              {/* Success Alert */}
              {showSuccess && (
                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                  <div className="d-flex align-items-center">
                    <Award className="me-2" />
                    <strong>Thank you!</strong> Your feedback has been submitted successfully.
                  </div>
                </div>
              )}

              {/* Feedback Form */}
              <div className="card shadow-lg border-0">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label htmlFor="name" className="form-label fw-semibold">
                          <User size={16} className="me-2" />
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required={!formData.anonymous}
                          disabled={formData.anonymous}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label htmlFor="email" className="form-label fw-semibold">Email</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required={!formData.anonymous}
                          disabled={formData.anonymous}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="anonymous"
                          name="anonymous"
                          checked={formData.anonymous}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="anonymous">
                          Submit feedback anonymously
                        </label>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">Overall Rating</label>
                        <div className="d-flex align-items-center">
                          {renderStars(formData.rating, true, 'fs-4')}
                          <span className="ms-3 text-muted">
                            {formData.rating > 0 && getRatingText(formData.rating)}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <label htmlFor="category" className="form-label fw-semibold">Category</label>
                        <select
                          className="form-select form-select-lg"
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="general">General Feedback</option>
                          <option value="bug">Bug Report</option>
                          <option value="feature">Feature Request</option>
                          <option value="ui">User Interface</option>
                          <option value="performance">Performance</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="subject" className="form-label fw-semibold">Subject</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Brief summary of your feedback"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="message" className="form-label fw-semibold">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Please provide detailed feedback..."
                        style={{ resize: 'vertical', minHeight: '120px' }}
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setIsAdmin(true)}
                      >
                        <Eye size={16} className="me-2" />
                        Admin View
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-5"
                        disabled={formData.rating === 0}
                      >
                        <Send size={16} className="me-2" />
                        Submit Feedback
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid py-4">
        {/* Admin Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-0">Feedback Management</h1>
            <p className="text-muted mb-0">Manage and respond to user feedback</p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={() => setIsAdmin(false)}
          >
            <User size={16} className="me-2" />
            User View
          </button>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                    <MessageSquare className="text-primary" />
                  </div>
                  <div>
                    <h3 className="h4 mb-0">{feedbackList.length}</h3>
                    <p className="text-muted mb-0">Total Feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-warning bg-opacity-10 me-3">
                    <Star className="text-warning" />
                  </div>
                  <div>
                    <h3 className="h4 mb-0">
                      {feedbackList.length > 0 
                        ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
                        : '0.0'
                      }
                    </h3>
                    <p className="text-muted mb-0">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-success bg-opacity-10 me-3">
                    <Eye className="text-success" />
                  </div>
                  <div>
                    <h3 className="h4 mb-0">{feedbackList.filter(f => f.status === 'read').length}</h3>
                    <p className="text-muted mb-0">Read</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-info bg-opacity-10 me-3">
                    <Calendar className="text-info" />
                  </div>
                  <div>
                    <h3 className="h4 mb-0">{feedbackList.filter(f => f.status === 'new').length}</h3>
                    <p className="text-muted mb-0">New</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <Filter size={16} className="me-2 text-muted" />
                  <select
                    className="form-select"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="row">
          {filteredFeedback.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <MessageSquare size={48} className="text-muted mb-3" />
                <h4 className="text-muted">No feedback found</h4>
                <p className="text-muted">No feedback matches your current filters.</p>
              </div>
            </div>
          ) : (
            filteredFeedback.map((feedback) => (
              <div key={feedback.id} className="col-lg-6 mb-4">
                <div className={`card border-0 shadow-sm h-100 ${feedback.status === 'new' ? 'border-start border-primary border-4' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title mb-1">{feedback.subject}</h5>
                        <p className="text-muted mb-0">
                          <strong>{feedback.anonymous ? 'Anonymous User' : feedback.name}</strong>
                          {!feedback.anonymous && feedback.email && (
                            <span className="text-muted"> • {feedback.email}</span>
                          )}
                        </p>
                      </div>
                      <div className="d-flex align-items-center">
                        {feedback.status === 'new' && (
                          <span className="badge bg-primary me-2">New</span>
                        )}
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => markAsRead(feedback.id)}
                              >
                                <Eye size={14} className="me-2" />
                                Mark as Read
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(feedback.id)}
                              >
                                <Trash2 size={14} className="me-2" />
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      {renderStars(feedback.rating, false, 'fs-6')}
                      <span className="ms-2 text-muted">
                        {getRatingText(feedback.rating)}
                      </span>
                      <span className={`badge bg-${getCategoryBadgeColor(feedback.category)} ms-auto`}>
                        {feedback.category}
                      </span>
                    </div>

                    <p className="card-text">{feedback.message}</p>

                    <small className="text-muted">
                      <Calendar size={14} className="me-1" />
                      {new Date(feedback.timestamp).toLocaleDateString()} at{' '}
                      {new Date(feedback.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;