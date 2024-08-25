import React from 'react';
// Import your components and assets here
import {Header} from "../../components/index";
import {JobsDropdwon} from '../../svg/index';
import "./styles.scss";

const FreelancerCard = ({ heading, freelancers }) => {
  return (
    <div className="freelancer-card-container">
      <Header />
      
      <h1 className="heading">{heading}</h1>
      
      <div className="filter-options">
        <div className="filter-item">
          <span className="filter-label">Skills</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
        <div className="filter-item">
          <span className="filter-label">Categories</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
        <div className="filter-item">
          <span className="filter-label">Availability</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
        <div className="filter-item">
          <span className="filter-label">Location</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
        <div className="filter-item">
          <span className="filter-label">Ratings</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
      </div>

      {freelancers.map((freelancer, index) => (
        <div key={index} className="freelancer-card">
          <div className="freelancer-profile">
            <img src={freelancer.profilePic} alt="Profile" className="profile-pic" />
          </div>
          <div className="freelancer-details">
            <div className="freelancer-header">
              <div className="small-box">
                <img src={freelancer.smallProfilePic} alt="Small Profile" className="small-profile-pic" />
              </div>
              <h2 className="freelancer-name">{freelancer.name}</h2>
              <span className="freelancer-location">{freelancer.location}</span>
              <button className="invite-btn">Invite to job</button>
            </div>
            <div className="freelancer-role">
              {freelancer.roles.join(' | ')}
            </div>
            <div className="freelancer-meta">
              <span className="freelancer-rate">{freelancer.rate}</span>
              <span className="freelancer-success">{freelancer.successRate}</span>
              <span className="freelancer-earnings">{freelancer.earnings}</span>
            </div>
            <div className="freelancer-skills">
              {freelancer.skills.map((skill, i) => (
                <span key={i} className="skill-badge">{skill}</span>
              ))}
            </div>
            <div className="freelancer-description">
              {freelancer.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FreelancerCard;
