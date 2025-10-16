import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// NOTE: Ensure your tailwind.config.js has the necessary keyframes/animations 
// ('scroll-down', 'orb-move-1', 'float-slow', etc.) as specified in the previous response.

const ModernHero = ({ user }) => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger the fade-in animation on mount
        setIsVisible(true);
    }, []);

    // Tailwind Class for staggered animation visibility
    const visibleClass = (delay) => 
        `transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${delay}`;

    // Determine which buttons to show based on user role
    const shouldShowButtons = () => {
        if (!user) {
            // Not logged in - show both buttons
            return { showBookService: true, showRegisterWorker: true };
        }
        
        const userRole = user.role?.toLowerCase();
        
        switch (userRole) {
            case 'customer':
            case 'user':
                // Customer/User - show both buttons
                return { showBookService: true, showRegisterWorker: true };
            case 'worker':
            case 'admin':
                // Worker/Admin - don't show any buttons
                return { showBookService: false, showRegisterWorker: false };
            default:
                // Default case - show both buttons
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
                {/* Ensure this path is correct for your project structure */}
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
                
                {/* Glow Orb 1 (Top Left) */}
                <div className="absolute top-[-10rem] left-[-10rem] w-80 h-80 bg-blue-500 rounded-full opacity-30 blur-[150px] animate-orb-move-1"></div>
                
                {/* Glow Orb 2 (Bottom Right - Accent Color) */}
                <div className="absolute bottom-[-10rem] right-[-10rem] w-96 h-96 bg-[#FF6B35] rounded-full opacity-30 blur-[180px] animate-orb-move-2"></div>
                
                {/* Floating Geometry 1 */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float-slow"></div>
                
                {/* Floating Geometry 2 */}
                <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-xl rotate-45 animate-float-fast"></div>
            </div>

            {/* -------------------- Main Content (Z-Index 4) -------------------- */}
            <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
                <div className="w-full text-center py-20 md:py-0">
                    
                    {/* Main Title (Resized to md/3xl/4xl) */}
                    <h1 
                        className={`text-white font-bold leading-tight text-3xl md:text-5xl lg:text-6xl mb-3 drop-shadow-lg ${visibleClass('delay-100')}`}
                    >
                        Your Trusted Partner for
                        <br />
                        <span className="text-[#FF6B35] relative">
                            All Home Services
                            {/* Animated underline */}
                            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-[#FF6B35] transform scale-x-0 transition-transform duration-1000 ease-out origin-left group-hover:scale-x-100"></span>
                        </span>
                    </h1>

                    {/* Subtitle (Resized to base/lg) */}
                    <p 
                        className={`text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-6 ${visibleClass('delay-300')}`}
                    >
                        Professional, reliable, and affordable services at your doorstep. We manage the workforce so you don't have to.
                    </p>

                    {/* Buttons (Text size adjusted to base) */}
                    {(showBookService || showRegisterWorker) && (
                        <div 
                            className={`flex justify-center space-x-3 md:space-x-4 ${visibleClass('delay-500')}`}
                        >
                            {/* Primary Button (Book) - Only show if user is not logged in or is a customer */}
                            {showBookService && (
                                <button 
                                    className="
                                        group inline-flex items-center space-x-2 px-6 py-3 text-lg font-bold 
                                        bg-[#FF6B35] text-white rounded-full shadow-xl shadow-[#FF6B35]/50 transition duration-500 
                                        transform hover:scale-105 hover:bg-[#e85a2b] relative overflow-hidden active:scale-95
                                    "
                                    onClick={() => navigate('/services')}
                                >
                                    Book a Service
                                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </button>
                            )}
                            
                            {/* Secondary Button (Register) - Only show if user is not logged in or is a customer */}
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
                        </div>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div 
                className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 z-40 ${visibleClass('delay-1000')}`}
            >
                <div className="w-0.5 h-8 bg-white/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-4 bg-white/90 animate-scroll-down"></div>
                </div>
                <p className="text-xs font-medium text-white/70 tracking-wider animate-pulse-slow">
                    Scroll to Explore
                </p>
            </div>
        </div>
    );
};

export default ModernHero;