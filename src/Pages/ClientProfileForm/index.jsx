import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import './styles.scss';
import { Header } from '../../components';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
const ClientProfilePage = () => {
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    about: '',
    gender: '',
    DOB: '',
    email: '',
    languages: '',
    country: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setProfilePicture(URL.createObjectURL(file));
      setProfileData({ ...profileData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (key === 'languages') {
        formData.append(key, JSON.stringify(profileData[key].split(',')));
      } else if (key === 'image' && profileData[key] instanceof File) {
        formData.append('image', profileData[key]);
      } else {
        formData.append(key, profileData[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/client/clientprofile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setIsLoading(false);
      alert('Profile created successfully!');
      console.log('Created profile:', response.data);
      navigate('/ClientDashboard');
    } catch (err) {
      setError('Failed to create profile: ' + (err.response?.data?.message || err.message));
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Client Profile</title>
        <meta name="description" content="Create your client profile on YourApp" />
        <meta property="og:title" content="Create Client Profile | YourApp" />
        <meta property="og:description" content="Create your client profile on YourApp" />
        <meta property="og:type" content="profile" />
      </Helmet>
      <Header />
      <div className="client-profile-page">
        <h1>Create Your Profile</h1>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="profile-image-section">
            <h3>Upload your profile image</h3>
            <div className='img-format'>
              <span>Support Format: PNG, JPEG</span>
              <span>Maximum Size: 5MB</span>
            </div>
            <div className="profile-image">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile Preview" />
              ) : (
                <div className="empty-picture">
                  <FaCamera className="camera-icon" />
                </div>
              )}
              <label htmlFor="profilePicture" className="upload-overlay">
                <FaCamera />
                <span>Upload</span>
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/png, image/jpeg"
                onChange={handlePictureUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={profileData.first_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={profileData.last_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="DOB">Date of Birth</label>
              <input
                type="date"
                id="DOB"
                name="DOB"
                value={profileData.DOB}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={profileData.country}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Germany">Germany</option>
                <option value="Pakistan">Pakistan</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* About Me Section */}
          <div className="form-section">
            <h3>About Me</h3>
            <div className="form-group">
              <label htmlFor="about">Tell us about yourself</label>
              <textarea
                id="about"
                name="about"
                value={profileData.about}
                onChange={handleInputChange}
                rows="5"
              />
            </div>
          </div>

          {/* Languages Section */}
          <div className="form-section">
            <h3>Languages</h3>
            <div className="form-group">
              <label htmlFor="languages">Languages (comma-separated)</label>
              <input
                type="text"
                id="languages"
                name="languages"
                value={profileData.languages}
                onChange={handleInputChange}
                placeholder="e.g., English, Spanish, French"
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </>
  );
};

export default ClientProfilePage;