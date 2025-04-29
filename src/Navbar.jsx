import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // Manage menu open/close state

  return (
    <div>
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-md flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M3.055 13H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h1.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-lg font-semibold">AirQuality</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-blue-400 font-medium">Dashboard</Link>
          <Link to="/contact" className="text-gray-300 hover:text-gray-100">Contact Us</Link>
          <Link to="/about" className="text-gray-300 hover:text-gray-100">About Us</Link>
          <Link to="/alerts" className="text-gray-300 hover:text-gray-100">Alerts</Link>
          <Link to="/settings" className="text-gray-300 hover:text-gray-100">Settings</Link>
          <Link to="/sign-in">
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm font-medium">Sign In</button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}  // Toggle the menu
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-gray-800 text-gray-100 space-y-4 py-4">
          <Link to="/" className="text-blue-400 font-medium">Dashboard</Link>
          <Link to="/contact" className="text-gray-300 hover:text-gray-100">Contact Us</Link>
          <Link to="/about" className="text-gray-300 hover:text-gray-100">About Us</Link>
          <Link to="/alerts" className="text-gray-300 hover:text-gray-100">Alerts</Link>
          <Link to="/settings" className="text-gray-300 hover:text-gray-100">Settings</Link>
          <Link to="/sign-in">
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm font-medium">Sign In</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
