import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

const PasswordResetDebug = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [urlInfo, setUrlInfo] = useState({});

  useEffect(() => {
    setUrlInfo({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      token: searchParams.get('token'),
      allParams: Object.fromEntries(searchParams.entries())
    });
  }, [location, searchParams]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Password Reset URL Debug</h2>
      <p>This page helps debug password reset URL routing issues.</p>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Current URL Information:</h3>
        <pre style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
          {JSON.stringify(urlInfo, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '5px' }}>
        <h3>Test URLs:</h3>
        <p>Try these URLs to test different routing patterns:</p>
        <ul>
          <li><a href="/password-reset?token=test123" target="_blank">/password-reset?token=test123</a></li>
          <li><a href="/reset-password?token=test123" target="_blank">/reset-password?token=test123</a></li>
          <li><a href="/forgot-password?token=test123" target="_blank">/forgot-password?token=test123</a></li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <h3>Expected Backend URL Format:</h3>
        <p>Your Laravel backend should send reset links in this format:</p>
        <code>http://localhost:5175/password-reset?token=YOUR_RESET_TOKEN</code>
        <br /><br />
        <p>Or alternatively:</p>
        <code>http://localhost:5175/reset-password?token=YOUR_RESET_TOKEN</code>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '5px' }}>
        <h3>Common Issues:</h3>
        <ul>
          <li><strong>Wrong URL format:</strong> Backend sending wrong URL pattern</li>
          <li><strong>Missing token:</strong> Token not included in URL parameters</li>
          <li><strong>Redirect issue:</strong> Catch-all route redirecting to home</li>
          <li><strong>Port mismatch:</strong> Backend sending wrong port number</li>
        </ul>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
        <h3>Quick Fix:</h3>
        <p>If the password reset link is redirecting to home, check:</p>
        <ol>
          <li>What URL is your Laravel backend sending in the email?</li>
          <li>Does the URL match one of the routes we defined?</li>
          <li>Is the token parameter included in the URL?</li>
        </ol>
      </div>
    </div>
  );
};

export default PasswordResetDebug;
