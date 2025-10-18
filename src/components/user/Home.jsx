import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // 👈 Import Framer Motion

// NOTE: The custom Tailwind animations (animate-orb-move-1, animate-float-slow, etc.) 
// will still rely on your tailwind.config.js setup and remain in the background elements.

const ModernHero = ({ user }) => {
    const navigate = useNavigate();

    // Framer Motion Variants for Staggered Entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Stagger the children's animation by 0.2 seconds
                delayChildren: 0.1, // Delay the start of children animations
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
            },
        },
    };

    // Determine which buttons to show based on user role
    const shouldShowButtons = () => {
        if (!user) {
            return { showBookService: true, showRegisterWorker: true };
        }
        
        const userRole = user.role?.toLowerCase();
        
        switch (userRole) {
            case 'customer':
            case 'user':
                return { showBookService: true, showRegisterWorker: true };
            case 'worker':
            case 'admin':
                // Worker/Admin - show neither button
                return { showBookService: false, showRegisterWorker: false };
            default:
                return { showBookService: true, showRegisterWorker: true };
        }
    };

    const { showBookService, showRegisterWorker } = shouldShowButtons();

    return (
        // Hero Container: Relative positioning for absolute children
        <div className="relative w-full min-h-screen overflow-hidden bg-gray-900">
            
            {/* -------------------- Background Layers (Z-Index 1-3) -------------------- */}

            {/* Video Background (Z-Index 1) */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-10"
            >
                <source src="/src/assets/Home/1760368103380.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* Video Overlay for better text readability (Z-Index 2) */}
            <div 
                className="absolute inset-0 z-20"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)',
                }}
            />
            
            {/* Background Glow/Orb Effect (Z-Index 3) */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10rem] left-[-10rem] w-80 h-80 bg-blue-500 rounded-full opacity-30 blur-[150px] animate-orb-move-1"></div>
                <div className="absolute bottom-[-10rem] right-[-10rem] w-96 h-96 bg-[#FF6B35] rounded-full opacity-30 blur-[180px] animate-orb-move-2"></div>
                <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float-slow"></div>
                <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-xl rotate-45 animate-float-fast"></div>
            </div>

            {/* -------------------- Main Content (Z-Index 4) -------------------- */}
            <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
                {/* Use motion.div as the container for the staggered animation */}
                <motion.div 
                    className="w-full text-center py-20 md:py-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    
                    {/* Main Title - Use motion.h1 and apply itemVariants */}
                    <motion.h1 
                        className="text-white font-bold leading-tight text-3xl md:text-5xl lg:text-6xl mb-3 drop-shadow-lg"
                        variants={itemVariants}
                    >
                        Your Trusted Partner for
                        <br />
                        <span className="text-[#FF6B35] relative">
                            All Home Services
                            {/* Animated underline (using Tailwind/CSS for the continuous hover effect) */}
                            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-[#FF6B35] transform scale-x-0 transition-transform duration-1000 ease-out origin-left group-hover:scale-x-100"></span>
                        </span>
                    </motion.h1>

                    {/* Subtitle - Use motion.p and apply itemVariants */}
                    <motion.p 
                        className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-6"
                        variants={itemVariants}
                    >
                        Professional, reliable, and affordable services at your doorstep. We manage the workforce so you don't have to.
                    </motion.p>

                    {/* Buttons Container - Use motion.div and apply itemVariants */}
                    {(showBookService || showRegisterWorker) && (
                        <motion.div 
                            className="flex justify-center space-x-3 md:space-x-4"
                            variants={itemVariants}
                        >
                            {/* Primary Button (Book) */}
                            {showBookService && (
                                <button 
                                    className="
                                        group inline-flex items-center space-x-2 px-6 py-3 text-lg font-bold 
                                        bg-[#FF6B35] text-white rounded-full shadow-xl shadow-[#FF6B35]/50 transition duration-500 
                                        transform hover:scale-105 hover:bg-[#e85a2b] relative overflow-hidden active:scale-95
                                    "
                                    onClick={() => navigate('/Booking')}
                                >
                                    Book a Service
                                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </button>
                            )}
                            
                            {/* Secondary Button (Register) */}
                            {showRegisterWorker && (
                                <button 
                                    className="
                                        px-6 py-3 text-lg font-bold 
                                        bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-sm 
                                        transition duration-500 transform hover:scale-105 hover:bg-white/30 hover:border-white active:scale-95
                                    "
                                    onClick={() => navigate('/worker/register')}
                                >
                                    Register as a Worker
                                </button>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Scroll Indicator - Use motion.div for animation */}
            <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 z-40"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }} // Delays after the main content is visible
            >
                <div className="w-0.5 h-8 bg-white/50 relative overflow-hidden">
                    {/* The internal scroll animation is kept as a Tailwind animation */}
                    <div className="absolute top-0 left-0 w-full h-4 bg-white/90 animate-scroll-down"></div>
                </div>
                <p className="text-xs font-medium text-white/70 tracking-wider animate-pulse-slow">
                    Scroll to Explore
                </p>
            </motion.div>
        </div>
    );
};

export default ModernHero;