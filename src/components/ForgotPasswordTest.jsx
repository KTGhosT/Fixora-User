import React, { useState } from 'react';
import axiosInstance from '../services/api';

const ForgotPasswordTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testForgotPasswordAPI = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test 1: Send forgot password request
    try {
      addResult('Send Reset Link', 'testing', 'Testing /api/forgot-password endpoint...');
      
      const response = await axiosInstance.post('/api/forgot-password', {
        email: 'test@example.com'
      });
      
      addResult('Send Reset Link', 'success', `Success: ${response.status} - ${response.data?.message || 'Reset link sent'}`);
    } catch (error) {
      addResult('Send Reset Link', 'error', `Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    // Test 2: Verify reset token
    try {
      addResult('Verify Token', 'testing', 'Testing /api/verify-reset-token endpoint...');
      
      const response = await axiosInstance.post('/api/verify-reset-token', {
        token: 'test-token-123'
      });
      
      addResult('Verify Token', 'success', `Success: ${response.status} - Token verified`);
    } catch (error) {
      addResult('Verify Token', 'error', `Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    // Test 3: Reset password
    try {
      addResult('Reset Password', 'testing', 'Testing /api/reset-password endpoint...');
      
      const response = await axiosInstance.post('/api/reset-password', {
        token: 'test-token-123',
        password: 'newpassword123',
        password_confirmation: 'newpassword123'
      });
      
      addResult('Reset Password', 'success', `Success: ${response.status} - Password reset`);
    } catch (error) {
      addResult('Reset Password', 'error', `Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Forgot Password API Test</h2>
      <p>This component tests the forgot password API endpoints to ensure they're working correctly.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testForgotPasswordAPI}
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
          {isLoading ? 'Testing...' : 'Run API Tests'}
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
        <h4>Expected Backend Routes:</h4>
        <ul>
          <li><code>POST /api/forgot-password</code> - Send reset link</li>
          <li><code>POST /api/verify-reset-token</code> - Verify reset token</li>
          <li><code>POST /api/reset-password</code> - Reset password</li>
        </ul>
        
        <h4>API Base URL:</h4>
        <p><code>http://127.0.0.1:8000</code></p>
      </div>
    </div>
  );
};

export default ForgotPasswordTest;
