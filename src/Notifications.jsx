import React, { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('signupRequests') || '[]');
    setNotifications(storedRequests);
  }, []);

  // Optional: Clear all notifications
  const handleClearNotifications = () => {
    localStorage.removeItem('signupRequests');
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-[Poppins-SemiBold] p-6">

      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Signup Request Notifications</h1>
          {notifications.length > 0 && (
            <button
              onClick={handleClearNotifications}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
            >
              Clear All
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-400">No signup requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <svg
                    className="h-6 w-6 text-blue-400 mr-2"
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
                  <h2 className="text-xl font-semibold text-white">New Signup Request</h2>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <strong>Username:</strong> {request.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {request.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {request.gender.charAt(0).toUpperCase() + request.gender.slice(1)}
                  </p>
                  <p>
                    <strong>Requested At:</strong>{' '}
                    {new Date(request.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}