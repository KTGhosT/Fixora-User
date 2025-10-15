// src/pages/worker/Settings.jsx
import React, { useState, useEffect } from 'react';
import {
  getWorkerSettingsByUserId,
  updateWorkerSettings,
  getWorkerStatusOptions,
  getEducationOptions,
  validateWorkerData,
  validateUserData,
  debugWorkerSettings
} from '../../services/workerSettings';

const Settings = () => {
  const [user, setUser] = useState({});
  const [worker, setWorker] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (!savedUser) {
          alert('User not logged in');
          return;
        }
        setUser(savedUser);
        const workerData = await getWorkerSettingsByUserId(savedUser.id);
        const extractedWorker = workerData?.worker || workerData || {};
        setWorker(extractedWorker);
      } catch (err) {
        console.error('Error fetching worker ', err);
        if (err.response?.status === 500) {
          alert('Server error. Please try again later.');
        } else if (err.response?.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else {
          alert('Failed to load profile. Check your connection.');
        }
        setWorker({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkerChange = (e) => {
    const { name, value } = e.target;
    setWorker(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      
      const userData = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address
      };
      
      const workerData = {
        work_role: worker.work_role || '',
        bio: worker.bio || '',
        status: worker.status || 'available',
        experience_level: worker.experience_level || '',
        availability: worker.availability || '',
        short_info: worker.short_info || '',
        minimum_education: worker.minimum_education || ''
      };
      
      const cleanedUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, v]) => v !== '')
      );
      const cleanedWorkerData = Object.fromEntries(
        Object.entries(workerData).filter(([_, v]) => v !== '')
      );
      
      const userValidation = validateUserData(cleanedUserData);
      const workerValidation = validateWorkerData(cleanedWorkerData);
      
      if (!userValidation.isValid || !workerValidation.isValid) {
        const errors = [
          ...Object.values(userValidation.errors || {}),
          ...Object.values(workerValidation.errors || {})
        ].join(', ');
        alert(`Validation error: ${errors}`);
        return;
      }
      
      await updateWorkerSettings(user.id, worker.id, cleanedUserData, cleanedWorkerData);
      const debugData = await debugWorkerSettings(user.id, worker.id);
      
      if (debugData.user) setUser(prev => ({ ...prev, ...debugData.user }));
      if (debugData.worker) setWorker(prev => ({ ...prev, ...debugData.worker }));
      
      alert('✅ Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Save error:', err);
      if (err.response?.status === 422 && err.response.data?.errors) {
        const msgs = Object.values(err.response.data.errors).flat().join(', ');
        alert(`Fix these: ${msgs}`);
      } else {
        alert('❌ Failed to save. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    // ✨ Animated container that fits inside WorkerLayout
    <div className="animate-fadeInUp max-w-4xl w-full mx-auto px-4 py-6 md:px-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your personal & work details</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-6 space-y-8">
          {/* Edit Toggle */}
          <div className="flex justify-end">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                editMode
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Personal Info */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="First Name"
                name="first_name"
                value={user.first_name || ''}
                onChange={handleUserChange}
                disabled={!editMode}
              />
              <InputField
                label="Last Name"
                name="last_name"
                value={user.last_name || ''}
                onChange={handleUserChange}
                disabled={!editMode}
              />
              <InputField
                label="Email"
                name="email"
                value={user.email || ''}
                onChange={handleUserChange}
                disabled={true}
              />
              <InputField
                label="Phone"
                name="phone"
                value={user.phone || ''}
                onChange={handleUserChange}
                disabled={!editMode}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Address"
                  name="address"
                  value={user.address || ''}
                  onChange={handleUserChange}
                  disabled={!editMode}
                />
              </div>
            </div>
          </Section>

          {/* Work Info */}
          <Section title="Work Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Work Role"
                name="work_role"
                value={worker.work_role || ''}
                onChange={handleWorkerChange}
                disabled={!editMode}
              />
              <InputField
                label="Experience Level"
                name="experience_level"
                value={worker.experience_level || ''}
                onChange={handleWorkerChange}
                disabled={!editMode}
              />
              <InputField
                label="Availability"
                name="availability"
                value={worker.availability || ''}
                onChange={handleWorkerChange}
                disabled={!editMode}
              />
              <InputField
                label="Short Info"
                name="short_info"
                value={worker.short_info || ''}
                onChange={handleWorkerChange}
                disabled={!editMode}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={worker.bio || ''}
                  onChange={handleWorkerChange}
                  disabled={!editMode}
                  className={`w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                    !editMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                  }`}
                  rows="3"
                />
              </div>
              <SelectField
                label="Status"
                name="status"
                value={worker.status || ''}
                onChange={handleWorkerChange}
                options={getWorkerStatusOptions()}
                disabled={!editMode}
              />
              <SelectField
                label="Minimum Education"
                name="minimum_education"
                value={worker.minimum_education || ''}
                onChange={handleWorkerChange}
                options={getEducationOptions()}
                disabled={!editMode}
              />
            </div>
          </Section>

          {/* Save Button */}
          {editMode && (
            <div className="pt-4">
              <button
                onClick={saveChanges}
                disabled={saving}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] ${
                  saving
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  '💾 Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Updated Section: removed animate-pulse (not for static content!)
const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
      {title}
    </h2>
    {children}
  </div>
);

const InputField = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
        disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
      }`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
        disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
      }`}
    >
      <option value="">Select...</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Settings;