import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SimpleLoadingSpinner from './SimpleLoadingSpinner';

const LoadingSpinnerTest = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSimpleSpinner, setShowSimpleSpinner] = useState(false);
  const [spinnerType, setSpinnerType] = useState('complex');

  const toggleSpinner = () => {
    setShowSpinner(!showSpinner);
  };

  const toggleSimpleSpinner = () => {
    setShowSimpleSpinner(!showSimpleSpinner);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Loading Spinner Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input 
            type="radio" 
            name="spinnerType" 
            value="complex" 
            checked={spinnerType === 'complex'}
            onChange={(e) => setSpinnerType(e.target.value)}
            style={{ marginRight: '8px' }}
          />
          Complex Spinner (Original)
        </label>
        <br />
        <label>
          <input 
            type="radio" 
            name="spinnerType" 
            value="simple" 
            checked={spinnerType === 'simple'}
            onChange={(e) => setSpinnerType(e.target.value)}
            style={{ marginRight: '8px' }}
          />
          Simple Spinner (Test)
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={toggleSpinner}
          disabled={spinnerType !== 'complex'}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: spinnerType === 'complex' ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: spinnerType === 'complex' ? 'pointer' : 'not-allowed',
            marginRight: '10px'
          }}
        >
          {showSpinner ? 'Hide' : 'Show'} Complex Spinner
        </button>

        <button 
          onClick={toggleSimpleSpinner}
          disabled={spinnerType !== 'simple'}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: spinnerType === 'simple' ? '#28a745' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: spinnerType === 'simple' ? 'pointer' : 'not-allowed'
          }}
        >
          {showSimpleSpinner ? 'Hide' : 'Show'} Simple Spinner
        </button>
      </div>
      
      {showSpinner && <LoadingSpinner />}
      {showSimpleSpinner && <SimpleLoadingSpinner />}
      
      <div style={{ marginTop: '20px' }}>
        <p>Click the buttons above to test the loading spinners.</p>
        <p>The spinners should appear as full-screen overlays with blur backgrounds.</p>
        <p><strong>Complex Spinner:</strong> Advanced text animation with multiple layers</p>
        <p><strong>Simple Spinner:</strong> Basic rotating circle with text</p>
      </div>
    </div>
  );
};

export default LoadingSpinnerTest;
