import React from 'react';
import Navbar from '../components/user/Header';
import Footer from '../components/user/Footer';
import Home from '../components/user/Home';
import Services from '../components/user/Services';
import About from '../components/user/About';
import Happyclients from '../components/user/Happyclients';
import Banner from '../components/user/Banner';
import Chatbot from '../pages/Chatbot';

// Dark Separator Component
const DarkSeparator = () => (
  <div style={{
    width: '100%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #2a2a2a 20%, #1a1a1a 50%, #2a2a2a 80%, transparent 100%)',
    margin: '0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 -1px 3px rgba(0, 0, 0, 0.3)',
    border: '1px solid #0a0a0a',
    borderRadius: '1px'
  }} />
);

// White Separator Component
const WhiteSeparator = () => (
  <div style={{
    width: '100%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #f0f0f0 20%, #ffffff 50%, #f0f0f0 80%, transparent 100%)',
    margin: '0',
    boxShadow: '0 1px 2px rgba(255, 255, 255, 0.8), 0 -1px 2px rgba(255, 255, 255, 0.6)',
    border: '1px solid #ffffff',
    borderRadius: '1px'
  }} />
);

const UserLayout = ({ children, user }) => {
  return (
    <>
      {/* <Navbar /> */}
      <main style={{ paddingTop: 0, minHeight: 'calc(0vh - 0px)' }}>
        <Home user={user} />
        <DarkSeparator />
        <Services />
        <WhiteSeparator />
        <Banner />
        <DarkSeparator />
        <Happyclients />
        <WhiteSeparator />
        <About />
        <Chatbot />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
