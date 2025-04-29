import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMicrochip } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import Sidebar from './Sidebar.jsx'; // Import the Sidebar component

const Devices = () => {
  const [devices, setDevices] = useState([]); // All devices from API
  const [addedDevices, setAddedDevices] = useState(() => {
    const savedDevices = localStorage.getItem('addedDevices');
    let parsedDevices = savedDevices ? JSON.parse(savedDevices) : [];

    // Ensure all devices have a position field
    parsedDevices = parsedDevices.map((device) => ({
      id: device.id,
      position: device.position || `Device ${device.id}`,
      name: device.name || `Device ${device.id}`,
    }));

    return parsedDevices;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [newDevicePosition, setNewDevicePosition] = useState('');
  const [deviceStatuses, setDeviceStatuses] = useState({});
  // State for Sidebar
  const [activeMenuItem, setActiveMenuItem] = useState('devices'); // Set default to 'devices'
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  // Load userInfo from localStorage and handle navigation if not authenticated
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

  // Fetch devices from API with polling
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/devices');
        console.log('🔍 Fetched Devices:', response.data);
        setDevices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching devices. Please try again later.');
        setLoading(false);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync addedDevices with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('addedDevices', JSON.stringify(addedDevices));
    console.log('📦 Saved addedDevices to localStorage:', addedDevices);
  }, [addedDevices]);

  // Check device activity by querying data endpoint
  useEffect(() => {
    const checkDeviceActivity = async () => {
      const newStatuses = {};
      for (const device of addedDevices) {
        try {
          const response = await axios.get(`http://localhost:5000/api/data?deviceId=${device.id}`);
          const data = response.data;

          console.log(`🔍 Response for device ${device.id}:`, JSON.stringify(data, null, 2));

          if (!data || !data.body || !data.body.Readings || data.body.Readings.length === 0) {
            newStatuses[device.id] = {
              isActive: false,
              lastUpdated: 'No data',
            };
            continue;
          }

          let mostRecentTimestamp = null;
          data.body.Readings.forEach(reading => {
            let readingTime = null;
            if (reading.timestamp) {
              if (typeof reading.timestamp === 'string' && reading.timestamp.match(/^\d{4}-\d{2}-\d{2}T/)) {
                readingTime = new Date(reading.timestamp);
              } else if (typeof reading.timestamp === 'number') {
                readingTime = new Date(reading.timestamp < 1e9 ? reading.timestamp * 1000 : reading.timestamp);
              } else if (typeof reading.timestamp === 'string' && !isNaN(Number(reading.timestamp))) {
                readingTime = new Date(Number(reading.timestamp) < 1e9 ? Number(reading.timestamp) * 1000 : Number(reading.timestamp));
              }
            }

            if (readingTime && !isNaN(readingTime.getTime())) {
              if (!mostRecentTimestamp || readingTime > mostRecentTimestamp) {
                mostRecentTimestamp = readingTime;
              }
            }
          });

          if (!mostRecentTimestamp) {
            newStatuses[device.id] = {
              isActive: false,
              lastUpdated: 'Invalid timestamp',
            };
            continue;
          }

          const now = new Date();
          const timeDifference = now - mostRecentTimestamp;
          const isActive = timeDifference <= 30000;

          newStatuses[device.id] = {
            isActive,
            lastUpdated: mostRecentTimestamp.toLocaleString(),
          };
        } catch (err) {
          console.error(`❌ Error checking status for device ${device.id}:`, err.message);
          newStatuses[device.id] = {
            isActive: false,
            lastUpdated: 'Error checking status',
          };
        }
      }
      setDeviceStatuses(newStatuses);
    };

    checkDeviceActivity();
    const interval = setInterval(checkDeviceActivity, 10000);
    return () => clearInterval(interval);
  }, [addedDevices]);

  // Handle adding a new device
  const handleAddDevice = (e) => {
    e.preventDefault();
    if (!selectedDeviceId) {
      setError('Please select a device ID.');
      return;
    }
    if (!newDevicePosition.trim()) {
      setError('Please enter a device position.');
      return;
    }

    const sanitizedPosition = newDevicePosition.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
    if (!sanitizedPosition) {
      setError('Invalid device position. Use alphanumeric characters, spaces, or hyphens.');
      return;
    }

    if (addedDevices.some((device) => device.id === selectedDeviceId)) {
      setError('This device ID has already been added.');
      return;
    }

    const selectedDevice = devices.find((device) => device.id === selectedDeviceId);
    const deviceName = selectedDevice?.name || `Device ${selectedDeviceId}`;

    const newDevice = {
      id: selectedDeviceId,
      position: sanitizedPosition,
      name: deviceName,
    };

    setAddedDevices((prevDevices) => [...prevDevices, newDevice]);
    setSelectedDeviceId('');
    setNewDevicePosition('');
    setError(null);
  };

  // Handle removing a device
  const handleRemoveDevice = (id) => {
    const updatedDevices = addedDevices.filter(device => device.id !== id);
    setAddedDevices(updatedDevices);
    setDeviceStatuses((prev) => {
      const newStatuses = { ...prev };
      delete newStatuses[id];
      return newStatuses;
    });
    localStorage.setItem('addedDevices', JSON.stringify(updatedDevices));
    console.log(`🗑️ Removed device ${id}, updated addedDevices:`, updatedDevices);
  };

  // Check if a device is active
  const isDeviceActive = (deviceId) => {
    return deviceStatuses[deviceId]?.isActive || false;
  };

  // Handle device selection change
  const handleDeviceSelection = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  // Filter out devices that have already been added
  const availableDevices = devices.filter(
    (device) => !addedDevices.some((added) => added.id === device.id)
  );

  if (!userInfo) {
    return null; // Render nothing while redirecting to sign-in
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Add the Sidebar */}
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        isSidebarCollapsed={isSidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        userInfo={userInfo}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div>
              <h1 className="text-lg font-semibold text-white">Devices</h1>
              <p className="text-sm text-gray-400">Manage Your Devices</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-900 p-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(4).fill().map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-xl shadow-lg animate-pulse border border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-300 px-6 py-4 rounded-xl flex items-center max-w-lg mx-auto">
              <MdErrorOutline className="h-6 w-6 mr-3 text-red-400" />
              <span className="text-lg">{error}</span>
            </div>
          ) : (
            <>
              <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
                <form onSubmit={handleAddDevice} className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={selectedDeviceId}
                    onChange={handleDeviceSelection}
                    className="flex-1 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Device ID</option>
                    {availableDevices.length === 0 ? (
                      <option value="" disabled>
                        No more devices available
                      </option>
                    ) : (
                      availableDevices.map((device) => (
                        <option key={device.id} value={device.id}>
                          {device.name || device.id}
                        </option>
                      ))
                    )}
                  </select>
                  <input
                    type="text"
                    value={newDevicePosition}
                    onChange={(e) => setNewDevicePosition(e.target.value)}
                    placeholder="Enter device position (e.g., Living Room)"
                    className="flex-1 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add Device
                  </button>
                </form>
              </div>

              {addedDevices.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                  <p className="text-gray-400 text-lg">No devices added. Use the form above to add a device.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {addedDevices.map((device) => (
                    <div
                      key={device.id}
                      className={`relative p-6 rounded-xl shadow-lg transform transition-all duration-300 border-2 ${
                        isDeviceActive(device.id) ? ' border-green-500' : ' border-red-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <FaMicrochip
                          className={`h-12 w-12 ${
                            isDeviceActive(device.id) ? 'text-green-400' : 'text-red-400'
                          }`}
                        />
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              isDeviceActive(device.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}
                          >
                            {isDeviceActive(device.id) ? 'Online' : 'Offline'}
                          </span>
                          <button
                            onClick={() => handleRemoveDevice(device.id)}
                            className="px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Remove Device"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Device: {device.name || `Device ${device.id}`}
                        </h3>
                        <p className="text-sm text-gray-300 mb-2">
                          Position: {device.position || 'Unknown Position'}
                        </p>
                        <p className="text-sm text-gray-300 mb-2">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              isDeviceActive(device.id) ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          ></span>
                          {isDeviceActive(device.id) ? 'Active' : 'Inactive'}
                        </p>
                        <p className="text-sm text-gray-400">
                          Last Updated: {deviceStatuses[device.id]?.lastUpdated || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;