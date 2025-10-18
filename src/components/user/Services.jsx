import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // 👈 Import Framer Motion

// Import available service images
import CarpenterImage from '../../assets/Home/CarpenterNew.jpg';
import ElectricianImage from '../../assets/Home/ElectricianNew.jpg';
import PlumberImage from '../../assets/Home/Plumber.png';
import HouseKeeperImage from '../../assets/Home/HouseKeeping.png';

// Services data with proper image imports
const servicesData = [
    {
        title: 'Carpenter',
        image: CarpenterImage,
        description: 'Professional carpentry services for furniture assembly, installations, and custom woodwork projects.',
        features: ['Furniture Assembly', 'Custom Installations', 'Wood Repairs'],
        path: '/services/carpenter'
    },
    {
        title: 'Device Repair',
        image: ElectricianImage, // Using Electrician image as fallback
        description: 'Expert repair services for phones, laptops, tablets, and other electronic devices with quick turnaround.',
        features: ['Phone Repair', 'Laptop Service', 'Hardware Fixes'],
        path: '/services/devicerepair'
    },
    {
        title: 'Electrician',
        image: ElectricianImage,
        description: 'Licensed electrical services for wiring, installations, repairs, and electrical safety inspections.',
        features: ['Wiring Installation', 'Electrical Repairs', 'Safety Inspections'],
        path: '/services/electrician'
    },
    {
        title: 'Garden Cleaner',
        image: HouseKeeperImage, // Using HouseKeeper image as fallback
        description: 'Complete lawn and garden maintenance services including landscaping, pruning, and seasonal cleanup.',
        features: ['Lawn Maintenance', 'Garden Pruning', 'Seasonal Cleanup'],
        path: '/services/gardencleaner'
    },
    {
        title: 'House Keeper',
        image: HouseKeeperImage,
        description: 'Professional house cleaning and organization services for residential and commercial properties.',
        features: ['Deep Cleaning', 'Regular Maintenance', 'Organization'],
        path: '/services/housecleaning'
    },
    {
        title: 'Plumber',
        image: PlumberImage,
        description: 'Reliable plumbing services for pipe repairs, fixture installations, and emergency plumbing issues.',
        features: ['Pipe Repairs', 'Fixture Installation', 'Emergency Service'],
        path: '/services/plumber'
    },
];

// Framer Motion Variants for Card entrance animation
const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.1, // Staggered delay based on index
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

// ----------------------------------------------------------------------
// Reusable Service Card component
// ----------------------------------------------------------------------
const ServiceCard = ({ title, image, description, features, path, index }) => {
    const navigate = useNavigate();

    const handleLearnMore = (e) => {
        // Stop propagation if the button is clicked directly
        e.stopPropagation(); 
        navigate(path);
    };

    return (
        // Replaced div with motion.div and used Framer Motion props
        <motion.div 
            className="
                bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl 
                border border-white/30 
                flex flex-col relative overflow-hidden transition-all duration-700 ease-out 
                group
                hover:shadow-3xl hover:scale-[1.03] hover:border-white/80
                text-white cursor-pointer
            "
            // Framer Motion Scroll Reveal setup
            variants={cardVariants}
            initial="hidden"
            whileInView="visible" // Animate when the element is in view
            viewport={{ once: true, amount: 0.3 }} // Only animate once, when 30% of it is visible
            custom={index} // Pass the index to variants for staggered delay
            
            onClick={() => navigate(path)}
        >
            {/* Background Light/Glow Effect on Hover */}
            <div className="
                absolute inset-0 -m-0.5 rounded-2xl 
                bg-white/10 opacity-0 transition-opacity duration-500 
                group-hover:opacity-10 pointer-events-none
            "></div>

            {/* --- Image Section (TOP PART) --- */}
            {image && (
                <div className="relative w-full h-48 overflow-hidden">
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:brightness-110 transition duration-300 rounded-t-2xl" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            )}

            {/* --- Content Section (MIDDLE & BOTTOM PART) --- */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-200 transition duration-300">
                    {title}
                </h3>

                {/* Learn More Button (BOTTOM PART) */}
                <div className="mt-auto pt-4 border-t border-white/30">
                    <button 
                        className="
                            flex items-center text-blue-300 font-bold text-lg transition-all duration-300
                            group-hover:text-white group-hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-300
                        " 
                        onClick={handleLearnMore}
                    >
                        Learn More
                        {/* CTA Arrow */}
                        <span className="ml-2 text-2xl transition-transform duration-300 transform group-hover:rotate-45">
                            →
                        </span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ----------------------------------------------------------------------
// Main Services Section component
// ----------------------------------------------------------------------
const ServicesSection = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="relative py-16 md:py-24 bg-gray-900 overflow-hidden min-h-screen">
            
            {/* Floating Background Orbs (Uses existing Tailwind animations) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-move-orb"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-move-orb-reverse"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-move-orb-fast"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Services Header - Added Framer Motion fade-in and slide-up */}
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3">
                        Our <span className="text-blue-400 relative">services
                            <span className="block absolute bottom-0 left-1/2 w-16 h-1 bg-blue-400 transform -translate-x-1/2 transition-all duration-500"></span>
                        </span>
                    </h1>
                    <p className="text-xl text-white/80 mt-5 max-w-2xl mx-auto">
                        Professional solutions tailored to your needs with **quality and creativity**
                    </p>
                </motion.div>

                {/* Services Grid - Container for the staggered cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {servicesData.map((service, index) => (
                        <ServiceCard
                            key={index}
                            index={index}
                            title={service.title}
                            image={service.image}
                            description={service.description}
                            features={service.features}
                            path={service.path}
                        />
                    ))}
                </div>

                {/* Call to Action Section - Added Framer Motion scroll-in effect */}
                <motion.div 
                    className="text-center mt-16 md:mt-24 p-10 
                        bg-white/10 rounded-2xl shadow-2xl border border-white/30
                        backdrop-blur-xl transform transition duration-500 hover:scale-[1.01]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                >
                    
                    <h2 className="text-3xl font-bold text-white mb-2">Ready to Start Your Project?</h2>
                    <p className="text-blue-100 text-lg mb-6">
                        Let's work together to bring your ideas to life.
                    </p>
                    <button className="
                        inline-flex items-center space-x-3 px-8 py-4 text-xl font-bold 
                        bg-white text-blue-600 rounded-full shadow-lg transition duration-300 
                        transform hover:bg-gray-100 hover:scale-105
                        relative overflow-hidden
                    ">
                        Get Started Today
                        <span className="ml-2 text-2xl animate-spin-slow">✨</span>
                    </button>
                </motion.div>
            </div>
            
            {/* Scroll Up Arrow */}
            <button
                className="fixed bottom-6 right-6 z-40 p-4 bg-white/20 backdrop-blur-lg text-white rounded-full shadow-2xl transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50 border border-white/50"
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <i className="text-xl font-bold">↑</i>
            </button>
        </section>
    );
};

export default ServicesSection;