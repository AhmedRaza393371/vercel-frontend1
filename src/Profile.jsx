import React, { useState, useEffect, useRef } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

function Profile() {
  const [activeMenuItem, setActiveMenuItem] = useState('profile');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    department: '',
    phone: ''
  });
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Load user info from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      navigate('/sign-in');
      return;
    }

    try {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      // Initialize form data
      setFormData({
        username: parsedUserInfo.username || '',
        email: parsedUserInfo.email || '',
        role: parsedUserInfo.role || (parsedUserInfo.isAdmin ? 'Administrator' : 'User'),
        department: parsedUserInfo.department || 'Not specified',
        phone: parsedUserInfo.phone || 'Not specified'
      });
    } catch (error) {
      console.error('Error parsing user info:', error);
      localStorage.removeItem('userInfo');
      navigate('/sign-in');
    }
  }, [navigate]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please upload a JPG or PNG image.');
      return;
    }

    setImageLoading(true);
    setImageError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      const updatedUserInfo = { ...userInfo, profilePicture: base64Image };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setImageLoading(false);
    };
    reader.onerror = () => {
      setImageError('Failed to process the image. Please try again.');
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // Update userInfo with form data
    const updatedUserInfo = {
      ...userInfo,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      phone: formData.phone
    };
    
    setUserInfo(updatedUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    setIsEditing(false);
    
    // Show success message (could use a toast notification here)
    alert("Profile updated successfully!");
  };

  if (!userInfo) {
    return <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

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
              <h1 className="text-lg font-semibold text-white">
                {userInfo.isAdmin ? 'Admin Profile' : 'User Profile'}
              </h1>
              <p className="text-sm text-gray-400">Manage your account information</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:text-white text-sm bg-gray-700 px-3 py-1 rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-900 p-4">
          {/* Profile Content */}
          <div className="max-w-3xl mx-auto">
            {/* Profile Header */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6 border border-gray-700">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
              <div className="px-6 py-4 relative">
                <div className="absolute -top-12 left-6">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div 
                      className="relative border-4 border-gray-800 rounded-full cursor-pointer" 
                      onClick={handleProfileImageClick}
                    >
                      {imageLoading ? (
                        <div className="h-24 w-24 rounded-full flex items-center justify-center bg-gray-600">
                          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : (
                        <img
                          className="h-24 w-24 rounded-full cursor-pointer object-cover"
                          src={userInfo?.profilePicture || '/api/placeholder/96/96'}
                          alt="User profile"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-32">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{formData.username}</h2>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-md"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveProfile}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400">
                    {userInfo.isAdmin ? 'Administrator' : 'Regular User'}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details Form */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6 border border-gray-700">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white rounded-md px-3 py-2 w-full border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white">{formData.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white rounded-md px-3 py-2 w-full border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white">{formData.email}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Role
                    </label>
                    {isEditing && userInfo.isAdmin ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white rounded-md px-3 py-2 w-full border border-gray-600 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Manager">Manager</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    ) : (
                      <p className="text-white">{formData.role}</p>
                    )}
                  </div>

                  {/* Department */}
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Department
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white rounded-md px-3 py-2 w-full border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white">{formData.department}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white rounded-md px-3 py-2 w-full border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white">{formData.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;