import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './dashboard.module.css'; // Import dashboard styles

const Settings = () => {
  // User profile state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    status : 'active',
    email: 'john@example.com',
    phone: '+1234567890',
    bio: 'Software developer with 5 years of experience',
    location: 'New York, USA',
    workRole: 'carpenter', // Added work role field, default to 'carpenter'
    profilePhoto: 'https://via.placeholder.com/150',
    cv: null,
    projects: [],
    experiences: [],
    // Verification state
    verification: {
      status: 'pending', // pending, submitted, verified, rejected
      documents: {
        idProof: null,
        addressProof: null,
        qualification: null
      },
      interview: {
        status: 'pending', // pending, scheduled, passed, failed
        date: null,
        feedback: ''
      },
      rejectionReason: ''
    }
  });

  // Refs for file inputs
  const photoInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const idProofRef = useRef(null);
  const addressProofRef = useRef(null);
  const qualificationRef = useRef(null);

  // Handle profile field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, profilePhoto: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle CV upload
  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({ 
        ...prev, 
        cv: {
          name: file.name,
          url: URL.createObjectURL(file)
        }
      }));
    }
  };

  // Handle verification document upload
  const handleDocumentUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          verification: {
            ...prev.verification,
            documents: {
              ...prev.verification.documents,
              [type]: {
                name: file.name,
                preview: e.target.result
              }
            }
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit verification
  const submitVerification = () => {
    setProfile(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        status: 'submitted'
      }
    }));
  };

  // Schedule interview (mock function)
  const scheduleInterview = () => {
    setProfile(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        interview: {
          ...prev.verification.interview,
          status: 'scheduled',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
        }
      }
    }));
  };

  // Pass interview (mock function)
  const passInterview = () => {
    setProfile(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        interview: {
          ...prev.verification.interview,
          status: 'passed'
        }
      }
    }));
  };

  // Fail interview (mock function)
  const failInterview = () => {
    setProfile(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        interview: {
          ...prev.verification.interview,
          status: 'failed',
          feedback: 'Need to improve technical knowledge'
        }
      }
    }));
  };

  // Add new project
  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now(), title: '', description: '', link: '' }
      ]
    }));
  };

  // Update project details
  const updateProject = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  // Remove project
  const removeProject = (id) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  // Add new experience
  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { 
          id: Date.now(), 
          company: '', 
          position: '', 
          startDate: '', 
          endDate: '', 
          description: '' 
        }
      ]
    }));
  };

  // Update experience details
  const updateExperience = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Remove experience
  const removeExperience = (id) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  // Save profile
  const saveProfile = () => {
    console.log('Saving profile:', profile);
    alert('Profile saved successfully!');
  };

  // Verification status badge
  const VerificationBadge = () => {
    const status = profile.verification.status;
    let badgeClass = 'badge ';
    let text = '';
    
    switch(status) {
      case 'verified':
        badgeClass += 'bg-success';
        text = 'Verified';
        break;
      case 'submitted':
        badgeClass += 'bg-warning';
        text = 'Pending Review';
        break;
      case 'rejected':
        badgeClass += 'bg-danger';
        text = 'Rejected';
        break;
      default:
        badgeClass += 'bg-secondary';
        text = 'Not Verified';
    }
    
    return <span className={badgeClass}>{text}</span>;
  };

  // Interview status badge
  const InterviewBadge = () => {
    const status = profile.verification.interview.status;
    let badgeClass = 'badge ';
    let text = '';
    
    switch(status) {
      case 'passed':
        badgeClass += 'bg-success';
        text = 'Passed';
        break;
      case 'failed':
        badgeClass += 'bg-danger';
        text = 'Failed';
        break;
      case 'scheduled':
        badgeClass += 'bg-info';
        text = 'Scheduled';
        break;
      default:
        badgeClass += 'bg-secondary';
        text = 'Pending';
    }
    
    return <span className={badgeClass}>{text}</span>;
  };

  // Check if all documents are uploaded
  const allDocumentsUploaded = () => {
    const docs = profile.verification.documents;
    return docs.idProof && docs.addressProof && docs.qualification;
  };

  // Check if verification is complete
  const isVerified = () => {
    return profile.verification.status === 'verified' && 
           profile.verification.interview.status === 'passed';
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Left Navigation Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>WorkerDash</h2>
        </div>
        <nav className={styles.navMenu}>
          <Link to="/worker/dashboard" className={styles.navItem}>
            <i className="icon-dashboard"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/worker/works" className={styles.navItem}>
            <i className="icon-orders"></i>
            <span>Works</span>
          </Link>
          {/* Tasks and Sales removed after consolidation into Works */}
          <Link to="/worker/payments" className={styles.navItem}>
            <i className="icon-payments"></i>
            <span>Payments</span>
          </Link>
          <Link to="/worker/inventory" className={styles.navItem}>
            <i className="icon-inventory"></i>
            <span>Inventory</span>
          </Link>
          <Link to="/worker/clients" className={styles.navItem}>
            <i className="icon-clients"></i>
            <span>Clients</span>
          </Link>
          <Link to="/worker/reports" className={styles.navItem}>
            <i className="icon-reports"></i>
            <span>Reports</span>
          </Link>
          <Link to="/worker/calls" className={styles.navItem}>
            <i className="icon-calls"></i>
            <span>Calls</span>
          </Link>
          <Link to="/worker/settings" className={`${styles.navItem} ${styles.active}`}>
            <i className="icon-settings"></i>
            <span>Settings</span>
          </Link>
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <i className="icon-user"></i>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.username}>John Doe</div>
            <div className={styles.role}>Worker</div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Settings) */}
      <div className={styles.mainContent}>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-lg-9">
              <h1 className="mb-4">Worker Profile Settings</h1>
              
              {/* Personal Details Section */}
              <div className="card mb-4">
                <div className="card-header">
                  <h2 className="mb-0">Personal Details</h2>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="name" 
                      value={profile.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control"
                      name="email" 
                      value={profile.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input 
                      type="tel" 
                      className="form-control"
                      name="phone" 
                      value={profile.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="location" 
                      value={profile.location} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea 
                      className="form-control"
                      name="bio" 
                      value={profile.bio} 
                      onChange={handleInputChange} 
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Photo Section */}
              <div className="card mb-4">
                <div className="card-header">
                  <h2 className="mb-0">Profile Photo</h2>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <img 
                      src={profile.profilePhoto} 
                      alt="Profile" 
                      className="rounded-circle me-4"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <div>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => photoInputRef.current.click()}
                      >
                        Change Photo
                      </button>
                      <input 
                        type="file" 
                        ref={photoInputRef}
                        onChange={handlePhotoUpload} 
                        accept="image/*"
                        className="d-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Upload Section */}
              <div className="card mb-4">
                <div className="card-header">
                  <h2 className="mb-0">Upload CV</h2>
                </div>
                <div className="card-body">
                  {profile.cv ? (
                    <div className="mb-3">
                      <p className="mb-2">Current CV: <a href={profile.cv.url} target="_blank" rel="noopener noreferrer">{profile.cv.name}</a></p>
                      <button 
                        className="btn btn-outline-primary" 
                        onClick={() => cvInputRef.current.click()}
                      >
                        Replace CV
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => cvInputRef.current.click()}
                    >
                      Upload CV
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={cvInputRef}
                    onChange={handleCvUpload} 
                    accept=".pdf,.doc,.docx"
                    className="d-none"
                  />
                </div>
              </div>

              {/* Projects Section */}
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h2 className="mb-0">Projects</h2>
                  <button className="btn btn-success" onClick={addProject}>
                    Add Project
                  </button>
                </div>
                <div className="card-body">
                  {profile.projects.map(project => (
                    <div key={project.id} className="border p-3 mb-3 rounded">
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={project.title} 
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)} 
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-control"
                          value={project.description} 
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)} 
                          rows="3"
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input 
                          type="url" 
                          className="form-control"
                          value={project.link} 
                          onChange={(e) => updateProject(project.id, 'link', e.target.value)} 
                        />
                      </div>
                      
                      <button 
                        className="btn btn-danger" 
                        onClick={() => removeProject(project.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Section */}
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h2 className="mb-0">Work Experience</h2>
                  <button className="btn btn-success" onClick={addExperience}>
                    Add Experience
                  </button>
                </div>
                <div className="card-body">
                  {profile.experiences.map(exp => (
                    <div key={exp.id} className="border p-3 mb-3 rounded">
                      <div className="mb-3">
                        <label className="form-label">Company</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={exp.company} 
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} 
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Position</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={exp.position} 
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} 
                        />
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Start Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            value={exp.startDate} 
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} 
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label">End Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            value={exp.endDate} 
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-control"
                          value={exp.description} 
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} 
                          rows="3"
                        />
                      </div>
                      
                      <button 
                        className="btn btn-danger" 
                        onClick={() => removeExperience(exp.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="text-center">
                <button className="btn btn-primary btn-lg" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>

            {/* Right Verification Panel */}
            <div className="col-lg-3">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">Verification</h3>
                </div>
                <div className="card-body">
                  <div className="text-center mb-3">
                    <VerificationBadge />
                  </div>
                  
                  {profile.verification.status === 'rejected' && (
                    <div className="alert alert-danger">
                      <strong>Rejection Reason:</strong> {profile.verification.rejectionReason}
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label className="form-label">ID Proof</label>
                    {profile.verification.documents.idProof ? (
                      <div className="mb-2">
                        <small>{profile.verification.documents.idProof.name}</small>
                        <button 
                          className="btn btn-sm btn-outline-primary d-block mt-1"
                          onClick={() => idProofRef.current.click()}
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => idProofRef.current.click()}
                      >
                        Upload ID
                      </button>
                    )}
                    <input 
                      type="file" 
                      ref={idProofRef}
                      onChange={(e) => handleDocumentUpload('idProof', e)}
                      accept="image/*,.pdf"
                      className="d-none"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Address Proof</label>
                    {profile.verification.documents.addressProof ? (
                      <div className="mb-2">
                        <small>{profile.verification.documents.addressProof.name}</small>
                        <button 
                          className="btn btn-sm btn-outline-primary d-block mt-1"
                          onClick={() => addressProofRef.current.click()}
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => addressProofRef.current.click()}
                      >
                        Upload Address Proof
                      </button>
                    )}
                    <input 
                      type="file" 
                      ref={addressProofRef}
                      onChange={(e) => handleDocumentUpload('addressProof', e)}
                      accept="image/*,.pdf"
                      className="d-none"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Qualification</label>
                    {profile.verification.documents.qualification ? (
                      <div className="mb-2">
                        <small>{profile.verification.documents.qualification.name}</small>
                        <button 
                          className="btn btn-sm btn-outline-primary d-block mt-1"
                          onClick={() => qualificationRef.current.click()}
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => qualificationRef.current.click()}
                      >
                        Upload Qualification
                      </button>
                    )}
                    <input 
                      type="file" 
                      ref={qualificationRef}
                      onChange={(e) => handleDocumentUpload('qualification', e)}
                      accept="image/*,.pdf"
                      className="d-none"
                    />
                  </div>
                  
                  {profile.verification.status !== 'verified' && (
                    <button 
                      className="btn btn-success w-100 mt-3"
                      onClick={submitVerification}
                      disabled={!allDocumentsUploaded()}
                    >
                      Submit for Verification
                    </button>
                  )}
                  
                  {profile.verification.status === 'verified' && (
                    <div className="alert alert-success mt-3">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Documents verified successfully!
                    </div>
                  )}
                </div>
              </div>
              
              {/* Interview Section */}
              <div className="card mt-4">
                <div className="card-header bg-info text-white">
                  <h3 className="mb-0">Interview</h3>
                </div>
                <div className="card-body">
                  <div className="text-center mb-3">
                    <InterviewBadge />
                  </div>
                  
                  {profile.verification.interview.status === 'failed' && (
                    <div className="alert alert-danger">
                      <strong>Feedback:</strong> {profile.verification.interview.feedback}
                    </div>
                  )}
                  
                  {profile.verification.interview.status === 'pending' && (
                    <div className="text-center">
                      <p>Interview required after document verification</p>
                      <button 
                        className="btn btn-info"
                        disabled={profile.verification.status !== 'verified'}
                        onClick={scheduleInterview}
                      >
                        Schedule Interview
                      </button>
                    </div>
                  )}
                  
                  {profile.verification.interview.status === 'scheduled' && (
                    <div>
                      <p className="text-center">
                        <strong>Interview Date:</strong> {profile.verification.interview.date}
                      </p>
                      <div className="d-grid gap-2">
                        <button className="btn btn-success" onClick={passInterview}>
                          Mark as Passed
                        </button>
                        <button className="btn btn-danger" onClick={failInterview}>
                          Mark as Failed
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {profile.verification.interview.status === 'passed' && (
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Interview passed successfully!
                    </div>
                  )}
                </div>
              </div>
              
              {/* Work Access Card */}
              <div className="card mt-4">
                <div className="card-header bg-success text-white">
                  <h3 className="mb-0">Work Access</h3>
                </div>
                <div className="card-body">
                  {isVerified() ? (
                    <>
                      <div className="text-center mb-3">
                        <i className="bi bi-check-circle-fill text-success" style={{fontSize: '3rem'}}></i>
                      </div>
                      <p className="text-center">You have full access to job opportunities!</p>
                      <button className="btn btn-success w-100">
                        Browse Jobs
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-3">
                        <i className="bi bi-lock-fill text-warning" style={{fontSize: '3rem'}}></i>
                      </div>
                      <p className="text-center">
                        Complete all verification steps to unlock job opportunities
                      </p>
                      <div className="progress mt-3">
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{width: `${profile.verification.documents.idProof ? 20 : 0}%`}}
                        ></div>
                        <div 
                          className="progress-bar bg-success" 
                          role="progressbar" 
                          style={{width: `${profile.verification.documents.addressProof ? 20 : 0}%`}}
                        ></div>
                        <div 
                          className="progress-bar bg-info" 
                          role="progressbar" 
                          style={{width: `${profile.verification.documents.qualification ? 20 : 0}%`}}
                        ></div>
                        <div 
                          className="progress-bar bg-warning" 
                          role="progressbar" 
                          style={{width: `${profile.verification.status === 'submitted' ? 20 : 0}%`}}
                        ></div>
                        <div 
                          className="progress-bar bg-danger" 
                          role="progressbar" 
                          style={{width: `${profile.verification.interview.status === 'passed' ? 20 : 0}%`}}
                        ></div>
                      </div>
                      <small className="text-muted d-block text-center mt-2">
                        {profile.verification.status === 'submitted' 
                          ? 'Verification in progress...' 
                          : 'Upload all documents to submit'}
                      </small>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;