import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users', formData);
      navigate('/sign-in');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 font-[Poppins-SemiBold] relative">
      {/* Background Overlay (Optional) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
        style={{ backgroundImage: "url('/images/air-quality-bg.jpg')" }}
      ></div>

      {/* Main Content: Takes up remaining space */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
          {/* Left Side: Additional Content (Moved to Left) */}
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
            <h3 className="text-3xl font-semibold text-white mb-4">Breathe Easy with AirQuality</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Sign up to monitor indoor air quality in real-time, get advanced analytics, and receive instant alerts for a healthier environment.
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

          {/* Right Side: Signup Form (Moved to Right) */}
          <div className="w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 transition-all duration-300 hover:shadow-2xl">
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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                </svg>
              </div>
            </div>

            {/* Form Heading */}
            <h2 className="text-2xl font-bold text-center text-white mb-6">Create Your Account</h2>

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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
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

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing Up...
                    </span>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/sign-in')}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Sign In
              </button>
            </div>
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
  );
}

export default Signup;