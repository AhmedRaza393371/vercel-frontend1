import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';  // Outlet is used to render child routes

const Layout = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <div className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-56'}`}>
                <div className="p-4 flex items-center border-b border-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                            <path d="M3.055 13H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h1.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-200 font-semibold">AirQuality</span>}
                </div>

                <div className="py-4">
                    {/* Sidebar Menu Items */}
                    <Link to="/">
                        <button className="w-full flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                            {!isSidebarCollapsed && <span className="ml-3">Dashboard</span>}
                        </button>
                    </Link>

                    <Link to="/devices">
                        <button className="w-full flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            {!isSidebarCollapsed && <span className="ml-3">Devices</span>}
                        </button>
                    </Link>

                    {/* Other Menu Items can be added here */}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold text-white">Air Quality Monitoring</h1>
                    </div>
                </div>

                {/* Content will be injected here */}
                <div className="flex-1 overflow-auto bg-gray-900 p-4">
                    <Outlet /> {/* This renders the current page content */}
                </div>
            </div>
        </div>
    );
};

export default Layout;
