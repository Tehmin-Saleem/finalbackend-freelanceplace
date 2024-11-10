import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import './styles.scss';
const ConsultantProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Decode the JWT token to get consultant ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // Assuming userId is stored in token

        if (!userId) {
          throw new Error('No consultant ID found in token');
        }

        // Fetch profile using the consultant ID from token
        const response = await fetch(`http://localhost:5000/api/client/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        setProfile(data.profile || data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  // Debug logs
  console.log('Loading:', loading);
  console.log('Profile:', profile);
  console.log('Error:', error);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading consultant profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="not-found-container">
        <h2>Profile Not Found</h2>
        <p>The requested consultant profile could not be found.</p>
      </div>
    );
  }

  return (
    <div className="consultant-profile-view">
      <div className="profile-card">
        {profile.profilePicture && (
          <div className="profile-picture-container">
            <img 
              src={`http://localhost:5000/${profile.profilePicture}`} 
              alt="Consultant Profile" 
              className="profile-picture"
              onError={(e) => {
                e.target.src = '/default-profile.png';
                e.target.onerror = null;
              }}
            />
          </div>
        )}

        <div className="profile-header">
          <h2 className="profile-name">{profile.name || 'Unnamed Consultant'}</h2>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        </div>
        
        <div className="profile-section contact-info">
          <h3>Contact Information</h3>
          <div className="info-grid">
            {profile.email && (
              <div className="info-item">
                <span>Email: {profile.email}</span>
              </div>
            )}
            {profile.phoneNumber && (
              <div className="info-item">
                <span>Phone: {profile.phoneNumber}</span>
              </div>
            )}
            {profile.address && (
              <div className="info-item">
                <span>Address: {profile.address}</span>
              </div>
            )}
            {profile.linkedIn && (
              <div className="info-item">
                <a 
                  href={profile.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="linkedin-link"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section experience">
          <h3>Professional Experience</h3>
          {profile.experience?.length > 0 ? (
            <div className="experience-list">
              {profile.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h4>{exp.title}</h4>
                  <p className="company">{exp.company}</p>
                  <p className="years">{exp.years}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-content">No experience listed</p>
          )}
        </div>

        <div className="profile-section education">
          <h3>Education</h3>
          {profile.education?.length > 0 ? (
            <div className="education-list">
              {profile.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <h4>{edu.degree}</h4>
                  <p className="institution">{edu.institution}</p>
                  <p className="year">{edu.year}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-content">No education listed</p>
          )}
        </div>

        {profile.certifications && (
          <div className="profile-section certifications">
            <h3>Certifications</h3>
            <p>{profile.certifications}</p>
          </div>
        )}

        <div className="profile-section skills">
          <h3>Skills & Expertise</h3>
          {profile.skills?.length > 0 ? (
            <div className="skills-container">
              {profile.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="no-content">No skills listed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultantProfileView;