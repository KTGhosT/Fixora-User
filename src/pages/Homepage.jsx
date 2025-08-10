import React from 'react';
import Navbar from '../components/user/Header';
import Footer from '../components/user/Footer';
import Home from '../components/user/Home';
import Services from '../components/user/Services';
import About from '../components/user/About';
import Slider from '../components/user/Slider';
import Contact from '../components/user/Contact';



const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '56px', minHeight: 'calc(5vh - 5px)' }}>{children}</main>
        <Home />
        <Services />
        <About />
        <Slider />
        <Contact />
      <Footer />
    </>
  );
};

export default UserLayout;