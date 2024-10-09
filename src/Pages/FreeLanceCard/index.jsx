import React, { useState, useEffect } from 'react';
import { Header } from "../../components/index";
import { JobsDropdwon } from '../../svg/index';
import "./styles.scss";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FreelancerCard = ({ heading }) => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // New State for Filters
  const [selectedSkills, setSelectedSkills] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    } else {
      const fetchFreelancerProfiles = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/freelancer/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setFreelancers(response.data.data);
          setLoading(false);
          console.log('profile', response.data.data)
        } catch (err) {
          setError('Failed to fetch freelancer profiles');
          setLoading(false);
        }
      };

      fetchFreelancerProfiles();
    }
  }, [navigate]);

  const handleDropdownClick = (filterName) => {
    setOpenDropdown(openDropdown === filterName ? null : filterName);
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'Skills':
        setSelectedSkills(value);
        break;
      case 'Categories':
        setSelectedCategory(value);
        break;
      case 'Location':
        setSelectedLocation(value);
        break;
      case 'Availability':
        setSelectedAvailability(value);
        break;
      default:
        break;
    }
  };

  // Filter Logic: Filtering freelancers based on selected options
  const filteredFreelancers = freelancers.filter((freelancer) => {
    return (
      (selectedSkills ? freelancer.skills.includes(selectedSkills) : true) &&
      (selectedCategory ? freelancer.experience.title === selectedCategory : true) &&
      (selectedLocation ? freelancer.location === selectedLocation : true) &&
      (selectedAvailability ? freelancer.availability === selectedAvailability : true)
    );
  });

  const categoriesOptions = ["MERN Stack", "UI/UX Designer", "frontend developer", "Backend Developer"];
  const skillsOptions = ["JavaScript", "Python", "CSS", "HTML"];
  const availabilityOptions = ["Full-time", "Part-time", "Contract"];
  const locationOptions = ["Remote", "On-site", "Hybrid"];
  const ratingsOptions = ["5 stars", "4 stars", "3 stars"];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="freelancer-card-container">
      <Header />

      <h1 className="heading">{heading}</h1>

      <div className="filter-options">
        {/* Skills Filter */}
        <div className="filter-item" onClick={() => handleDropdownClick('Skills')}>
          <span className="filter-label">Skills</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
          {openDropdown === 'Skills' && (
            <div className="dropdown-menu">
              {skillsOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="dropdown-item"
                  onClick={() => handleFilterChange('Skills', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories Filter */}
        <div className="filter-item" onClick={() => handleDropdownClick('Categories')}>
          <span className="filter-label">Categories</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
          {openDropdown === 'Categories' && (
            <div className="dropdown-menu">
              {categoriesOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="dropdown-item"
                  onClick={() => handleFilterChange('Categories', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Availability Filter */}
        <div className="filter-item" onClick={() => handleDropdownClick('Availability')}>
          <span className="filter-label">Availability</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
          {openDropdown === 'Availability' && (
            <div className="dropdown-menu">
              {availabilityOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="dropdown-item"
                  onClick={() => handleFilterChange('Availability', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="filter-item" onClick={() => handleDropdownClick('Location')}>
          <span className="filter-label">Location</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
          {openDropdown === 'Location' && (
            <div className="dropdown-menu">
              {locationOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="dropdown-item"
                  onClick={() => handleFilterChange('Location', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Freelancer Cards */}
      {filteredFreelancers.map((freelancer, index) => (
        <div key={index} className="freelancer-card">
          <div className="freelancer-profile">
          <img
              src={freelancer.image}  
              alt="Profile" className="profile-pic"
            />
          </div>
          <div className="freelancer-details">
            <div className="freelancer-header">
              <h2 className="freelancer-name">{freelancer.name}</h2>
              <span className="freelancer-location">{localStorage.getItem("country"||'unknown')}</span>
              <button className="invite-btn">Invite to job</button>
            </div>
            <div className="freelancer-role">{freelancer.experience.title}</div>
            <div className="freelancer-meta">
              <span className="freelancer-rate">
                ${freelancer.rate !== "Not specified" ? freelancer.rate : "Rate not specified"}/hr
              </span>
              <span className="freelancer-success">{freelancer.totalJobs} projects completed</span>
            </div>
            <div className="freelancer-skills">
              {freelancer.skills.map((skill, i) => (
                <span key={i} className="skill-badge">{skill}</span>
              ))}
            </div>
            <div className="freelancer-description">{freelancer.experience.description}</div>
          
          </div>
        </div>
      ))}
    </div>
  );
};

export default FreelancerCard;
