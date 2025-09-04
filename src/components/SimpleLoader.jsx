import React from 'react';

const SimpleLoader = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f8f9fa',
    color: '#495057'
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '5px solid #e9ecef',
    borderTop: '5px solid #3b71fe',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1.5rem'
  };

  const textStyle = {
    fontSize: '1.3rem',
    fontWeight: '500',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <p style={textStyle}>Loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleLoader;
