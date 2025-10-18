import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UniqueHeader = ({ user, setUser }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            // isScrolled is true after scrolling down 50px (increased threshold for larger header)
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLoginSignup = (e) => {
        e.preventDefault();
        navigate('/login');
        closeMobileMenu();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        navigate('/');
        closeMobileMenu();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleCallNow = () => {
        window.location.href = 'tel:+1234567890';
        closeMobileMenu();
    };

    // Function to get the correct dashboard route based on user role
    const getDashboardRoute = (userRole) => {
        switch (userRole) {
            case 'admin':
                return '/admin';
            case 'worker':
                return '/worker/dashboard';
            case 'user':
            default:
                return '/user/account';
        }
    };

    // Handle profile button click with role-based navigation
    const handleProfileClick = () => {
        const dashboardRoute = getDashboardRoute(user.role);
        navigate(dashboardRoute);
        closeMobileMenu();
    };

    // Tailwind classes for animations and state
    const headerClasses = `
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        shadow-lg 
        ${isScrolled ? 'bg-white/95 backdrop-blur-sm py-3' : 'bg-white py-5'}
    `;

    // Increased max-h on non-scrolled state
    const servicesSectionClasses = `
        overflow-hidden transition-all duration-500 ease-in-out
        ${isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-96 opacity-100 py-3'}
    `;

    // --- SVG Icons ---
    const PhoneIcon = (props) => (
        <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59344 1.99522 8.06477 2.16708 8.43820 2.48353C8.81162 2.79999 9.06322 3.23945 9.14999 3.72C9.31072 4.68007 9.58719 5.61273 9.96999 6.5C10.1056 6.88792 10.1329 7.30478 10.0494 7.70618C9.96588 8.10759 9.77404 8.47549 9.48999 8.76L8.12999 10.12C9.42741 12.6551 11.3449 14.5727 13.88 15.87L15.24 14.51C15.5245 14.226 15.8924 14.0341 16.2938 13.9506C16.6952 13.8671 17.1121 13.8944 17.5 14.03C18.3873 14.4128 19.3199 14.6893 20.28 14.85C20.7658 14.9368 21.2094 15.1934 21.5265 15.5737C21.8437 15.954 22.0122 16.4326 21.9999 16.92H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const ProfileIcon = (props) => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const LogoutIcon = (props) => (
        <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const HamburgerIcon = ({ active }) => (
        <div className="flex flex-col space-y-1.5 p-1">
            <div className={`h-1 w-7 bg-gray-800 transition-all duration-300 ${active ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`h-1 w-7 bg-gray-800 transition-opacity duration-300 ${active ? 'opacity-0' : 'opacity-100'}`}></div>
            <div className={`h-1 w-7 bg-gray-800 transition-all duration-300 ${active ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </div>
    );


    return (
        <>
            <header className={headerClasses}>
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    {/* Top Section */}
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Section */}
                        <div className="flex items-center cursor-pointer select-none" onClick={() => navigate('/')}>
                            <div className="flex flex-col leading-tight">
                                <div className="text-2xl font-extrabold text-blue-600 tracking-wider">FIXORA</div>
                                <div className="text-sm text-gray-600 font-medium tracking-widest">WorkForce Experts</div>
                            </div>
                        </div>

                        {/* Center Navigation - Hidden on Mobile */}
                        <nav className="hidden lg:flex space-x-10">
                            <a 
                                href="/about" 
                                className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 relative group no-underline"
                            >
                                About
                                {/* Hover Effect: Blue line under text */}
                                <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>
                            <a 
                                href="/feedback" 
                                className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-300 relative group no-underline"
                            >
                                Feedback Center
                                {/* Hover Effect: Blue line under text */}
                                <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            {/* Call Now Button - Visible on all screens */}
                            <button
                                className="hidden sm:inline-flex items-center space-x-2 px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                                onClick={handleCallNow}
                            >
                                <PhoneIcon className="text-white w-5 h-5" />
                                <span>Call Now</span>
                            </button>

                            {/* Auth Buttons or User Section - Hidden on Mobile */}
                            <div className="hidden lg:flex items-center space-x-3">
                                {user ? (
                                    <>
                                        <button
                                            className="flex items-center space-x-2 px-4 py-2.5 text-base font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-200 ease-in-out transform hover:scale-[1.02]"
                                            onClick={handleProfileClick}
                                            aria-label="Go to dashboard"
                                        >
                                            <ProfileIcon className="text-blue-600 w-6 h-6" />
                                            <span className="truncate max-w-[120px]">{user.name}</span>
                                        </button>
                                        <button
                                            className="flex items-center space-x-2 px-4 py-2.5 text-base font-semibold text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-[1.02]"
                                            onClick={logout}
                                        >
                                            <LogoutIcon className="text-white w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            className="px-5 py-2.5 text-base font-semibold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition duration-200 transform hover:scale-105" 
                                            onClick={handleLoginSignup}
                                        >
                                            Sign in
                                        </button>
                                        <button 
                                            className="px-5 py-2.5 text-base font-semibold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition duration-200 transform hover:scale-105" 
                                            onClick={handleLoginSignup}
                                        >
                                            Sign up
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Toggle - Visible on Mobile/Tablet */}
                            <button
                                className="p-2 lg:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={toggleMobileMenu}
                                aria-label="Toggle menu"
                            >
                                <HamburgerIcon active={isMobileMenuOpen} />
                            </button>
                        </div>
                    </div>

                    {/* Services Section - Hides on scroll, Hidden on large screens */}
                    <div className={`hidden md:block ${servicesSectionClasses}`}>
                        <div className="flex justify-center flex-wrap space-x-6 lg:space-x-10 pt-2 border-t border-gray-200">
                            {['Plumber', 'Carpenter', 'Electrician', 'Device Repair', 'House Keeper', 'Garden Cleaner'].map((service) => (
                                <a
                                    key={service}
                                    href={`/services/${service.toLowerCase().replace(/\s/g, '').replace('keeper', 'cleaning')}`}
                                    className="text-base font-medium text-gray-700 hover:text-blue-600 py-1 transition duration-150 whitespace-nowrap relative group no-underline"
                                >
                                    {service}
                                    {/* Hover Effect: Subtle bottom line on service links */}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </header>
            {/* Spacer height adjusted for larger header size */}
            <div className={`${isScrolled ? 'h-[80px]' : 'h-[140px]'} transition-all duration-300`}></div>


            {/* Mobile Menu Overlay (Size and Font updates) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={closeMobileMenu}>
                    <div
                        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out p-8 ${
                            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 p-2 text-gray-600 hover:text-gray-900"
                            onClick={closeMobileMenu}
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                        {/* Navigation Links */}
                        <div className="flex flex-col space-y-5 pt-16 border-b border-gray-200 pb-5">
                            <a href="/about" className="text-xl font-bold text-gray-700 hover:text-blue-600 no-underline" onClick={closeMobileMenu}>About</a>
                            <a href="/feedback" className="text-xl font-bold text-gray-700 hover:text-blue-600 no-underline" onClick={closeMobileMenu}>Feedback Center</a>
                        </div>

                        {/* Services */}
                        <div className="mt-8 border-b border-gray-200 pb-5">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Services</h3>
                            <div className="flex flex-col space-y-3">
                                {['Plumber', 'Carpenter', 'Electrician', 'Device Repair', 'House Keeper', 'Garden Cleaner'].map((service) => (
                                    <a
                                        key={`mobile-${service}`}
                                        href={`/services/${service.toLowerCase().replace(/\s/g, '').replace('keeper', 'cleaning')}`}
                                        className="text-base text-gray-600 hover:text-blue-600 transition duration-150 pl-3 no-underline"
                                        onClick={closeMobileMenu}
                                    >
                                        {service}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col space-y-4">
                            <button
                                className="flex justify-center items-center space-x-2 w-full px-4 py-3 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition duration-150 transform hover:scale-[1.02]"
                                onClick={handleCallNow}
                            >
                                <PhoneIcon className="w-6 h-6" />
                                <span>Call Now</span>
                            </button>

                            {user ? (
                                <>
                                    <button
                                        className="w-full px-4 py-3 text-lg font-bold text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition duration-150 transform hover:scale-[1.02]"
                                        onClick={handleProfileClick}
                                    >
                                        Profile ({user.name})
                                    </button>
                                    <button
                                        className="w-full px-4 py-3 text-lg font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition duration-150 transform hover:scale-[1.02]"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="w-full px-4 py-3 text-lg font-bold text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition duration-150 transform hover:scale-[1.02]"
                                        onClick={handleLoginSignup}
                                    >
                                        Sign in
                                    </button>
                                    <button
                                        className="w-full px-4 py-3 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-150 transform hover:scale-[1.02]"
                                        onClick={handleLoginSignup}
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UniqueHeader;