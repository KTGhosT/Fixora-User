import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Services data (remains the same - ensure 'image' property is present)
const servicesData = [
    {
        title: 'Carpenter',
        image: 'src/assets/Home/ElectricianNew.jpg',
        description: 'Professional carpentry services for furniture assembly, installations, and custom woodwork projects.',
        features: ['Furniture Assembly', 'Custom Installations', 'Wood Repairs'],
        path: '/services/carpenter'
    },
    {
        title: 'Device Repair',
        image: 'src/assets/Home/ElectricianNew.jpg',
        description: 'Expert repair services for phones, laptops, tablets, and other electronic devices with quick turnaround.',
        features: ['Phone Repair', 'Laptop Service', 'Hardware Fixes'],
        path: '/services/devicerepair'
    },
    {
        title: 'Electrician',
        image: 'src/assets/Home/ElectricianNew.jpg',
        description: 'Licensed electrical services for wiring, installations, repairs, and electrical safety inspections.',
        features: ['Wiring Installation', 'Electrical Repairs', 'Safety Inspections'],
        path: '/services/electrician'
    },
    {
        title: 'Garden Cleaner',
        image: 'src/assets/Home/ElectricianNew.jpg',
        description: 'Complete lawn and garden maintenance services including landscaping, pruning, and seasonal cleanup.',
        features: ['Lawn Maintenance', 'Garden Pruning', 'Seasonal Cleanup'],
        path: '/services/gardencleaner'
    },
    {
        title: 'House Keeper',
        image: 'src/assets/Home/ElectricianNew.jpg',
        description: 'Professional house cleaning and organization services for residential and commercial properties.',
        features: ['Deep Cleaning', 'Regular Maintenance', 'Organization'],
        path: '/services/housecleaning'
    },
    {
        title: 'Plumber',
        image: 'src/assets/Home/ElectricianNew.jpg',
        description: 'Reliable plumbing services for pipe repairs, fixture installations, and emergency plumbing issues.',
        features: ['Pipe Repairs', 'Fixture Installation', 'Emergency Service'],
        path: '/services/plumber'
    },
];

// ----------------------------------------------------------------------
// Reusable Service Card component (Matching your sketch layout)
// ----------------------------------------------------------------------
const ServiceCard = ({ title, image, description, features, path, index }) => {
    const navigate = useNavigate();
    const cardRef = useRef(null);

    const handleLearnMore = (e) => {
        e.stopPropagation(); // Prevent card click from firing if button is clicked
        navigate(path);
    };

    // Scroll Reveal Effect (Kept for staggered animation)
    useEffect(() => {
        const currentRef = cardRef.current;
        if (!currentRef) return;

        currentRef.style.transitionDelay = `${index * 80}ms`; // Staggered delay
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the card is visible
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
            observer.disconnect();
        };
    }, [index]);


    return (
        // THE GLASS CARD: bg-white/10 + backdrop-blur + border-white/30
        <div 
            ref={cardRef} 
            className="
                bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl 
                border border-white/30 
                flex flex-col relative overflow-hidden transition-all duration-700 ease-out 
                opacity-0 translate-y-10 group
                hover:shadow-3xl hover:scale-[1.03] hover:border-white/80
                text-white // Default text color for the card
            "
            // Card is now clickable, navigate to details
            onClick={handleLearnMore}
        >
            {/* Background Light/Glow Effect on Hover */}
            <div className="
                absolute inset-0 -m-0.5 rounded-2xl 
                bg-white/10 opacity-0 transition-opacity duration-500 
                group-hover:opacity-10 pointer-events-none
            "></div>

            {/* --- Image Section (TOP PART) --- */}
            {image && (
                <div className="relative w-full h-48 overflow-hidden"> {/* Fixed height for image */}
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:brightness-110 transition duration-300 rounded-t-2xl" 
                    />
                    {/* Optional: Add a subtle overlay for text readability on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            )}

            {/* --- Content Section (MIDDLE & BOTTOM PART) --- */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-200 transition duration-300">
                    {title}
                </h3>

                {/* Description & Features (Hidden by default to match sketch simplicity) */}
                {/* You can uncomment and style these if you want them visible, maybe on hover */}
                {/* <p className="text-white/80 mb-4 text-sm hidden group-hover:block transition-all duration-300">
                    {description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4 hidden group-hover:flex transition-all duration-300">
                    {features.map((feature, idx) => (
                        <span 
                            key={idx} 
                            className="
                                text-xs font-medium text-white bg-white/20 
                                px-3 py-1 rounded-full backdrop-blur-sm
                            "
                        >
                            {feature}
                        </span>
                    ))}
                </div> */}

                {/* Learn More Button (BOTTOM PART) */}
                <div className="mt-auto pt-4 border-t border-white/30"> {/* mt-auto pushes button to bottom */}
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
        </div>
    );
};

// ----------------------------------------------------------------------
// Main Services Section component (No changes needed here for layout)
// ----------------------------------------------------------------------
const ServicesSection = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="relative py-16 md:py-24 bg-gray-900 overflow-hidden min-h-screen">
            
            {/* Floating Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-move-orb"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-move-orb-reverse"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-move-orb-fast"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Services Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3">
                        Our <span className="text-blue-400 relative">services
                            <span className="block absolute bottom-0 left-1/2 w-16 h-1 bg-blue-400 transform -translate-x-1/2 transition-all duration-500"></span>
                        </span>
                    </h1>
                    <p className="text-xl text-white/80 mt-5 max-w-2xl mx-auto">
                        Professional solutions tailored to your needs with **quality and creativity**
                    </p>
                </div>

                {/* Services Grid */}
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

                {/* Call to Action Section */}
                <div className="text-center mt-16 md:mt-24 p-10 
                    bg-white/10 rounded-2xl shadow-2xl border border-white/30
                    backdrop-blur-xl transform transition duration-500 hover:scale-[1.01]">
                    
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
                </div>
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