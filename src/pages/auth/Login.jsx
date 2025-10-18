import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
// Removed: import styles from "./Login.module.css"; // Using Tailwind now
import ForgotPassword from "./New ForgotPassword"; // Assuming this component exists

// --- SVG Icons for form and buttons ---

// Arrow icon for back button
const ArrowLeftIcon = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Eye icon for password toggle
const EyeIcon = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.0298 12.0001C3.8298 8.0001 7.9298 5.0001 12.0098 5.0001C16.0898 5.0001 20.1798 8.0001 21.9798 12.0001C20.1798 16.0001 16.0898 19.0001 12.0098 19.0001C7.9298 19.0001 3.8298 16.0001 2.0298 12.0001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Eye-slash icon for password toggle
const EyeOffIcon = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.94 17.94C16.2736 18.7816 14.1788 19.0048 12.0098 19.0001C7.9298 19.0001 3.8298 16.0001 2.0298 12.0001C3.21805 9.42784 4.88126 7.28311 6.84 5.76M9.16 4.60001C10.0384 4.19524 10.9922 3.99965 12.0098 4.00008C16.0898 4.00008 20.1798 7.00008 21.9798 11.0001C21.4116 12.2464 20.675 13.3853 19.82 14.37M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.21997 4.22001L19.78 19.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


function Login({ setUser }) {
    const navigate = useNavigate();
    const emailRef = useRef(null);
    const phoneRef = useRef(null);

    const [formData, setFormData] = useState({ 
        email: "", 
        phone: "", 
        password: "" 
    });
    const [useEmail, setUseEmail] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    useEffect(() => {
        const savedCredential = localStorage.getItem(useEmail ? "email" : "phone");
        if (savedCredential) {
            setFormData(prev => ({
                ...prev,
                [useEmail ? "email" : "phone"]: savedCredential
            }));
            setRememberMe(true);
        }

        const currentRef = useEmail ? emailRef : phoneRef;
        currentRef.current?.focus();
    }, [useEmail]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (error) setError(null);
    };

    const handleToggle = (useEmailOption) => {
        setUseEmail(useEmailOption);
        setError(null);
        // Clear the *other* field when toggling to prevent submitting stale data
        setFormData(prev => ({ 
            ...prev, 
            email: useEmailOption ? prev.email : "",
            phone: useEmailOption ? "" : prev.phone,
            password: "" // Clear password on toggle for security/clarity
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Validation (simplified for example)
        if ((useEmail && !formData.email) || (!useEmail && !formData.phone)) {
            setError(`Please enter your ${useEmail ? "email address" : "phone number"}`);
            setIsSubmitting(false);
            return;
        }

        if (!formData.password) {
            setError("Please enter your password");
            setIsSubmitting(false);
            return;
        }

        try {
            // CSRF Cookie setup (Laravel Sanctum requirement)
            await axios.get("/sanctum/csrf-cookie");

            const payload = {
                password: formData.password,
                ...(useEmail 
                    ? { email: formData.email.trim().toLowerCase() } 
                    : { phone: formData.phone.trim() }
                ),
            };

            const loginResponse = await axios.post("/api/login", payload);
            const { user, token } = loginResponse.data;

            // Persistence and State Update
            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify({ role: user.role?.toLowerCase() || "user", ...user }));

            if (rememberMe) {
                localStorage.setItem(useEmail ? "email" : "phone", formData[useEmail ? "email" : "phone"]);
            } else {
                localStorage.removeItem("email");
                localStorage.removeItem("phone");
            }

            setShowSuccess(true);
            
            setTimeout(() => {
                const role = user.role?.toLowerCase() || "user";
                setUser({ role, ...user });
                
                switch (role) {
                    case "admin":
                        navigate("/admin");
                        break;
                    case "worker":
                        navigate("/worker/dashboard");
                        break;
                    default:
                        navigate("/");
                }
            }, 1500);

        } catch (err) {
            console.error("Login error:", err);
            
            if (err.response?.status === 419) {
                setError("Session expired. Please refresh the page and try again.");
            } else if (err.response?.status === 401) {
                setError("Invalid credentials. Please check your login details.");
            } else if (err.response?.status === 422) {
                setError("Please check your input fields and try again.");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Unable to connect to server. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Tailwind Class Definitions for Clarity ---

    const inputGroupClasses = "relative z-0 w-full mb-6 group";
    const inputFieldClasses = `
        block py-3 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 
        border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 
        peer transition duration-200 pl-10
    `;
    const inputLabelClasses = `
        absolute text-base text-gray-500 duration-300 transform -translate-y-6 scale-75 
        top-3 left-10 origin-[0] peer-focus:left-10 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
        peer-focus:-translate-y-6
    `;
    const inputIconClasses = "absolute top-3 left-0 text-xl text-gray-500 peer-focus:text-blue-600 transition-colors duration-200";

    const submitBtnClasses = `
        w-full py-3.5 text-lg font-bold text-white bg-blue-600 rounded-lg 
        hover:bg-blue-700 transition duration-300 shadow-md 
        flex items-center justify-center space-x-2 disabled:bg-blue-400 disabled:cursor-not-allowed
    `;
    
    // Custom Spinner CSS (can't be done purely in Tailwind, need inline or global CSS)
    const spinnerStyle = {
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid #fff',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        animation: 'spin 1s linear infinite',
    };
    // Note: You would need to define the `@keyframes spin` in a global CSS file.

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
            {/* Forgot Password Popup */}
            {showForgotPassword && (
                <ForgotPassword onClose={() => setShowForgotPassword(false)} />
            )}

            {/* Back to Home Button (Fixed position) */}
            <div className="absolute top-4 left-4 z-10">
                <button 
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                    onClick={() => navigate("/")}
                    type="button"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to Home</span>
                </button>
            </div>

            <div className="
                flex w-full max-w-6xl h-auto 
                bg-white shadow-2xl rounded-xl overflow-hidden
            ">
                {/* Left Side - Image Section (Hidden on small screens) */}
                <div className="
                    hidden lg:block lg:w-1/2 
                    bg-cover bg-center relative 
                    p-12
                " 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517409419842-83b544464c20?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-blue-900/80"></div>
                    
                    {/* Image Content */}
                    <div className="relative z-10 text-white flex flex-col justify-center h-full space-y-6">
                        <div className="text-3xl font-extrabold tracking-wider">✦ FIXORA</div>
                        <h1 className="text-4xl font-bold leading-tight">Welcome Back!</h1>
                        <p className="text-lg opacity-90">
                            Join thousands of users who trust Fixora for their service needs. Your journey to seamless home services starts here.
                        </p>
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center space-x-3 text-lg">
                                <span className="text-2xl">🔧</span>
                                <span className="font-semibold">Skilled Professionals</span>
                            </div>
                            <div className="flex items-center space-x-3 text-lg">
                                <span className="text-2xl">⚡</span>
                                <span className="font-semibold">Quick Response</span>
                            </div>
                            <div className="flex items-center space-x-3 text-lg">
                                <span className="text-2xl">🛡️</span>
                                <span className="font-semibold">Verified Workers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-gray-900">Sign In to Fixora</h2>
                            <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
                        </div>

                        {error && (
                            <div className="p-3 mb-4 text-sm font-medium text-red-800 bg-red-100 rounded-lg" role="alert">
                                {error}
                            </div>
                        )}

                        {showSuccess && (
                            <div className="p-3 mb-4 text-sm font-medium text-green-800 bg-green-100 rounded-lg" role="alert">
                                ✅ Login successful! Redirecting...
                            </div>
                        )}

                        {/* Auth Type Toggle */}
                        <div className="flex bg-gray-200 rounded-full p-1 mb-8">
                            <button
                                type="button"
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 text-base font-semibold rounded-full transition duration-300 ${useEmail ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-600'}`}
                                onClick={() => handleToggle(true)}
                            >
                                <span className="text-xl">📧</span>
                                <span>Email</span>
                            </button>
                            <button
                                type="button"
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 text-base font-semibold rounded-full transition duration-300 ${!useEmail ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-600'}`}
                                onClick={() => handleToggle(false)}
                            >
                                <span className="text-xl">📱</span>
                                <span>Phone</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email/Phone Input */}
                            <div className={inputGroupClasses}>
                                <input
                                    ref={useEmail ? emailRef : phoneRef}
                                    type={useEmail ? "email" : "tel"}
                                    id={useEmail ? "email" : "phone"}
                                    value={useEmail ? formData.email : formData.phone}
                                    onChange={handleChange}
                                    className={inputFieldClasses}
                                    placeholder=" "
                                    autoComplete={useEmail ? "email" : "tel"}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor={useEmail ? "email" : "phone"} className={inputLabelClasses}>
                                    {useEmail ? "Email Address" : "Phone Number"}
                                </label>
                                <span className={inputIconClasses}>
                                    {useEmail ? "📧" : "📱"}
                                </span>
                            </div>

                            {/* Password Input */}
                            <div className={inputGroupClasses}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputFieldClasses}
                                    placeholder=" "
                                    autoComplete="current-password"
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="password" className={inputLabelClasses}>
                                    Password
                                </label>
                                <span className={inputIconClasses}>🔒</span>
                                <button
                                    type="button"
                                    className="absolute right-0 top-1.5 p-2 text-gray-500 hover:text-gray-700 transition duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer text-gray-600" onClick={() => setRememberMe(!rememberMe)}>
                                    <div className={`w-4 h-4 rounded border-2 transition duration-200 ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`}>
                                        {rememberMe && <span className="text-white text-xs font-bold flex items-center justify-center">✓</span>}
                                    </div>
                                    <span>Remember me</span>
                                </label>
                                <button 
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800 hover:underline transition duration-200 font-medium"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={submitBtnClasses}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        {/* CSS Spinner Placeholder */}
                                        <div style={spinnerStyle} />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-500 font-medium">or continue with</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-3">
                            <button type="button" className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200">
                                <span className="text-xl">🔵</span>
                                <span>Continue with Facebook</span>
                            </button>
                            <button type="button" className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200">
                                <span className="text-xl">🔴</span>
                                <span>Continue with Google</span>
                            </button>
                        </div>

                        <div className="mt-8 text-center text-gray-600">
                            Don't have an account? 
                            <button 
                                className="ml-1 text-blue-600 hover:text-blue-800 hover:underline font-semibold transition duration-200"
                                onClick={() => navigate("/signup")}
                            >
                                Sign up now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;