import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '../../assets/user/bg.jpg';
import shinyBg from '../../assets/user/shiny-orange-light-abstract-background-600nw-2455043705.webp';

const HomeService = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'plumber',
      name: 'Plumber',
      icon: '🔧',
      description: 'Pipe fitting and water system expert'
    },
    {
      id: 'carpenter', 
      name: 'Carpenter',
      icon: '🪵',
      description: 'Woodworking & furniture expert'
    },
    {
      id: 'electrician',
      name: 'Electrician',
      icon: '⚡',
      description: 'Electrical systems & wiring expert'
    },
    {
      id: 'device-repair',
      name: 'Device Repair',
      icon: '📱',
      description: 'Electronics & gadget specialist'
    },
    {
      id: 'house-keeper',
      name: 'House Keeper',
      icon: '🏠',
      description: 'Home cleaning and maintenance pro'
    },
    {
      id: 'garden-cleaner',
      name: 'Garden Cleaner',
      icon: '🌿',
      description: 'Landscaping & garden care specialist'
    }
  ];

  useEffect(() => {
    // Floating elements
    const createFloatingElements = () => {
      const floatingContainer = document.getElementById('floatingElements');
      if (floatingContainer) {
        floatingContainer.innerHTML = '';
        for (let i = 0; i < 15; i++) {
          const element = document.createElement('div');
          element.style.position = 'absolute';
          element.style.background = 'rgba(255, 123, 0, 0.08)';
          element.style.borderRadius = '50%';
          element.style.animation = `float ${Math.random() * 20 + 10}s infinite linear`;
          element.style.bottom = '-100px';
          element.style.width = `${Math.random() * 60 + 20}px`;
          element.style.height = element.style.width;
          element.style.left = `${Math.random() * 100}%`;
          element.style.animationDelay = `${Math.random() * 5}s`;
          floatingContainer.appendChild(element);
        }
      }
    };

    createFloatingElements();
  }, []);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleNext = () => {
    if (selectedRole) {
      const container = document.querySelector('[data-container]');
      if (container) {
        container.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
          const selected = roles.find(role => role.id === selectedRole);
          alert(`You selected: ${selected.name}`);
          container.style.animation = 'fadeIn 1s ease-out';
        }, 500);
      }
    }
  };

  // Inline Styles
  const styles = {
    wrapper: {
      // Use the shiny orange abstract background image
      background: `url('${shinyBg}') center/cover no-repeat fixed`,
      backgroundBlendMode: 'overlay',
      backgroundColor: 'rgba(12, 12, 12, 0.7)',
      backdropFilter: 'blur(8px)',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', 'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    container: {
      width: '100%',
      maxWidth: '1100px',
      background: 'rgba(30, 30, 30, 0.85)',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 123, 0, 0.1)',
      padding: '50px 40px',
      position: 'relative',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 123, 0, 0.15)',
      animation: 'fadeInUp 1s ease-out'
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px'
    },
    title: {
      fontSize: '3rem',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #ff7b00, #ff5500, #ff3d00)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      fontWeight: '800',
      letterSpacing: '-0.5px',
      textShadow: '0 0 30px rgba(255, 123, 0, 0.3)',
      animation: 'titleGlow 3s ease-in-out infinite alternate'
    },
    subtitle: {
      color: '#ccc',
      fontSize: '1.2rem',
      maxWidth: '500px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontWeight: '400',
      opacity: '0.9'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: '25px',
      marginBottom: '50px'
    },
    card: {
      background: 'linear-gradient(145deg, rgba(50,50,50,0.8), rgba(35,35,35,0.9))',
      borderRadius: '20px',
      padding: '30px 25px',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      border: '2px solid transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      minHeight: '220px',
      position: 'relative',
      overflow: 'hidden'
    },
    cardHover: {
      transform: 'translateY(-10px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(255, 123, 0, 0.25), 0 0 0 1px rgba(255, 123, 0, 0.2)',
      borderColor: 'rgba(255, 123, 0, 0.3)'
    },
    cardSelected: {
      background: 'linear-gradient(145deg, rgba(255,123,0,0.15), rgba(255,85,0,0.1))',
      borderColor: '#ff7b00',
      boxShadow: '0 15px 35px rgba(255,123,0,0.4), 0 0 0 1px rgba(255,123,0,0.3)',
      transform: 'translateY(-6px)'
    },
    iconContainer: {
      position: 'relative',
      marginBottom: '20px'
    },
    iconBackground: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #ff7b00, #ff5500, #ff3d00)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.2rem',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      boxShadow: '0 8px 20px rgba(255,123,0,0.4), inset 0 2px 0 rgba(255,255,255,0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    iconHover: {
      transform: 'scale(1.1) rotate(5deg)',
      boxShadow: '0 12px 30px rgba(255,123,0,0.6), inset 0 2px 0 rgba(255,255,255,0.3)'
    },
    selectionIndicator: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: '#ff7b00',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'scale(0)',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      border: '2px solid #1a1a1a',
      boxShadow: '0 3px 10px rgba(255,123,0,0.5)'
    },
    selectionIndicatorVisible: {
      transform: 'scale(1)'
    },
    checkmark: {
      color: 'white',
      fontSize: '0.7rem',
      fontWeight: 'bold'
    },
    roleContent: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    roleName: {
      fontSize: '1.2rem',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#fff',
      letterSpacing: '-0.2px'
    },
    roleDesc: {
      fontSize: '0.85rem',
      color: '#bbb',
      lineHeight: '1.4',
      fontWeight: '400'
    },
    divider: {
      height: '2px',
      background: 'linear-gradient(90deg, transparent, rgba(255,123,0,0.3) 20%, #ff7b00 50%, rgba(255,123,0,0.3) 80%, transparent 100%)',
      margin: '40px 0',
      position: 'relative'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      width: '240px',
      margin: '0 auto',
      padding: '18px 32px',
      background: 'linear-gradient(135deg, #ff7b00, #ff5500, #ff3d00)',
      color: 'white',
      border: 'none',
      borderRadius: '60px',
      fontSize: '1.2rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(255,123,0,0.4), 0 0 0 1px rgba(255,123,0,0.2)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    },
    buttonHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 15px 35px rgba(255,123,0,0.6), 0 0 0 1px rgba(255,123,0,0.3)',
      background: 'linear-gradient(135deg, #ff8c1a, #ff6633, #ff4d00)'
    },
    buttonDisabled: {
      background: '#444',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      color: '#888'
    },
    btnText: {
      position: 'relative',
      zIndex: '2'
    },
    btnArrow: {
      position: 'relative',
      zIndex: '2',
      transition: 'transform 0.3s ease'
    },
    btnArrowHover: {
      transform: 'translateX(4px)'
    },
    floatingElements: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: '-1',
      pointerEvents: 'none'
    },
    dividerDot: {
      position: 'absolute',
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '8px',
      height: '8px',
      background: '#ff7b00',
      borderRadius: '50%',
      boxShadow: '0 0 15px #ff7b00',
      animation: 'pulseDot 2s infinite'
    },
    buttonShine: {
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.6s ease'
    },
    iconShine: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      transform: 'rotate(45deg)',
      transition: 'all 0.6s ease'
    },
    cardOverlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1), transparent)',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Back Button (top-left corner, slightly down) */}
      <button
        aria-label="Go back"
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed',
          left: '18px',
          top: '24px',
          zIndex: 9999,
          background: 'rgba(18,18,18,0.85)',
          color: '#fff',
          border: '1px solid rgba(255,123,0,0.12)',
          padding: '10px 14px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center',
          cursor: 'pointer',
          fontWeight: 700,
          boxShadow: '0 8px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,123,0,0.04)'
        }}
      >
        <span aria-hidden style={{ fontSize: '1.1rem' }}>←</span>
        <span style={{ fontSize: '0.95rem' }}>Back</span>
      </button>
      {/* Global Styles */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
          }
          
          @keyframes titleGlow {
            0% { text-shadow: 0 0 20px rgba(255, 123, 0, 0.4); }
            50% { text-shadow: 0 0 30px rgba(255, 123, 0, 0.7), 0 0 40px rgba(255, 123, 0, 0.4); }
            100% { text-shadow: 0 0 25px rgba(255, 123, 0, 0.5), 0 0 50px rgba(255, 123, 0, 0.3); }
          }
          
          @keyframes buttonPulse {
            0% { transform: scale(1); box-shadow: 0 8px 25px rgba(255, 123, 0, 0.4); }
            50% { transform: scale(1.03); box-shadow: 0 12px 35px rgba(255, 123, 0, 0.6); }
            100% { transform: scale(1); box-shadow: 0 8px 25px rgba(255, 123, 0, 0.4); }
          }
          
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-1200px) rotate(720deg); opacity: 0; }
          }
          
          @keyframes pulseDot {
            0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.7; transform: translateX(-50%) scale(1.2); }
          }

          @media (max-width: 1024px) {
            [data-grid] {
              grid-template-columns: repeat(2, 1fr) !important;
              grid-template-rows: repeat(3, 1fr) !important;
            }
          }

          @media (max-width: 768px) {
            [data-container] {
              padding: 30px 20px !important;
            }
            
            [data-title] {
              font-size: 2.2rem !important;
            }
            
            [data-grid] {
              grid-template-columns: 1fr !important;
              grid-template-rows: auto !important;
              gap: 15px !important;
            }
            
            [data-card] {
              padding: 25px 20px !important;
              min-height: 180px !important;
            }
            
            [data-icon] {
              width: 70px !important;
              height: 70px !important;
              font-size: 2rem !important;
            }
          }

          @media (max-width: 480px) {
            [data-title] {
              font-size: 1.8rem !important;
            }
            
            [data-button] {
              width: 200px !important;
              padding: 16px 28px !important;
            }
            
            [data-card] {
              padding: 20px 15px !important;
              min-height: 160px !important;
            }
          }
        `}
      </style>

      <div data-container style={styles.container}>
        <div style={styles.floatingElements} id="floatingElements"></div>
        
        <div style={styles.header}>
          <h1 data-title style={styles.title}>SELECT YOUR SERVICE</h1>
          <p style={styles.subtitle}>Choose the service that best matches your need to get started!</p>
        </div>
        
        <div data-grid style={styles.grid}>
          {roles.map((role) => (
            <div 
              key={role.id}
              data-card
              style={{
                ...styles.card,
                ...(selectedRole === role.id ? styles.cardSelected : {})
              }}
              onClick={() => handleRoleSelect(role.id)}
              onMouseEnter={(e) => {
                if (selectedRole !== role.id) {
                  Object.assign(e.currentTarget.style, styles.cardHover);
                  const icon = e.currentTarget.querySelector('[data-icon]');
                  if (icon) {
                    Object.assign(icon.style, styles.iconHover);
                  }
                  const overlay = e.currentTarget.querySelector('[data-overlay]');
                  if (overlay) {
                    overlay.style.opacity = '1';
                  }
                  const shine = e.currentTarget.querySelector('[data-shine]');
                  if (shine) {
                    shine.style.transform = 'rotate(45deg) translate(50%, 50%)';
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== role.id) {
                  Object.assign(e.currentTarget.style, styles.card);
                  const icon = e.currentTarget.querySelector('[data-icon]');
                  if (icon) {
                    Object.assign(icon.style, styles.iconBackground);
                  }
                  const overlay = e.currentTarget.querySelector('[data-overlay]');
                  if (overlay) {
                    overlay.style.opacity = '0';
                  }
                  const shine = e.currentTarget.querySelector('[data-shine]');
                  if (shine) {
                    shine.style.transform = 'rotate(45deg)';
                  }
                }
              }}
            >
              <div data-overlay style={styles.cardOverlay}></div>
              <div style={styles.iconContainer}>
                <div data-icon style={styles.iconBackground}>
                  <div data-shine style={styles.iconShine}></div>
                  <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))', position: 'relative', zIndex: 2 }}>
                    {role.icon}
                  </span>
                </div>
                <div 
                  style={{
                    ...styles.selectionIndicator,
                    ...(selectedRole === role.id ? styles.selectionIndicatorVisible : {})
                  }}
                >
                  <div style={styles.checkmark}>✓</div>
                </div>
              </div>
              <div style={styles.roleContent}>
                <div style={styles.roleName}>{role.name}</div>
                <div style={styles.roleDesc}>{role.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={styles.divider}>
          <div style={styles.dividerDot}></div>
        </div>
        
        <button 
          data-button
          style={{
            ...styles.button,
            ...(!selectedRole ? styles.buttonDisabled : {}),
            ...(selectedRole ? { animation: 'buttonPulse 2s infinite' } : {})
          }}
          onClick={handleNext}
          disabled={!selectedRole}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              Object.assign(e.currentTarget.style, styles.buttonHover);
              const arrow = e.currentTarget.querySelector('[data-arrow]');
              if (arrow) {
                arrow.style.transform = styles.btnArrowHover.transform;
              }
              const shine = e.currentTarget.querySelector('[data-button-shine]');
              if (shine) {
                shine.style.left = '100%';
              }
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              Object.assign(e.currentTarget.style, styles.button);
              const arrow = e.currentTarget.querySelector('[data-arrow]');
              if (arrow) {
                arrow.style.transform = 'none';
              }
              const shine = e.currentTarget.querySelector('[data-button-shine]');
              if (shine) {
                shine.style.left = '-100%';
              }
            }
          }}
        >
          <div data-button-shine style={styles.buttonShine}></div>
          <span style={styles.btnText}>Next</span>
          <span data-arrow style={styles.btnArrow}>→</span>
        </button>
      </div>
    </div>
  );
};

export default HomeService;