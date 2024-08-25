import React from "react";
import {Header, ZoomedImage} from "../../components/index"; // Adjust the import path as needed
import { BackgroundLining } from "../../svg/index";
import "./styles.scss";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FreelanceDashboardPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const handleJobPostingButtonClick = () => {
    navigate('/JobPosting'); // Replace with your target route
  };
  return (
    <div className="dashboard-page">
      {/* Importing Header Component */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        {/* Left Section */}
        <div className="left-section">
          <div className="left-content">
            <h1 className="welcome-text">
              Hello, Ali!
              <br />
              Let's begin by finding
              <br />
              work that matches
              <br/>
              your skills.
            </h1>
            <p className="description-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="start-button" onClick={handleJobPostingButtonClick}>Complete Your profile to get hired</button>
          </div>
          <BackgroundLining className="background-lining" />
        </div>

        {/* Right Section */}
        <div className="right-section">
          <ZoomedImage alt="Placeholder" className="illustration" />
        </div>
      </main>
    </div>
  );
};

export default FreelanceDashboardPage;
