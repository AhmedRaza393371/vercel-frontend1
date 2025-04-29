import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

function Settings() {
  const [userInfo, setUserInfo] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState('settings');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [thresholds, setThresholds] = useState(() => {
    const savedThresholds = localStorage.getItem('gasThresholds');
    return savedThresholds
      ? JSON.parse(savedThresholds)
      : {
          H2: { limit: 100, severity: 'warning' },
          Alcohol: { limit: 50, severity: 'warning' },
          CH4: { limit: 1000, severity: 'danger' },
          CO: { limit: 50, severity: 'danger' },
          C2H5OH: { limit: 50, severity: 'warning' },
          DustConcentration: { limit: 150, severity: 'warning' },
          Humidity: { limit: 100, severity: 'warning' },
          Temperature: { limit: 40, severity: 'warning' },
        };
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      navigate('/sign-in');
      return;
    }

    try {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
    } catch (error) {
      console.error('Error parsing user info:', error);
      localStorage.removeItem('userInfo');
      navigate('/sign-in');
    }
  }, [navigate]);

  const handleThresholdChange = (gas, field, value) => {
    setThresholds(prev => ({
      ...prev,
      [gas]: {
        ...prev[gas],
        [field]: field === 'limit' ? parseFloat(value) : value,
      },
    }));
  };

  const handleSave = () => {
    // Validate thresholds
    for (const [gas, { limit }] of Object.entries(thresholds)) {
      if (isNaN(limit) || limit <= 0) {
        setError(`${gas} threshold must be a positive number.`);
        return;
      }
    }
    setError('');
    localStorage.setItem('gasThresholds', JSON.stringify(thresholds));
    alert('Thresholds saved successfully!');
  };

  const handleReset = () => {
    const defaultThresholds = {
      H2: { limit: 100, severity: 'warning' },
      Alcohol: { limit: 50, severity: 'warning' },
      CH4: { limit: 1000, severity: 'danger' },
      CO: { limit: 50, severity: 'danger' },
      C2H5OH: { limit: 50, severity: 'warning' },
      DustConcentration: { limit: 150, severity: 'warning' },
      Humidity: { limit: 100, severity: 'warning' },
      Temperature: { limit: 40, severity: 'warning' },
    };
    setThresholds(defaultThresholds);
    localStorage.setItem('gasThresholds', JSON.stringify(defaultThresholds));
    setError('');
    alert('Thresholds reset to defaults.');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/sign-in');
  };

  const handleProfileClick = () => {
    if (userInfo?.isAdmin) {
      navigate('/admin-profile');
    } else {
      navigate('/user-profile');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        isSidebarCollapsed={isSidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        userInfo={userInfo}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div>
              <h1 className="text-lg font-semibold text-white">Settings</h1>
              <p className="text-sm text-gray-400">Configure gas thresholds</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="flex items-center cursor-pointer">
                <img
                  className="h-8 w-8 rounded-full mr-2"
                  src={userInfo?.profilePicture || '/api/placeholder/32/32'}
                  alt="User profile"
                />
                <span className="text-gray-300 text-sm font-medium">
                  {userInfo?.username || 'User'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700 z-10 hidden group-hover:block">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">{userInfo?.username || 'User'}</p>
                  <p className="text-xs text-gray-400">{userInfo?.email || ''}</p>
                  {userInfo?.isAdmin && (
                    <span className="inline-block bg-purple-500 text-white text-xs px-2 py-0.5 rounded mt-1">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {userInfo?.isAdmin ? 'Admin Profile' : 'Profile'}
                  </div>
                </button>
                <Link
                  to="/settings"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-900 p-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Gas Threshold Configuration</h2>
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {Object.entries(thresholds).map(([gas, { limit, severity }]) => (
                <div key={gas} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">{gas}</h3>
                  <div className="mb-2">
                    <label className="text-gray-300 text-sm block mb-1">Threshold (PPM)</label>
                    <input
                      type="number"
                      value={limit}
                      onChange={(e) => handleThresholdChange(gas, 'limit', e.target.value)}
                      className="w-full p-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm block mb-1">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => handleThresholdChange(gas, 'severity', e.target.value)}
                      className="w-full p-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="warning">Warning</option>
                      <option value="danger">Danger</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Save Thresholds
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;