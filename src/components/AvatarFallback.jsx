import React from 'react';

const AvatarFallback = ({ 
  name = 'U', 
  size = 150, 
  backgroundColor = '#6366f1', 
  textColor = '#ffffff',
  className = ''
}) => {
  // Extract initials from name
  const getInitials = (name) => {
    if (!name || name === 'U') return 'U';
    const words = name.toString().trim().split(' ');
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div 
      className={`flex items-center justify-center font-bold text-white ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: backgroundColor,
        color: textColor,
        borderRadius: '50%',
        fontSize: `${size * 0.4}px`,
        fontWeight: 'bold'
      }}
    >
      {initials}
    </div>
  );
};

export default AvatarFallback;
