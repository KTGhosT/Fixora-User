import React, { useState } from 'react';
import axiosInstance from '../services/api';

const BackendConnectionTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test 1: Basic connectivity
    try {
      addResult('Basic Connection', 'testing', 'Testing basic connectivity to backend...');
      
      const response = await axiosInstance.get('/api/profile');
      addResult('Basic Connection', 'success', `Backend is running! Status: ${response.status}`);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        addResult('Basic Connection', 'error', 'Network Error: Backend server is not running or not accessible');
      } else if (error.response?.status === 401) {
        addResult('Basic Connection', 'success', 'Backend is running! (401 Unauthorized is expected for /api/profile)');
      } else {
        addResult('Basic Connection', 'error', `Error: ${error.response?.status} - ${error.message}`);
      }
    }

    // Test 2: CORS check
    try {
      addResult('CORS Check', 'testing', 'Testing CORS configuration...');
      
      const response = await axiosInstance.options('/api/forgot-password');
      addResult('CORS Check', 'success', 'CORS is properly configured');
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        addResult('CORS Check', 'error', 'Cannot test CORS - backend not accessible');
      } else {
        addResult('CORS Check', 'success', 'CORS request completed (even if failed, it means CORS is working)');
      }
    }

    // Test 3: Forgot password endpoint
    try {
      addResult('Forgot Password Endpoint', 'testing', 'Testing /api/forgot-password endpoint...');
      
      const response = await axiosInstance.post('/api/forgot-password', {
        email: 'test@example.com'
      });
      addResult('Forgot Password Endpoint', 'success', `Endpoint exists! Status: ${response.status}`);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        addResult('Forgot Password Endpoint', 'error', 'Network Error: Backend server is not running');
      } else if (error.response?.status === 404) {
        addResult('Forgot Password Endpoint', 'error', '404 Not Found: Route not defined in backend');
      } else if (error.response?.status === 422) {
        addResult('Forgot Password Endpoint', 'success', 'Endpoint exists! (422 validation error is expected)');
      } else {
        addResult('Forgot Password Endpoint', 'error', `Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
    }

    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Backend Connection Test</h2>
      <p>This will test if your Laravel backend server is running and accessible.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testBackendConnection}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      {testResults.length > 0 && (
        <div>
          <h3>Test Results:</h3>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                backgroundColor: 
                  result.status === 'success' ? '#d4edda' :
                  result.status === 'error' ? '#f8d7da' :
                  result.status === 'testing' ? '#fff3cd' : '#e2e3e5',
                border: `1px solid ${
                  result.status === 'success' ? '#c3e6cb' :
                  result.status === 'error' ? '#f5c6cb' :
                  result.status === 'testing' ? '#ffeaa7' : '#d6d8db'
                }`
              }}
            >
              <strong>{result.test}</strong> - {result.status.toUpperCase()}
              <br />
              <small>{result.message}</small>
              <br />
              <small style={{ color: '#666' }}>{result.timestamp}</small>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Quick Fixes:</h4>
        <ol>
          <li><strong>Start Laravel Server:</strong> Run <code>php artisan serve</code> in your Laravel project</li>
          <li><strong>Check Port:</strong> Ensure Laravel is running on port 8000</li>
          <li><strong>Verify Routes:</strong> Check that your API routes are defined in <code>routes/api.php</code></li>
          <li><strong>CORS:</strong> Make sure CORS is configured for your frontend domain</li>
        </ol>
        
        <h4>Expected Backend URL:</h4>
        <p><code>http://127.0.0.1:8000</code> or <code>http://localhost:8000</code></p>
      </div>
    </div>
  );
};

export default BackendConnectionTest;
