import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState('alert-history');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
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

      // Determine the correct storage key based on user role
      const alertStorageKey = parsedUserInfo.isAdmin ? 'alerts' : `alerts-${parsedUserInfo.deviceId}`;
      const savedAlerts = localStorage.getItem(alertStorageKey);
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      localStorage.removeItem('userInfo');
      navigate('/sign-in');
    }
  }, [navigate]);

  const handleClearAlerts = () => {
    const alertStorageKey = userInfo?.isAdmin ? 'alerts' : `alerts-${userInfo?.deviceId}`;
    setAlerts([]);
    localStorage.setItem(alertStorageKey, JSON.stringify([]));
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
              <h1 className="text-lg font-semibold text-white">Alert History</h1>
              <p className="text-sm text-gray-400">View all past alerts</p>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Alert History</h2>
              <button
                onClick={handleClearAlerts}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Clear All Alerts
              </button>
            </div>
            {alerts.length === 0 ? (
              <p className="text-gray-400 text-center">No alerts recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 px-4">Timestamp</th>
                      <th className="py-2 px-4">Device ID</th>
                      <th className="py-2 px-4">Title</th>
                      <th className="py-2 px-4">Message</th>
                      <th className="py-2 px-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((alert) => (
                      <tr key={alert.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-2 px-4">{new Date(alert.timestamp).toLocaleString()}</td>
                        <td className="py-2 px-4">{alert.deviceId}</td>
                        <td className="py-2 px-4">{alert.title}</td>
                        <td className="py-2 px-4">{alert.message}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded ${
                              alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            } text-white text-xs`}
                          >
                            {alert.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertHistory;