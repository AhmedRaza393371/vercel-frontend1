import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const UserManagement = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768); // Initialize for mobile
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const [activeMenuItem, setActiveMenuItem] = useState('users');
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  // Handle sidebar collapse on resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Fetch users and devices from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://vercel-backend1-eight.vercel.app/api/users');
      setUsers(response.data || []); // Ensure array to prevent undefined errors
    } catch (err) {
      setError('Error fetching users');
      console.error('Fetch users error:', err);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get('https://vercel-backend1-eight.vercel.app/api/devices');
      const fetchedDevices = response.data || [];
      setDevices(fetchedDevices);
      localStorage.setItem('addedDevices', JSON.stringify(fetchedDevices));
    } catch (err) {
      setError('Error fetching devices');
      console.error('Fetch devices error:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDevices();
  }, []);

  // Handle form submission to add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const phoneRegex = /^\+?\d{10,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      setError('Invalid phone number. Use 10-15 digits, optionally starting with +.');
      setLoading(false);
      return;
    }

    if (deviceId && users.some(user => user.deviceId === deviceId)) {
      setError('This Device ID is already assigned to another user.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://vercel-backend1-eight.vercel.app/api/users', {
        email,
        password,
        username,
        gender,
        phoneNumber,
        deviceId,
      });
      setEmail('');
      setPassword('');
      setUsername('');
      setGender('');
      setPhoneNumber('');
      setDeviceId('');
      setUsers([...users, response.data]);
      setShowModal(false);
      setPopup({ show: true, message: 'User added successfully', type: 'success' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add user';
      setPopup({ show: true, message: errorMessage, type: 'error' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
      setError(errorMessage);
      console.error('Add user error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`https://vercel-backend1-eight.vercel.app/api/users/${encodeURIComponent(userId)}`);
      setUsers(users.filter(user => user.id !== userId));
      setPopup({ show: true, message: 'User deleted successfully', type: 'success' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      setPopup({ show: true, message: errorMessage, type: 'error' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
      setError(errorMessage);
      console.error('Delete user error:', err);
    }
  };

  // Reset form fields when opening modal
  const resetFormFields = () => {
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setUsername('');
      setGender('');
      setPhoneNumber('');
      setDeviceId('');
    }, 50);
  };

  // Filter available devices
  const availableDevices = devices.filter(
    device => !users.some(user => user.deviceId === device.id)
  );

  if (!userInfo) {
    return null; // Render nothing while redirecting to sign-in
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-900">
        {/* Sidebar */}
        <Sidebar 
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          isSidebarCollapsed={isSidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          userInfo={userInfo}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              User Management
              <span className="block text-sm font-normal text-gray-400 mt-1">Manage your users efficiently</span>
            </h1>
            <button
              onClick={() => { 
                setShowModal(true);
                resetFormFields();
              }}
              className="mt-4 sm:mt-0 flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add User
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {error}
            </div>
          )}

          {/* Existing Users Table */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">Existing Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-gray-100">
                  <thead>
                    <tr className="bg-gray-700 text-gray-300 text-left">
                      <th className="py-4 px-4 sm:px-6 font-medium">Username</th>
                      <th className="py-4 px-4 sm:px-6 font-medium">Email</th>
                      <th className="py-4 px-4 sm:px-6 font-medium">Gender</th>
                      <th className="py-4 px-4 sm:px-6 font-medium">Phone Number</th>
                      <th className="py-4 px-4 sm:px-6 font-medium">Device ID</th>
                      <th className="py-4 px-4 sm:px-6 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr
                          key={user.id || index} // Fallback to index if user.id is undefined
                          className={`border-t border-gray-700 hover:bg-gray-750 transition-colors duration-200 ${
                            index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'
                          }`}
                        >
                          <td className="py-4 px-4 sm:px-6">{user.username || 'N/A'}</td>
                          <td className="py-4 px-4 sm:px-6">{user.email || 'N/A'}</td>
                          <td className="py-4 px-4 sm:px-6 capitalize">{user.gender || 'N/A'}</td>
                          <td className="py-4 px-4 sm:px-6">{user.phoneNumber || 'N/A'}</td>
                          <td className="py-4 px-4 sm:px-6">{user.deviceId || 'N/A'}</td>
                          <td className="py-4 px-4 sm:px-6">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-400 hover:text-red-500 font-medium transition-colors duration-200"
                              disabled={!user.id}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-6 px-4 sm:px-6 text-center text-gray-400">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal for Adding a New User */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">Add New User</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleAddUser} className="space-y-5" autoComplete="off">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="add-username">
                      Username
                    </label>
                    <input
                      type="text"
                      id="add-username"
                      name="add-username"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-100 placeholder-gray-400"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                      autoComplete="new-username"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="add-email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="add-email"
                      name="add-email"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-100 placeholder-gray-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      required
                      autoComplete="new-email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="add-password">
                      Password
                    </label>
                    <input
                      type="password"
                      id="add-password"
                      name="add-password"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-100 placeholder-gray-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="add-gender">
                      Gender
                    </label>
                    <select
                      id="add-gender"
                      name="add-gender"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-100"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="" disabled className="text-gray-400">
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="add-phoneNumber">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="add-phoneNumber"
                      name="add-phoneNumber"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-100 placeholder-gray-400"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number (e.g., +1234567890)"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="add-deviceId">
                      Device ID
                    </label>
                    <select
                      id="add-deviceId"
                      name="add-deviceId"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-100"
                      value={deviceId}
                      onChange={(e) => setDeviceId(e.target.value)}
                      required
                    >
                      <option value="" className="text-gray-400">
                        Select Device ID 
                      </option>
                      {availableDevices.map(device => (
                        <option key={device.id} value={device.id}>
                          {device.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </div>
                    ) : (
                      'Add User'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Popup for Success/Error Messages */}
          {popup.show && (
            <div
              className={`fixed top-6 right-6 max-w-sm w-full p-4 rounded-lg shadow-xl text-white z-50 transform transition-all duration-300 ease-in-out ${
                popup.type === 'success'
                  ? 'bg-gradient-to-r from-green-500 to-teal-500'
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              } animate-slide-in`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-xl">
                    {popup.type === 'success' ? '✅' : '❌'}
                  </span>
                  <p className="font-medium">{popup.message}</p>
                </div>
                <button
                  onClick={() => setPopup({ show: false, message: '', type: '' })}
                  className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {/* Inline CSS for Animation */}
        <style jsx>{`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-in-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default UserManagement;
