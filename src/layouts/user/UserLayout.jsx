import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarFallback from "../../components/AvatarFallback";
// Note: We are removing the import for styles.css

// Icons using Heroicons (must be installed: npm install @heroicons/react)
import {
  UserCircleIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const UserLayout = ({ children, activeTab, setActiveTab, user }) => {
  const navigate = useNavigate();

  // Define the menu items with Heroicons
  const menuItems = [
    { key: "profile", label: "Profile", icon: UserCircleIcon },
    { key: "bookings", label: "My Bookings", icon: CalendarDaysIcon },
    { key: "messages", label: "Messages", icon: ChatBubbleBottomCenterTextIcon },
    { key: "transactions", label: "Transactions", icon: CreditCardIcon },
    { key: "settings", label: "Settings", icon: Cog6ToothIcon },
  ];

  // Primary accent color (matching the orange from the header component)
  const accentColor = "orange-500"; 

  // --- JSX Rendering (Full Tailwind) ---

  return (
    // Main Container: Full viewport height, dark background, flex for layout
    <main className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row relative">
      
      {/* Back to Home Button (Fixed Position for Visibility) */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className={`
          absolute top-4 left-4 z-20 
          inline-flex items-center space-x-1
          text-sm font-semibold text-gray-400 
          hover:text-${accentColor} transition-colors 
          p-2 rounded-lg 
        `}
        aria-label="Back to Home"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* -------------------- Sidebar (Aside) -------------------- */}
      <aside 
        className={`
          w-full md:w-64 lg:w-72 flex-shrink-0 
          bg-gray-800 border-r border-gray-700 
          p-6 md:pt-20 pt-28 
          md:sticky md:top-0 md:h-screen
          shadow-xl
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Logo/Branding Container */}
          <div className="flex flex-col items-center justify-center mb-10">
            {/* Real User Profile Image with Local Fallback */}
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="User Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-600 shadow-lg object-cover mb-3"
                onError={(e) => {
                  // Hide the img and show fallback
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-24 h-24 rounded-full border-4 border-gray-600 shadow-lg mb-3 ${user?.profile_picture ? 'hidden' : 'flex'}`}
            >
              <AvatarFallback 
                name={user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.name || 'User'
                }
                size={96}
                className="w-full h-full"
              />
            </div>
            <h2 className="text-xl font-bold text-white">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.name || 'User Account'
              }
            </h2>
            <p className="text-sm text-gray-400 capitalize">
              {user?.role || 'User Account'}
            </p>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-grow">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = activeTab === item.key;
                const Icon = item.icon; // Component from Heroicons

                return (
                  <li key={item.key}>
                    <button
                      onClick={() => setActiveTab(item.key)}
                      className={`
                        w-full flex items-center space-x-3 p-3 rounded-xl 
                        font-medium transition-all duration-300 transform 
                        hover:scale-[1.02] 
                        ${
                          isActive
                            ? `bg-gray-700 text-${accentColor} shadow-lg ring-2 ring-${accentColor}/50`
                            : `text-gray-300 hover:bg-gray-700/50 hover:text-${accentColor}`
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <span className="text-lg">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer/Logout Placeholder */}
          <div className="mt-8 pt-4 border-t border-gray-700/50">
             <button
              onClick={() => { /* Implement Logout logic here */ }}
              className="w-full flex items-center justify-center space-x-2 p-3 text-lg font-medium text-red-400 hover:bg-gray-700/50 rounded-xl transition-colors"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span>Logout</span>
             </button>
          </div>
        </div>
      </aside>
      
      {/* -------------------- Content (Section) -------------------- */}
      <section className="flex-grow p-4 sm:p-8 lg:p-12 w-full">
        {/* Content Header (Dashboard Title) */}
        <header className="mb-8 md:mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
                {menuItems.find(item => item.key === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-gray-400 mt-1">Manage your home service experience efficiently.</p>
        </header>

        {/* Dynamic Children Content */}
        <div className="bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-700 shadow-2xl min-h-[70vh]">
          {children}
        </div>
      </section>
    </main>
  );
};

export default UserLayout;