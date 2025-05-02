import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './App.css';

function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-[Poppins-SemiBold]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow relative">
        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-400 animate-fade-in">
              About <span className="text-white">AirQuality</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Pioneering healthier indoor environments through innovative air quality solutions
            </p>
          </div>

          {/* Our Mission Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-blue-400 text-center mb-8">Our Mission</h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-center">
              At AirQuality, we are dedicated to transforming indoor spaces into healthier environments. 
              Our mission is to empower businesses and individuals with cutting-edge air quality monitoring 
              technology, providing real-time insights and actionable data to ensure clean, safe, and comfortable indoor air.
            </p>
          </div>

          {/* Our Story Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-blue-400 text-center mb-8">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:border-blue-500 transition-colors">
            <p className="text-gray-300 mb-4">
                  Founded in 2020, AirQuality emerged from a vision to address the growing need for reliable indoor air quality solutions. 
                  Our team of engineers, data scientists, and environmental experts collaborated to develop a state-of-the-art monitoring system 
                  that combines advanced sensors with powerful analytics.
                </p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:border-blue-500 transition-colors">
                <p className="text-gray-300 mb-4">
                  Today, AirQuality serves over 100 trusted companies and monitors more than 500 devices worldwide. 
                  We continue to innovate, driven by our commitment to improving health and well-being through better air quality.
                </p>
              </div>
            </div>
          </div>

{/* Our Team Section */}
<div className="mb-12">
            <h2 className="text-3xl font-semibold text-blue-400 text-center mb-8">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg text-center">
                <div className="w-24 h-24 bg-blue-500 bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Badar Hasnain Shehki</h3>
                <p className="text-gray-400">Chief Technology Officer</p>
                <p className="text-gray-400 text-sm mt-2">Driving advancements in sensor calibration for precise air quality monitoring.</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg text-center">
                <div className="w-24 h-24 bg-yellow-500 bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Muhammad Rafay</h3>
                <p className="text-gray-400">Head of Sensor Communication</p>
                <p className="text-gray-400 text-sm mt-2">Spearheading reliable sensor communication for seamless data transmission.</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg text-center">
                <div className="w-24 h-24 bg-teal-500 bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Muhammad Saif</h3>
                <p className="text-gray-400">Head of Cloud Operations</p>
                <p className="text-gray-400 text-sm mt-2">Managing cloud infrastructure for scalable and secure data processing.</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg text-center">
                <div className="w-24 h-24 bg-red-500 bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Ahmed Raza</h3>
                <p className="text-gray-400">Lead Web Developer</p>
                <p className="text-gray-400 text-sm mt-2">Crafting intuitive and responsive websites for an enhanced user experience.</p>
              </div>
            </div>
          </div>


          {/* Call to Action Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-8 text-center mb-12">
            <h2 className="text-3xl font-semibold text-white mb-4">Join Us in Creating Healthier Spaces</h2>
            <p className="text-gray-200 mb-6">Contact us to learn more about our mission and solutions.</p>
            <Link 
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </Link>
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
              <Link to="/contact" className="hover:text-gray-100">Contact Us</Link>
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

export default AboutUs;