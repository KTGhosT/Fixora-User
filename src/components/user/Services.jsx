import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

// Services data with updated service names, icons, and navigation paths
const servicesData = [
  {
    title: 'Carpenter',
    icon: '🔨',
    description: 'Professional carpentry services for furniture assembly, installations, and custom woodwork projects.',
    features: ['Furniture Assembly', 'Custom Installations', 'Wood Repairs'],
    path: '/services/carpenter'
  },
  {
    title: 'Device Repair',
    icon: '🔧',
    description: 'Expert repair services for phones, laptops, tablets, and other electronic devices with quick turnaround.',
    features: ['Phone Repair', 'Laptop Service', 'Hardware Fixes'],
    path: '/services/devicerepair'
  },
  {
    title: 'Electrician',
    icon: '⚡',
    description: 'Licensed electrical services for wiring, installations, repairs, and electrical safety inspections.',
    features: ['Wiring Installation', 'Electrical Repairs', 'Safety Inspections'],
    path: '/services/electrician'
  },
  {
    title: 'Garden Cleaner',
    icon: '🌱',
    description: 'Complete lawn and garden maintenance services including landscaping, pruning, and seasonal cleanup.',
    features: ['Lawn Maintenance', 'Garden Pruning', 'Seasonal Cleanup'],
    path: '/services/gardencleaner'
  },
  {
    title: 'House Keeper',
    icon: '🏠',
    description: 'Professional house cleaning and organization services for residential and commercial properties.',
    features: ['Deep Cleaning', 'Regular Maintenance', 'Organization'],
    path: '/services/housecleaning'
  },
  {
    title: 'Plumber',
    icon: '🔧',
    description: 'Reliable plumbing services for pipe repairs, fixture installations, and emergency plumbing issues.',
    features: ['Pipe Repairs', 'Fixture Installation', 'Emergency Service'],
    path: '/services/plumber'
  },
];

// Reusable Service Card component
const ServiceCard = ({ title, icon, description, features, path }) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(path);
  };

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
        <button className="service-cta" onClick={handleLearnMore}>
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
              path={service.path}
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