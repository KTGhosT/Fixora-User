import React from 'react';
import styled from 'styled-components';

const SimpleLoader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div className="spinner-inner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;

  .spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .spinner-inner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    color: white;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default SimpleLoader;

