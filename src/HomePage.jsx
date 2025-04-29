import React, { useState } from 'react';
import { useNavigate,Link} from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-[Poppins-SemiBold]">
      {/* Navbar */}
      <Navbar />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700">
          <a href="#" className="block py-2 px-4 text-blue-400 font-medium">Dashboard</a>
          <a href="#" className="block py-2 px-4 text-gray-300 hover:text-gray-100">Devices</a>
          <a href="#" className="block py-2 px-4 text-gray-300 hover:text-gray-100">Analytics</a>
          <a href="#" className="block py-2 px-4 text-gray-300 hover:text-gray-100">Alerts</a>
          
          {/* make it to open contact us page */}
          <Link to="/contact" className="block py-2 px-4 text-gray-300 hover:text-gray-100">Contact Us</Link>
          <div className="px-4 py-2">
            <button 
              onClick={handleSignIn}
              className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm font-medium">
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow relative">
        {/* Hero Section */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            {/* Hero Image/Illustration (Placeholder) */}
            <div className="mb-8 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-blue-400 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 13H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h1.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-400 animate-fade-in">
              Indoor Air Quality <span className="text-white">Monitoring System</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Real-time monitoring and analytics for healthier indoor environments
            </p>
            {/* Key Stats */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-2xl font-semibold text-white">500+</p>
                <p className="text-sm text-gray-400">Devices Monitored</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-white">100+</p>
                <p className="text-sm text-gray-400">Trusted Companies</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg text-white font-medium transition-transform transform hover:scale-105">
                Get Started
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg text-white font-medium transition-transform transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Real-Time Monitoring</h3>
              </div>
              <p className="text-gray-400">
                Track PM2.5, CO2, VOCs, temperature, and humidity with second-by-second updates from our advanced sensor network.
              </p>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-teal-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Advanced Analytics</h3>
              </div>
              <p className="text-gray-400">
                Powerful data visualization and trend analysis to identify patterns and optimize indoor air quality management.
              </p>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Intelligent Alerts</h3>
              </div>
              <p className="text-gray-400">
                Customizable alerts notify you when air quality parameters exceed predefined thresholds, enabling rapid response.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-blue-400 text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Install Sensors</h3>
                <p className="text-gray-400">Set up our advanced sensors in your indoor spaces.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Monitor Data</h3>
                <p className="text-gray-400">Track air quality metrics in real-time.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Get Alerts</h3>
                <p className="text-gray-400">Receive instant notifications for air quality issues.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Take Action</h3>
                <p className="text-gray-400">Improve air quality with data-driven decisions.</p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-blue-400 text-center mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                <p className="text-gray-300 mb-4">"AirQuality helped us reduce indoor pollutants by 30% in just one month!"</p>
                <p className="text-sm text-gray-400">— Jane Doe, Facility Manager</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                <p className="text-gray-300 mb-4">"The real-time alerts are a game-changer for maintaining a healthy workspace."</p>
                <p className="text-sm text-gray-400">— John Smith, Office Administrator</p>
              </div>
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-8 text-center mb-12">
            <h2 className="text-3xl font-semibold text-white mb-4">Ready to Improve Your Indoor Air Quality?</h2>
            <p className="text-gray-200 mb-6">Join thousands of businesses ensuring healthier environments.</p>
            <button 
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Sign Up Now
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-4 py-6">
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

export default HomePage;