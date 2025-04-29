import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Alerts({ userInfo, activeDevices }) {
  const alerts = useSelector((state) => state.alerts);
  const [visibleAlert, setVisibleAlert] = useState(null);
  const displayedAlerts = useState(new Set())[0];

  // Filter alerts based on user permissions
  const filteredAlerts = userInfo?.isAdmin
    ? alerts
    : alerts.filter(alert => alert.deviceId === userInfo?.deviceId);

  // Handle new alerts
  useEffect(() => {
    if (activeDevices === 0 || filteredAlerts.length === 0) {
      setVisibleAlert(null);
      return;
    }

    const newestAlert = filteredAlerts[filteredAlerts.length - 1];

    if (newestAlert && !displayedAlerts.has(newestAlert.id)) {
      setVisibleAlert(newestAlert);
      displayedAlerts.add(newestAlert.id);

      const audio = new Audio('/alert-sound.mp3');
      audio.play().catch((error) => console.error('Error playing alert sound:', error));
    }
  }, [filteredAlerts, visibleAlert, displayedAlerts, activeDevices]);

  // Automatically remove the alert after 2 seconds
  useEffect(() => {
    if (visibleAlert) {
      const timer = setTimeout(() => {
        setVisibleAlert(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visibleAlert]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {visibleAlert && (
        <div
          key={visibleAlert.id}
          className={`relative p-4 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 ${
            visibleAlert.severity === 'warning'
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
              : 'bg-gradient-to-r from-red-500 to-red-600'
          } text-white flex items-center max-w-md`}
        >
          <svg
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-bold text-lg">{visibleAlert.title}</p>
            <p className="text-sm">{visibleAlert.message}</p>
            <p className="text-xs mt-1 opacity-80">Device: {visibleAlert.deviceId}</p>
            <p className="text-xs mt-1 opacity-80">
              Timestamp: {new Date(visibleAlert.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setVisibleAlert(null)}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Alerts;