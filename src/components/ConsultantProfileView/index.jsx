// src/components/ConsultantProfileView.js

import React, { useEffect, useState } from 'react';
import './styles.scss';

const ConsultantProfileView = ({ id }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      setLoading(true); // Start loading
      try {
        const response = await fetch(`http://localhost:5000/api/client/profile/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return null; // Avoid rendering if profile is null

  return (
    <div className="consultant-profile-view">
      <div className="profile-card">
        {profile.profilePicture && (
          <img 
            src={`http://localhost:5000/${profile.profilePicture}`} 
            alt="Profile" 
            className="profile-picture" 
          />
        )}
        <h2 className="profile-name">{profile.name}</h2>
        <p className="profile-bio">{profile.bio}</p>
        
        <div className="profile-details">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phoneNumber}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>LinkedIn:</strong> <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer">{profile.linkedIn}</a></p>
        </div>

        <div className="profile-experience">
          <h3>Experience</h3>
          {profile.experience?.length > 0 ? (
            <ul>
              {profile.experience.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> at {item.company} - {item.years}
                </li>
              ))}
            </ul>
          ) : (
            <p>No experience listed</p>
          )}
        </div>

        <div className="profile-education">
          <h3>Education</h3>
          {profile.education?.length > 0 ? (
            <ul>
              {profile.education.map((item, index) => (
                <li key={index}>
                  <strong>{item.degree}</strong> from {item.institution} - {item.year}
                </li>
              ))}
            </ul>
          ) : (
            <p>No education listed</p>
          )}
        </div>

        <div className="profile-certifications">
          <h3>Certifications</h3>
          {profile.certifications ? (
            <p>{profile.certifications}</p>
          ) : (
            <p>No certifications listed</p>
          )}
        </div>

        <div className="profile-skills">
          <h3>Skills</h3>
          {profile.skills?.length > 0 ? (
            <div className="skills-container">
              {profile.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          ) : (
            <p>No skills listed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultantProfileView;
