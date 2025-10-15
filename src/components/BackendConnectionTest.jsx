import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/api.jsx';

const BackendConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing backend connection...');
        setConnectionStatus('testing');
        
        // Test basic connection
        const response = await axiosInstance.get('/api/profile');
        console.log('Backend connection successful:', response.data);
        setResponse(response.data);
        setConnectionStatus('success');
      } catch (err) {
        console.error('Backend connection failed:', err);
        setError(err.message);
        setConnectionStatus('failed');
      }
    };

    testConnection();
  }, []);

  const testBookingEndpoint = async () => {
    try {
      console.log('Testing booking endpoint...');
      const response = await axiosInstance.get('/api/bookings');
      console.log('Booking endpoint response:', response.data);
      setResponse(response.data);
    } catch (err) {
      console.error('Booking endpoint test failed:', err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Backend Connection Test</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>Status:</strong> 
        <span style={{ 
          color: connectionStatus === 'success' ? 'green' : 
                 connectionStatus === 'failed' ? 'red' : 'orange',
          marginLeft: '0.5rem'
        }}>
          {connectionStatus === 'testing' ? 'Testing...' :
           connectionStatus === 'success' ? 'Connected ✓' :
           connectionStatus === 'failed' ? 'Failed ✗' : connectionStatus}
        </span>
      </div>

      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c00', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ 
          background: '#efe', 
          color: '#060', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Response:</strong> 
          <pre style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <button 
        onClick={testBookingEndpoint}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Booking Endpoint
      </button>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>Backend URL:</strong> http://127.0.0.1:8000</p>
        <p><strong>Make sure your backend server is running!</strong></p>
      </div>
    </div>
  );
};

export default BackendConnectionTest;