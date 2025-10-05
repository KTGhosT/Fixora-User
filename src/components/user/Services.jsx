import React from 'react';
import './Services.css';

// Data structure for the services
const servicesData = [
  {
    title: 'Web Branding',
    icon: '🎨',
    description: 'Create memorable brand identities with custom logos, color schemes, and visual elements that represent your business perfectly.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity']
  },
  {
    title: 'Web Development',
    icon: '💻',
    description: 'Build responsive, fast, and scalable websites using modern technologies and best practices for optimal user experience.',
    features: ['Frontend Development', 'Backend Development', 'Responsive Design']
  },
  {
    title: 'Photography',
    icon: '📸',
    description: 'Professional photography services for products, portraits, and events with expert editing and creative composition.',
    features: ['Product Photography', 'Portrait Sessions', 'Event Coverage']
  },
  {
    title: 'User Experience',
    icon: '✨',
    description: 'Design intuitive and engaging user interfaces that prioritize usability and create seamless digital experiences.',
    features: ['UI/UX Design', 'User Research', 'Prototyping']
  },
  {
    title: 'Clean Code',
    icon: '⚡',
    description: 'Write maintainable, efficient, and well-documented code following industry standards and best practices.',
    features: ['Code Review', 'Optimization', 'Documentation']
  },
  {
    title: 'Fast Support',
    icon: '🚀',
    description: '24/7 technical support and maintenance services to keep your systems running smoothly and efficiently.',
    features: ['24/7 Support', 'Quick Response', 'Problem Solving']
  },
];

// Reusable Service Card component
const ServiceCard = ({ title, icon, description, features }) => {
  return (
    <div className="service-card">
      <div className="card-glow"></div>
      <div className="service-icon-container">
        <span className="service-icon">{icon}</span>
        <div className="icon-pulse"></div>
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{description}</p>
      
      <div className="service-features">
        {features.map((feature, index) => (
          <span key={index} className="feature-tag">{feature}</span>
        ))}
      </div>
      
      <div className="service-hover-content">
        <div className="hover-line"></div>
        <button className="service-cta">
          Learn More
          <span className="cta-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

// Main Services Section component
const ServicesSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h1>MY <span className="highlight">SERVICES</span></h1>
          <div className="header-underline"></div>
          <p className="services-subtitle">
            Professional solutions tailored to your needs with quality and creativity
          </p>
        </div>
        
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              icon={service.icon}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
        
        <div className="services-cta-section">
          <h2>Ready to Start Your Project?</h2>
          <p>Let's work together to bring your ideas to life</p>
          <button className="primary-cta">
            Get Started Today
            <span className="cta-sparkle">✨</span>
          </button>
        </div>
      </div>
      
      {/* Scroll Up Arrow */}
      <div className="scroll-up-arrow" onClick={scrollToTop}>
        <div className="arrow-pulse"></div>
        <i className="arrow-icon">↑</i>
      </div>
      
      {/* Floating Background Elements */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
    </section>
  );
};

export default ServicesSection;