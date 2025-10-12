import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import dashboardStyles from './dashboard.module.css';
import settingsStyles from './settings.module.css';
import { getWorkerApi, updateWorkerApi, createWorkerApi } from '../../services/workers';
import LoadingSpinner from '../../components/LoadingSpinner';

const Settings = () => {
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Edit mode state for each section
  const [editModes, setEditModes] = useState({
    personalDetails: false,
    profilePhoto: false,
    cv: false,
    experiences: false
  });

  // User profile state
  const [profile, setProfile] = useState({
    id: null,
    name: '',
    status: 'active',
    email: '',
    phone: '',
    bio: '',
    location: '',
    workRole: 'carpenter',
    profilePhoto: 'https://via.placeholder.com/150',
    cv: null,
    experiences: [],
    verification: {
      status: 'pending',
      documents: {
        idProof: null,
        addressProof: null,
        qualification: null
      },
      interview: {
        status: 'pending',
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

  // Fetch worker data
  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const savedUser = localStorage.getItem("user");
        if (!savedUser) throw new Error("No user data found. Please log in.");
        
        const userData = JSON.parse(savedUser);
        const userId = userData.id;
        if (!userId) throw new Error("User ID not found. Please log in again.");

        try {
          const workerData = await getWorkerApi(userId);
          setProfile(prev => ({
            ...prev,
            id: workerData.id,
            name: workerData.name || userData.name || '',
            email: workerData.email || userData.email || '',
            phone: workerData.phone || userData.phone || '',
            bio: workerData.bio || '',
            location: workerData.location || '',
            workRole: workerData.workRole || workerData.role || 'carpenter',
            profilePhoto: workerData.profilePhoto || workerData.profile_photo || 'https://via.placeholder.com/150',
            status: workerData.status || 'active',
            verification: {
              status: workerData.verification_status || 'pending',
              documents: {
                idProof: workerData.id_proof || null,
                addressProof: workerData.address_proof || null,
                qualification: workerData.qualification || null
              },
              interview: {
                status: workerData.interview_status || 'pending',
                date: workerData.interview_date || null,
                feedback: workerData.interview_feedback || ''
              },
              rejectionReason: workerData.rejection_reason || ''
            }
          }));
          
        } catch (workerErr) {
          if (workerErr?.response?.status === 404) {
            setProfile(prev => ({
              ...prev,
              id: userId,
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              bio: '',
              location: '',
              workRole: 'carpenter',
              profilePhoto: 'https://via.placeholder.com/150',
              status: 'active',
              verification: {
                status: 'pending',
                documents: { idProof: null, addressProof: null, qualification: null },
                interview: { status: 'pending', date: null, feedback: '' },
                rejectionReason: ''
              }
            }));
            setTimeout(() => {
              alert('Welcome! We\'ve created a new worker profile for you. Please fill in your details.');
            }, 1000);
          } else throw workerErr;
        }
        
      } catch (err) {
        console.error('Error fetching worker data:', err);
        setError(err.message || 'Failed to load worker data');
        
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setProfile(prev => ({
            ...prev,
            id: userData.id,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, []);

  // Toggle edit mode
  const toggleEditMode = (section) => {
    setEditModes(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
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

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({ 
        ...prev, 
        cv: { name: file.name, url: URL.createObjectURL(file) }
      }));
    }
  };

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
              [type]: { name: file.name, preview: e.target.result }
            }
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Verification functions
  const submitVerification = () => {
    setProfile(prev => ({
      ...prev,
      verification: { ...prev.verification, status: 'submitted' }
    }));
  };

  const scheduleInterview = () => {
    setProfile(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        interview: {
          ...prev.verification.interview,
          status: 'scheduled',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }
    }));
  };

  const passInterview = () => {
    setProfile(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        interview: { ...prev.verification.interview, status: 'passed' }
      }
    }));
  };

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

  // Experience functions
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
          description: '',
          currentlyWorking: false
        }
      ]
    }));
  };

  const updateExperience = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  // Save profile
  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const savedUser = localStorage.getItem("user");
      if (!savedUser) throw new Error("User data not found. Please log in again.");
      const userData = JSON.parse(savedUser);

      const workerData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        location: profile.location,
        workRole: profile.workRole,
        status: profile.status,
        user_id: userData.id,
        verification_status: profile.verification.status,
        interview_status: profile.verification.interview.status,
        interview_date: profile.verification.interview.date,
        interview_feedback: profile.verification.interview.feedback,
        rejection_reason: profile.verification.rejectionReason
      };

      if (profile.id && profile.id !== userData.id) {
        await updateWorkerApi(profile.id, workerData);
      } else {
        const newWorker = await createWorkerApi(workerData);
        setProfile(prev => ({ ...prev, id: newWorker.id }));
      }
      
      setEditModes({ personalDetails: false, profilePhoto: false, cv: false, experiences: false });
      alert('Profile saved successfully!');
      
    } catch (err) {
      console.error('Error saving profile:', err);
      alert(`Failed to save profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Status badges
  const VerificationBadge = () => {
    const status = profile.verification.status;
    const badges = {
      verified: { class: 'bg-success', text: 'Verified' },
      submitted: { class: 'bg-warning', text: 'Pending Review' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
      pending: { class: 'bg-secondary', text: 'Not Verified' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`badge ${badge.class} ${dashboardStyles.verificationBadge}`}>{badge.text}</span>;
  };

  const InterviewBadge = () => {
    const status = profile.verification.interview.status;
    const badges = {
      passed: { class: 'bg-success', text: 'Passed' },
      failed: { class: 'bg-danger', text: 'Failed' },
      scheduled: { class: 'bg-info', text: 'Scheduled' },
      pending: { class: 'bg-secondary', text: 'Pending' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`badge ${badge.class} ${dashboardStyles.interviewBadge}`}>{badge.text}</span>;
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { class: dashboardStyles.statusActive, text: 'Active' },
      inactive: { class: dashboardStyles.statusInactive, text: 'Inactive' },
      busy: { class: dashboardStyles.statusBusy, text: 'Busy' },
      available: { class: dashboardStyles.statusAvailable, text: 'Available' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`${dashboardStyles.statusIndicator} ${config.class}`}>{config.text}</span>;
  };

  // Helper functions
  const allDocumentsUploaded = () => {
    const docs = profile.verification.documents;
    return docs.idProof && docs.addressProof && docs.qualification;
  };

  const isVerified = () => {
    return profile.verification.status === 'verified' && 
           profile.verification.interview.status === 'passed';
  };

  const getVerificationProgress = () => {
    let progress = 0;
    const docs = profile.verification.documents;
    if (docs.idProof) progress += 20;
    if (docs.addressProof) progress += 20;
    if (docs.qualification) progress += 20;
    if (profile.verification.status === 'submitted') progress += 20;
    if (profile.verification.interview.status === 'passed') progress += 20;
    return progress;
  };

  if (loading) {
    return (
      <div className={dashboardStyles.dashboardContainer}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={dashboardStyles.dashboardContainer}>
        <div className="container-fluid py-4">
          <div className="alert alert-danger">
            <h4>Error Loading Profile</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboardStyles.dashboardContainer}>
      {/* Sidebar */}
      <div className={dashboardStyles.sidebar}>
        <div className={dashboardStyles.logo}>
          <h2>WorkerDash</h2>
        </div>
        <nav className={dashboardStyles.navMenu}>
          <Link to="/worker/dashboard" className={dashboardStyles.navItem}>
            <i className="icon-dashboard"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/worker/works" className={dashboardStyles.navItem}>
            <i className="icon-orders"></i>
            <span>Works</span>
          </Link>
          <Link to="/worker/payments" className={dashboardStyles.navItem}>
            <i className="icon-payments"></i>
            <span>Payments</span>
          </Link>
          <Link to="/worker/inventory" className={dashboardStyles.navItem}>
            <i className="icon-inventory"></i>
            <span>Inventory</span>
          </Link>
          <Link to="/worker/clients" className={dashboardStyles.navItem}>
            <i className="icon-clients"></i>
            <span>Clients</span>
          </Link>
          <Link to="/worker/reports" className={dashboardStyles.navItem}>
            <i className="icon-reports"></i>
            <span>Reports</span>
          </Link>
          <Link to="/worker/calls" className={dashboardStyles.navItem}>
            <i className="icon-calls"></i>
            <span>Calls</span>
          </Link>
          <Link to="/worker/settings" className={`${dashboardStyles.navItem} ${dashboardStyles.active}`}>
            <i className="icon-settings"></i>
            <span>Settings</span>
          </Link>
        </nav>
        <div className={dashboardStyles.userProfile}>
          <div className={dashboardStyles.avatar}>
            <i className="icon-user"></i>
          </div>
          <div className={dashboardStyles.userInfo}>
            <div className={dashboardStyles.username}>{profile.name || 'Worker'}</div>
            <div className={dashboardStyles.role}>Worker</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={dashboardStyles.mainContent}>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-lg-8">
              <div className={dashboardStyles.sectionHeader}>
                <h1 className={dashboardStyles.sectionTitle}>Profile Settings</h1>
                <p className="text-muted mb-0">Manage your profile and verification status</p>
              </div>

              {/* Personal Details */}
              <div className={`${dashboardStyles.enhancedCard} ${settingsStyles.fadeIn}`}>
                <div className={dashboardStyles.enhancedCardHeader}>
                  <div className={dashboardStyles.sectionHeader}>
                    <h2 className={dashboardStyles.sectionTitle}>Personal Details</h2>
                    <button 
                      className={`btn ${editModes.personalDetails ? 'btn-secondary' : 'btn-primary'} ${dashboardStyles.actionButton}`}
                      onClick={() => toggleEditMode('personalDetails')}
                    >
                      {editModes.personalDetails ? (
                        <>✕ Cancel</>
                      ) : (
                        <>✎ Edit Details</>
                      )}
                    </button>
                  </div>
                </div>
                <div className={dashboardStyles.enhancedCardBody}>
                  {editModes.personalDetails ? (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <input type="text" className="form-control" name="name" value={profile.name} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <input type="email" className="form-control" name="email" value={profile.email} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <input type="tel" className="form-control" name="phone" value={profile.phone} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Location</label>
                          <input type="text" className="form-control" name="location" value={profile.location} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Work Role</label>
                          <select className="form-control" name="workRole" value={profile.workRole} onChange={handleInputChange}>
                            <option value="carpenter">Carpenter</option>
                            <option value="electrician">Electrician</option>
                            <option value="plumber">Plumber</option>
                            <option value="gardener">Gardener</option>
                            <option value="housekeeper">Housekeeper</option>
                            <option value="technician">Technician</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <select className="form-control" name="status" value={profile.status} onChange={handleInputChange}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="busy">Busy</option>
                            <option value="available">Available</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label">Bio</label>
                          <textarea className="form-control" name="bio" value={profile.bio} onChange={handleInputChange} rows="4" 
                            placeholder="Tell us about your skills and experience..." />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={settingsStyles.viewModeGrid}>
                      <div className={settingsStyles.viewField}>
                        <strong>Full Name</strong>
                        <p>{profile.name || 'Not provided'}</p>
                      </div>
                      <div className={settingsStyles.viewField}>
                        <strong>Email Address</strong>
                        <p>{profile.email || 'Not provided'}</p>
                      </div>
                      <div className={settingsStyles.viewField}>
                        <strong>Phone Number</strong>
                        <p>{profile.phone || 'Not provided'}</p>
                      </div>
                      <div className={settingsStyles.viewField}>
                        <strong>Location</strong>
                        <p>{profile.location || 'Not provided'}</p>
                      </div>
                      <div className={settingsStyles.viewField}>
                        <strong>Work Role</strong>
                        <p>{profile.workRole || 'Not specified'}</p>
                      </div>
                      <div className={settingsStyles.viewField}>
                        <strong>Status</strong>
                        <p><StatusBadge status={profile.status} /></p>
                      </div>
                      <div className={settingsStyles.viewField} style={{ gridColumn: '1 / -1' }}>
                        <strong>Bio</strong>
                        <p>{profile.bio || 'No bio provided'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Photo */}
              <div className={`${dashboardStyles.enhancedCard} ${settingsStyles.fadeIn}`}>
                <div className={dashboardStyles.enhancedCardHeader}>
                  <div className={dashboardStyles.sectionHeader}>
                    <h2 className={dashboardStyles.sectionTitle}>Profile Photo</h2>
                    <button 
                      className={`btn ${editModes.profilePhoto ? 'btn-secondary' : 'btn-primary'} ${dashboardStyles.actionButton}`}
                      onClick={() => toggleEditMode('profilePhoto')}
                    >
                      {editModes.profilePhoto ? 'Cancel' : 'Change Photo'}
                    </button>
                  </div>
                </div>
                <div className={dashboardStyles.enhancedCardBody}>
                  <div className={dashboardStyles.profilePhotoContainer}>
                    <img src={profile.profilePhoto} alt="Profile" className={dashboardStyles.profilePhoto} />
                    <div>
                      {editModes.profilePhoto ? (
                        <>
                          <p className="text-muted mb-3">Upload a clear profile photo for better recognition</p>
                          <button className={`btn btn-primary ${dashboardStyles.actionButton}`} 
                            onClick={() => photoInputRef.current.click()}>
                            📁 Choose Photo
                          </button>
                          <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} accept="image/*" className="d-none" />
                        </>
                      ) : (
                        <p className="text-muted">Your profile photo helps build trust with clients</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Upload */}
              <div className={`${dashboardStyles.enhancedCard} ${settingsStyles.fadeIn}`}>
                <div className={dashboardStyles.enhancedCardHeader}>
                  <div className={dashboardStyles.sectionHeader}>
                    <h2 className={dashboardStyles.sectionTitle}>Professional CV</h2>
                    <button 
                      className={`btn ${editModes.cv ? 'btn-secondary' : 'btn-primary'} ${dashboardStyles.actionButton}`}
                      onClick={() => toggleEditMode('cv')}
                    >
                      {editModes.cv ? 'Cancel' : 'Manage CV'}
                    </button>
                  </div>
                </div>
                <div className={dashboardStyles.enhancedCardBody}>
                  {editModes.cv ? (
                    <div className={dashboardStyles.fileUploadArea} onClick={() => cvInputRef.current.click()}>
                      {profile.cv ? (
                        <div className="text-center">
                          <i className="bi bi-file-earmark-text-fill text-primary" style={{fontSize: '3rem'}}></i>
                          <h5 className="mt-3">Current CV: {profile.cv.name}</h5>
                          <p className="text-muted">Click to replace your CV</p>
                          <a href={profile.cv.url} target="_blank" rel="noopener noreferrer" 
                            className="btn btn-outline-primary me-2">
                            👁️ View CV
                          </a>
                          <button className="btn btn-outline-secondary">🔄 Replace</button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <i className="bi bi-cloud-upload text-muted" style={{fontSize: '3rem'}}></i>
                          <h5 className="mt-3">Upload Your CV</h5>
                          <p className="text-muted">PDF, DOC, or DOCX files accepted</p>
                          <button className="btn btn-primary">📄 Upload CV</button>
                        </div>
                      )}
                      <input type="file" ref={cvInputRef} onChange={handleCvUpload} accept=".pdf,.doc,.docx" className="d-none" />
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      {profile.cv ? (
                        <>
                          <i className="bi bi-file-earmark-check-fill text-success" style={{fontSize: '3rem'}}></i>
                          <h5 className="mt-3">CV Uploaded</h5>
                          <p className="text-muted">Your CV is ready for client reviews</p>
                          <a href={profile.cv.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                            👁️ View CV
                          </a>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-file-earmark-plus text-muted" style={{fontSize: '3rem'}}></i>
                          <h5 className="mt-3">No CV Uploaded</h5>
                          <p className="text-muted">Upload your CV to increase job opportunities</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div className={`${dashboardStyles.enhancedCard} ${settingsStyles.fadeIn}`}>
                <div className={dashboardStyles.enhancedCardHeader}>
                  <div className={dashboardStyles.sectionHeader}>
                    <h2 className={dashboardStyles.sectionTitle}>
                      Work Experience {profile.experiences.length > 0 && `(${profile.experiences.length})`}
                    </h2>
                    <div className={settingsStyles.editToggle}>
                      <button 
                        className={`btn ${editModes.experiences ? 'btn-secondary' : 'btn-primary'} ${dashboardStyles.actionButton}`}
                        onClick={() => toggleEditMode('experiences')}
                      >
                        {editModes.experiences ? 'Cancel' : '✎ Edit'}
                      </button>
                      {editModes.experiences && (
                        <button className={`btn btn-success ${dashboardStyles.actionButton}`} onClick={addExperience}>
                          ➕ Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className={dashboardStyles.enhancedCardBody}>
                  {editModes.experiences ? (
                    <>
                      {profile.experiences.length === 0 ? (
                        <div className={dashboardStyles.emptyState}>
                          <div className={dashboardStyles.emptyStateIcon}>💼</div>
                          <h5>No Experience Added</h5>
                          <p className="text-muted">Add your work experience to showcase your expertise</p>
                          <button className={`btn btn-primary ${dashboardStyles.actionButton}`} onClick={addExperience}>
                            Add Your First Experience
                          </button>
                        </div>
                      ) : (
                        profile.experiences.map(exp => (
                          <div key={exp.id} className="border rounded p-4 mb-3">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Company</label>
                                  <input type="text" className="form-control" value={exp.company} 
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} 
                                    placeholder="Company name" />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Position</label>
                                  <input type="text" className="form-control" value={exp.position} 
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} 
                                    placeholder="Job title" />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Start Date</label>
                                  <input type="date" className="form-control" value={exp.startDate} 
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">End Date</label>
                                  <input type="date" className="form-control" value={exp.endDate} 
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} 
                                    disabled={exp.currentlyWorking} />
                                  <div className="form-check mt-2">
                                    <input className="form-check-input" type="checkbox" 
                                      checked={exp.currentlyWorking}
                                      onChange={(e) => updateExperience(exp.id, 'currentlyWorking', e.target.checked)} />
                                    <label className="form-check-label">I currently work here</label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="form-label">Description</label>
                                  <textarea className="form-control" value={exp.description} 
                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} 
                                    rows="3" placeholder="Describe your responsibilities and achievements" />
                                </div>
                              </div>
                              <div className="col-12">
                                <button className="btn btn-danger btn-sm" onClick={() => removeExperience(exp.id)}>
                                  🗑️ Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  ) : (
                    <>
                      {profile.experiences.length === 0 ? (
                        <div className={dashboardStyles.emptyState}>
                          <div className={dashboardStyles.emptyStateIcon}>💼</div>
                          <h5>No Experience Added</h5>
                          <p className="text-muted">Add your work experience to showcase your expertise</p>
                        </div>
                      ) : (
                        profile.experiences.map(exp => (
                          <div key={exp.id} className={settingsStyles.experienceItem}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h5 className="mb-1">{exp.position || 'Untitled Position'}</h5>
                                <h6 className="text-primary mb-2">{exp.company || 'Unknown Company'}</h6>
                              </div>
                              <span className="text-muted">
                                {exp.startDate || 'Unknown'} - {exp.currentlyWorking ? 'Present' : (exp.endDate || 'Unknown')}
                              </span>
                            </div>
                            <p className="mb-0 text-muted">{exp.description || 'No description provided'}</p>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {(editModes.personalDetails || editModes.profilePhoto || editModes.cv || editModes.experiences) && (
                <div className="text-center mt-4 p-4 bg-light rounded">
                  <h5 className="mb-3">Ready to save your changes?</h5>
                  <button className={`btn btn-primary btn-lg ${dashboardStyles.actionButton} me-3`} 
                    onClick={saveProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      '💾 Save All Changes'
                    )}
                  </button>
                  <button className="btn btn-secondary btn-lg" 
                    onClick={() => setEditModes({ personalDetails: false, profilePhoto: false, cv: false, experiences: false })}>
                    Cancel All
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar - Verification */}
            <div className="col-lg-4">
              <div className={settingsStyles.verificationPanel}>

                {/* Verification Status */}
                <div className={`${dashboardStyles.enhancedCard} mb-4`}>
                  <div className={`card-header bg-primary text-white ${dashboardStyles.enhancedCardHeader}`}>
                    <h3 className="mb-0">🔒 Verification Status</h3>
                  </div>
                  <div className={dashboardStyles.enhancedCardBody}>
                    <div className="text-center mb-4">
                      <VerificationBadge />
                    </div>
                    
                    {/* Verification Steps */}
                    <div className={settingsStyles.verificationStep}>
                      <div className={settingsStyles.stepNumber}>1</div>
                      <div className={settingsStyles.stepContent}>
                        <h6 className="mb-1">Upload Documents</h6>
                        <small className="text-muted">ID, Address, and Qualification proofs</small>
                      </div>
                    </div>
                    
                    <div className={`${settingsStyles.verificationStep} ${
                      profile.verification.status === 'submitted' || profile.verification.status === 'verified' ? settingsStyles.completed : ''
                    }`}>
                      <div className={settingsStyles.stepNumber}>2</div>
                      <div className={settingsStyles.stepContent}>
                        <h6 className="mb-1">Document Review</h6>
                        <small className="text-muted">Our team verifies your documents</small>
                      </div>
                    </div>
                    
                    <div className={`${settingsStyles.verificationStep} ${
                      profile.verification.interview.status === 'scheduled' || 
                      profile.verification.interview.status === 'passed' ? settingsStyles.completed : ''
                    }`}>
                      <div className={settingsStyles.stepNumber}>3</div>
                      <div className={settingsStyles.stepContent}>
                        <h6 className="mb-1">Interview</h6>
                        <small className="text-muted">Skill assessment interview</small>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="d-flex justify-content-between mb-2">
                        <small>Verification Progress</small>
                        <small>{getVerificationProgress()}%</small>
                      </div>
                      <div className={dashboardStyles.verificationProgress}>
                        <div className={dashboardStyles.progressStep} style={{ 
                          width: `${getVerificationProgress()}%`,
                          background: 'linear-gradient(135deg, #007bff, #0056b3)'
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className={`${dashboardStyles.enhancedCard} mb-4`}>
                  <div className={`card-header bg-info text-white ${dashboardStyles.enhancedCardHeader}`}>
                    <h3 className="mb-0">📄 Required Documents</h3>
                  </div>
                  <div className={dashboardStyles.enhancedCardBody}>
                    {['idProof', 'addressProof', 'qualification'].map((docType) => (
                      <div key={docType} className={`${settingsStyles.documentItem} ${
                        profile.verification.documents[docType] ? settingsStyles.uploaded : ''
                      }`}>
                        <div className={settingsStyles.documentHeader}>
                          <span className={settingsStyles.documentName}>
                            {docType === 'idProof' && '🆔 ID Proof'}
                            {docType === 'addressProof' && '🏠 Address Proof'}
                            {docType === 'qualification' && '🎓 Qualification'}
                          </span>
                          <span className={settingsStyles.documentStatus}>
                            {profile.verification.documents[docType] ? 'Uploaded' : 'Pending'}
                          </span>
                        </div>
                        {profile.verification.documents[docType] ? (
                          <small className="text-success">✓ {profile.verification.documents[docType].name}</small>
                        ) : (
                          <button className="btn btn-outline-primary btn-sm mt-2" 
                            onClick={() => {
                              const ref = docType === 'idProof' ? idProofRef : 
                                        docType === 'addressProof' ? addressProofRef : qualificationRef;
                              ref.current.click();
                            }}>
                            📤 Upload
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <input type="file" ref={idProofRef} onChange={(e) => handleDocumentUpload('idProof', e)} className="d-none" />
                    <input type="file" ref={addressProofRef} onChange={(e) => handleDocumentUpload('addressProof', e)} className="d-none" />
                    <input type="file" ref={qualificationRef} onChange={(e) => handleDocumentUpload('qualification', e)} className="d-none" />

                    {profile.verification.status !== 'verified' && (
                      <button className={`btn btn-success w-100 mt-3 ${dashboardStyles.actionButton}`}
                        onClick={submitVerification} disabled={!allDocumentsUploaded()}>
                        {allDocumentsUploaded() ? '✅ Submit for Verification' : 'Upload all documents to submit'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Interview Status */}
                <div className={`${dashboardStyles.enhancedCard} mb-4`}>
                  <div className={`card-header bg-warning text-white ${dashboardStyles.enhancedCardHeader}`}>
                    <h3 className="mb-0">🎤 Interview</h3>
                  </div>
                  <div className={dashboardStyles.enhancedCardBody}>
                    <div className="text-center mb-3">
                      <InterviewBadge />
                    </div>

                    {profile.verification.interview.status === 'scheduled' && (
                      <div className={settingsStyles.interviewSchedule}>
                        <h6 className="mb-2">📅 Interview Scheduled</h6>
                        <div className={settingsStyles.interviewDate}>{profile.verification.interview.date}</div>
                        <small className="text-muted">Please be available for the video call</small>
                      </div>
                    )}

                    {profile.verification.interview.status === 'failed' && (
                      <div className="alert alert-danger">
                        <strong>Feedback:</strong> {profile.verification.interview.feedback}
                      </div>
                    )}

                    {profile.verification.status === 'verified' && profile.verification.interview.status === 'pending' && (
                      <div className="text-center">
                        <button className={`btn btn-info ${dashboardStyles.actionButton}`} onClick={scheduleInterview}>
                          🗓️ Schedule Interview
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Access */}
                <div className={settingsStyles.accessCard}>
                  <div className={settingsStyles.accessContent}>
                    <div className={settingsStyles.accessIcon}>
                      {isVerified() ? '✅' : '🔒'}
                    </div>
                    <h3 className={settingsStyles.accessTitle}>
                      {isVerified() ? 'Full Access Granted' : 'Verify to Access Jobs'}
                    </h3>
                    <p className={settingsStyles.accessDescription}>
                      {isVerified() 
                        ? 'You can now browse and apply for all available job opportunities'
                        : 'Complete verification to unlock job opportunities and start working'
                      }
                    </p>
                    <button className={`btn ${isVerified() ? 'btn-light' : 'btn-warning'} ${dashboardStyles.actionButton}`}>
                      {isVerified() ? '🚀 Browse Jobs' : 'Complete Verification'}
                    </button>
                  </div>
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