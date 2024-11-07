import React, { useState, useEffect } from 'react';
// import { decode as jwt_decode } from 'jwt-decode';
import './styles.scss';

function ConsultantProfileForm({ onSave }) {
    
    const [profile, setProfile] = useState({
        profilePicture: null,
        bio: '',
        experience: [{ title: '', company: '', years: '' }],
        skills: [],
        linkedIn: '',
        phoneNumber: '',
        address: '',
        education: [{ degree: '', institution: '', year: '' }],
        certifications: '',
        email: '',
    });

    useEffect(() => {
        const fetchEmailFromToken = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const jwt_decode = (await import('jwt-decode')).default;
                    const decodedToken = jwt_decode(token);
                    if (decodedToken && decodedToken.email) {
                        setProfile((prevProfile) => ({
                            ...prevProfile,
                            email: decodedToken.email,
                        }));
                    } else {
                        console.error('No email found in token');
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            } else {
                console.error('Token not found');
            }
        };
    
        fetchEmailFromToken();
    }, []);
    

     

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfile({ ...profile, profilePicture: file });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...profile.experience];
        newExperience[index][field] = value;
        setProfile({ ...profile, experience: newExperience });
    };

    const handleAddExperience = () => {
        setProfile({
            ...profile,
            experience: [...profile.experience, { title: '', company: '', years: '' }],
        });
    };

    const handleRemoveExperience = (index) => {
        const newExperience = profile.experience.filter((_, i) => i !== index);
        setProfile({ ...profile, experience: newExperience });
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...profile.education];
        newEducation[index][field] = value;
        setProfile({ ...profile, education: newEducation });
    };

    const handleAddEducation = () => {
        setProfile({
            ...profile,
            education: [...profile.education, { degree: '', institution: '', year: '' }],
        });
    };

    const handleRemoveEducation = (index) => {
        const newEducation = profile.education.filter((_, i) => i !== index);
        setProfile({ ...profile, education: newEducation });
    };

    const handleAddSkill = (skill) => {
        if (skill && !profile.skills.includes(skill)) {
            setProfile({ ...profile, skills: [...profile.skills, skill] });
        }
    };

    const handleRemoveSkill = (index) => {
        const newSkills = profile.skills.filter((_, i) => i !== index);
        setProfile({ ...profile, skills: newSkills });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        for (const key in profile) {
            if (key === 'experience' || key === 'education') {
                profile[key].forEach((item, index) => {
                    for (const subKey in item) {
                        formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
                    }
                });
            } else {
                formData.append(key, profile[key]);
            }
        }
    
        // Log formData keys and values to confirm email is present
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
    
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/client/profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                if (onSave) {
                    onSave(profile); // Pass profile data back to parent
                }
                window.location.href = '/ConsultantDash';
            } else {
                const errorText = await response.text();
                console.error('Error saving profile:', errorText);
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    };
    
    

    return (
        <form className="consultant-profile-form" onSubmit={handleSubmit}>
            <h1 className="profile-heading">My Profile</h1>
            <div className="form-group">
                <label>Profile Picture</label>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                {profile.profilePicture && (
                    <img
                        src={URL.createObjectURL(profile.profilePicture)}
                        alt="Profile Preview"
                        className="profile-preview"
                    />
                )}
            </div>

            <div className="form-group">
                <label>Bio</label>
                <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    placeholder="Write a short bio..."
                    rows="4"
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input
    type="email"
    name="email"
    value={profile.email}
    onChange={handleInputChange}
    placeholder="Your email"
/>
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +123456789"
                />
            </div>

      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={profile.address}
          onChange={handleInputChange}
          placeholder="Your address"
        />
      </div>

      <div className="form-group">
        <label>Experience</label>
        {profile.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <input
              type="text"
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
            />
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
            />
            <input
              type="text"
              placeholder="Years"
              value={exp.years}
              onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveExperience(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddExperience}>
          Add Experience
        </button>
      </div>

      <div className="form-group">
        <label>Education</label>
        {profile.education.map((edu, index) => (
          <div key={index} className="education-item">
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
            />
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
            />
            <input
              type="text"
              placeholder="Year"
              value={edu.year}
              onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveEducation(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddEducation}>
          Add Education
        </button>
      </div>

      <div className="form-group">
        <label>Skills</label>
        <div className="skills-input">
          {profile.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
              <button type="button" onClick={() => handleRemoveSkill(index)}>
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add a skill"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Certifications</label>
        <textarea
          name="certifications"
          value={profile.certifications}
          onChange={handleInputChange}
          placeholder="List your certifications..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>LinkedIn Profile</label>
        <input
          type="url"
          name="linkedIn"
          value={profile.linkedIn}
          onChange={handleInputChange}
          placeholder="https://www.linkedin.com/in/username"
        />
      </div>

      <button type="submit" className="submit-button">
        Save Profile
      </button>
    </form>
  );
}

export default ConsultantProfileForm;
