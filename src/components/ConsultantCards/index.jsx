import React, { useEffect, useState } from 'react';
import './styles.scss';
import Header from '../Commoncomponents/Header';

const ConsultantCard = () => {
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    skill: '',
    experienceLevel: '',
    educationDegree: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/client/Consultantsprofiles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("data",data);

        if (Array.isArray(data)) {
          setConsultants(data);
          setFilteredConsultants(data); // Initial display
        } else {
          throw new Error('Expected an array from the API');
        }
      } catch (error) {
        console.error('Error fetching consultants:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

 

  useEffect(() => {
    let updatedConsultants = consultants;

    if (filters.location) {
      updatedConsultants = updatedConsultants.filter((consultant) =>
        consultant.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.skill) {
      updatedConsultants = updatedConsultants.filter((consultant) =>
        consultant.skills
          ?.split(',')
          .map((skill) => skill.trim().toLowerCase())
          .some((skill) => skill.includes(filters.skill.toLowerCase()))
      );
    }

    if (filters.experienceLevel) {
      updatedConsultants = updatedConsultants.filter((consultant) =>
        consultant.experience.some((exp) =>
          exp.years >= parseInt(filters.experienceLevel, 10)
        )
      );
    }

    if (filters.educationDegree) {
      updatedConsultants = updatedConsultants.filter((consultant) =>
        consultant.education.some((edu) =>
          edu.degree.toLowerCase().includes(filters.educationDegree.toLowerCase())
        )
      );
    }

    setFilteredConsultants(updatedConsultants);
  }, [filters, consultants]);

  if (isLoading) {
    return <div>Loading consultants...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (filteredConsultants.length === 0) {
    return <div>No consultants found matching the filters.</div>;
  }

  return (
    <>
    <Header/>
    <div className="filter-container">
    
    <div className="filters">
  <div className="filter-input">
    <label htmlFor="location">Location:</label>
    <input
      id="location"
      type="text"
      placeholder="Filter by location"
      value={filters.location}
      onChange={(e) => handleFilterChange('location', e.target.value)}
    />
  </div>
  
  <div className="filter-input">
    <label htmlFor="skill">Skill:</label>
    <input
      id="skill"
      type="text"
      placeholder="Filter by skill"
      value={filters.skill}
      onChange={(e) => handleFilterChange('skill', e.target.value)}
    />
  </div>

  <div className="filter-input">
    <label htmlFor="experienceLevel">Experience:</label>
    <input
      id="experienceLevel"
      type="number"
      placeholder="Filter by min experience (years)"
      value={filters.experienceLevel}
      onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
    />
  </div>

  <div className="filter-input">
    <label htmlFor="educationDegree">Education Degree:</label>
    <input
      id="educationDegree"
      type="text"
      placeholder="Filter by education degree"
      value={filters.educationDegree}
      onChange={(e) => handleFilterChange('educationDegree', e.target.value)}
    />
  </div>
</div>

      <div className="consultant-card-container">
        {filteredConsultants.map((consultant) => (
          <div key={consultant._id} className="consultant-card">
            <div >
    <button 
      className="send-offer-button" 
      onClick={() => handleSendOffer(consultant._id)}
    >
      Send Offer
    </button>
  </div>
            <img src={consultant.profilePicture} alt="Profile" className="profile-picture" />
            <h3 className="consultant-name">{consultant.email}</h3>
            <p className="consultant-location">{consultant.address}</p>
            <p className="consultant-bio">{consultant.bio}</p>

            <h4 className="section-title">Experience</h4>
            <ul className="experience-list">
              {consultant.experience.map((exp, index) => (
                <li key={index}>
                  <strong>{exp.title}</strong> at {exp.company} ({exp.years} years)
                </li>
              ))}
            </ul>

            <h4 className="section-title">Education</h4>
            <ul className="education-list">
              {consultant.education.map((edu, index) => (
                <li key={index}>
                  <strong>{edu.degree}</strong>, {edu.institution} ({edu.year})
                </li>
              ))}
            </ul>

            <h4 className="section-title">Skills</h4>
<div className="skills">
  {consultant.skills ? (
    consultant.skills.split(',').map((skill, index) => (
      <span key={index} className="skill-tag">{skill.trim()}</span>
    ))
  ) : (
    <p>No skills listed</p>
  )}
</div>

            <h4 className="section-title">Certifications</h4>
            <p>{consultant.certifications}</p>

            <h4 className="section-title">LinkedIn URL</h4>
            <p>{consultant.linkedIn}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ConsultantCard;
