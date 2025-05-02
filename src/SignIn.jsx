import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic client-side validation for email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      if (loginType === 'admin') {
        // Admin login logic (unchanged)
        if (email === "admin@gmail.com" && password === "admin") {
          localStorage.setItem('userInfo', JSON.stringify({
            isAdmin: true,
            username: 'Admin',
            email: email
          }));
          navigate("/dashboard");
        } else {
          setError("Invalid admin credentials! Please try again.");
        }
      } else {
        // User login logic - use the new /login endpoint
        const response = await axios.post('https://vercel-backend1-eight.vercel.app/api/login', {
          email,
          password,
        });

        const { user } = response.data;
        // Store the full user object, including deviceId, in localStorage
        localStorage.setItem('userInfo', JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error connecting to server. Please try again later.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-[Poppins-SemiBold]">
    {/* Navbar */}
    <Navbar />

    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 font-[Poppins-SemiBold] relative">
      {/* Background Overlay (Optional) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
        style={{ backgroundImage: "url('/images/air-quality-bg.jpg')" }}
      ></div>

      {/* Main Content: Takes up remaining space */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
          {/* Left Side: Additional Content */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Illustration */}
            <div className="mb-8 animate-fade-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-64 w-64 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>

            {/* Tagline */}
            <h3 className="text-3xl font-semibold text-white mb-4">Awareness Ignites Change!</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Sign in to monitor indoor air quality in real-time, get advanced analytics, and receive instant alerts for a healthier environment.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center justify-center text-gray-400">
                <svg className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Real-Time Monitoring
              </div>
              <div className="flex items-center justify-center text-gray-400">
                <svg className="h-5 w-5 mr-2 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Advanced Analytics
              </div>
              <div className="flex items-center justify-center text-gray-400">
                <svg className="h-5 w-5 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Instant Alerts
              </div>
            </div>
          </div>

          {/* Right Side: SignIn Form */}
          <div className="relative w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 transition-all duration-300 hover:shadow-2xl">
            {/* Geometric Shapes */}
            <div className="absolute top-0 left-0 w-12 h-12 bg-blue-500 opacity-20 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500 opacity-20 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-500 opacity-20 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-500 opacity-20 rounded-br-2xl"></div>
            <div className="absolute top-0 left-0 w-16 h-1 bg-blue-400 opacity-30 rotate-45 origin-top-left"></div>
            <div className="absolute top-0 right-0 w-16 h-1 bg-purple-400 opacity-30 -rotate-45 origin-top-right"></div>
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-green-400 opacity-30 -rotate-45 origin-bottom-left"></div>
            <div className="absolute bottom-0 right-0 w-16 h-1 bg-yellow-400 opacity-30 rotate-45 origin-bottom-right"></div>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
            </div>

            {/* Form Heading */}
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-100">Sign In to Account</h2>

            {/* Login Type Selection */}
            <div className="mb-6">
              <div className="flex bg-gray-700 p-1 rounded-lg mb-4">
                <button
                  className={`flex-1 py-2 rounded-md transition-colors duration-200 ${loginType === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
                    : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setLoginType('user')}
                >
                  User Login
                </button>
                <button
                  className={`flex-1 py-2 rounded-md transition-colors duration-200 ${loginType === 'admin' 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
                    : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setLoginType('admin')}
                >
                  Admin Login
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-400 text-sm mb-2" htmlFor="password">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c-4.478 0-8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  `Sign In as ${loginType === 'admin' ? 'Admin' : 'User'}`
                )}
              </button>
            </form>
            <p className="text-gray-400 text-sm text-center mt-4">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Positioned at the bottom */}
      <footer className="bg-gray-800 border-t border-gray-700 px-4 py-4 w-full">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-md flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M3.055 13H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h1.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">AirQuality</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-gray-400 text-sm">
              <a href="#" className="hover:text-gray-100">Privacy Policy</a>
              <a href="#" className="hover:text-gray-100">Terms of Service</a>
              <a href="#" className="hover:text-gray-100">Contact Us</a>
              <p>© 2025 Indoor Air Quality Monitoring System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Inline Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-in-out;
        }
      `}</style>
    </div>
    </div>
  );
}

export default SignIn;