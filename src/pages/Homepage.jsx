import React from 'react';
import Navbar from '../components/user/Header';
import Footer from '../components/user/Footer';
import Home from '../components/user/Home';
import Services from '../components/user/Services';
import About from '../components/user/About';
import Happyclients from '../components/user/Happyclients';
import Banner from '../components/user/Banner';




const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 0, minHeight: 'calc(0vh - 0px)' }}>{children}</main>
        <Home />
        <Services />
        <Banner />
        <Happyclients />
        <About />
      <Footer />
    </>
  );
};

export default UserLayout;