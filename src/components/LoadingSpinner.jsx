import React from 'react';
import './LoadingSpinner.css';

const Loader = () => {
  return (
    // StyledWrapper replaced with a fixed Tailwind Glassmorphism overlay
    <div className="
      fixed top-0 left-0 w-screen h-screen 
      bg-black/50 backdrop-blur-md 
      flex justify-center items-center 
      z-[9999] transition-opacity duration-300
    ">
      {/* The main loader element, keeping the original class name for CSS targeting */}
      <div className="loader">
        {/* Repeating 'Fixora' text elements (essential for the clip-path animation) */}
        <div className="text"><span>Fixora</span></div>
        <div className="text"><span>Fixora</span></div>
        <div className="text"><span>Fixora</span></div>
        <div className="text"><span>Fixora</span></div>
        <div className="text"><span>Fixora</span></div>
        <div className="text"><span>Fixora</span></div>
        <div className="text"><span>Fixora</span></div>
        <div className="text"><span>Fixora</span></div>
        <div className="text"><span>Fixora</span></div>
        {/* The loading line */}
        <div className="line" />
      </div>
    </div>
  );
}

export default Loader;