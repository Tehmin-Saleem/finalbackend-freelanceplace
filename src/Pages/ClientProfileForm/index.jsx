import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa'; // Icon for camera
import './styles.scss';
import { Header } from '../../components';

const ClientProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [languages, setLanguages] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [country, setCountry] = useState('');

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file)); // Preview uploaded image
    }
  };

  const handleSkillInput = (e) => {
    setSkillInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <>
      <Header />
      <div className="client-profile-page">
        <h1>My Profile</h1>

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="picture-container">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile Preview" className="profile-preview" />
            ) : (
              <div className="empty-picture">
                <FaCamera className="camera-icon" />
                <span>No Profile picture</span>
              </div>
            )}
          </div>
          <input type="file" id="profilePicture" onChange={handlePictureUpload} />
          <label htmlFor="profilePicture" className="upload-label">
            
          </label>
        </div>

        {/* About Me Section */}
        <div className="form-section">
          <h3>About Me</h3>
          <div className="form-group">
            <label htmlFor="aboutMe">Tell us about yourself</label>
            <textarea
              id="aboutMe"
              placeholder="Write a short bio"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows="5"
            />
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="Enter your first name" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Enter your last name" />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" />
          </div>

          {/* Country Section */}
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              <option value="Germany">Germany</option>
              <option value="Pakistan">Pakistan</option>
              <option value="India">India</option>
              {/* Add more countries as needed */}
            </select>
          </div>
        </div>

        {/* Preferred Freelancer Qualifications: Skills Section */}
        <div className="form-section">
          <h3>Preferred Freelancer Qualifications: Skills</h3>
          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              placeholder="Enter a skill and press Enter"
              value={skillInput}
              onChange={handleSkillInput}
              onKeyPress={handleKeyPress}
            />
            <div className="skills-list">
              {skills.map((skill, index) => (
                <div className="skill-item" key={index}>
                  <span>{skill}</span>
                  <button type="button" onClick={() => removeSkill(index)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="form-section">
          <h3>Languages</h3>
          <div className="form-group">
            <label htmlFor="languages">Languages</label>
            <input
              type="text"
              id="languages"
              placeholder="Enter languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" placeholder="Enter your phone number" />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" placeholder="Enter your address" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="save-button">Save</button>
          <button className="cancel-button">Cancel</button>
        </div>
      </div>
    </>
  );
};

export default ClientProfilePage;
