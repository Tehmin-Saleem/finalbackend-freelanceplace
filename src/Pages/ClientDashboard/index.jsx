import React from "react";
import {Header} from "../../components/index"; // Adjust the import path as needed
import Illustration from "../../images/Illustration.png"; // Adjust the image path as needed
import { BackgroundLining } from "../../svg/index";
import "./styles.scss";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from "react";
const DashboardPage = () => {
  const navigate = useNavigate(); 
  const [firstName, setFirstName] = useState('');
  const handleJobPostingButtonClick = () => {
    navigate('/JobPosting'); 
  };
  useEffect(() => {
    
    const storedFirstName = localStorage.getItem('firstName');
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
  }, []);
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
              Welcome, {firstName}!
              <br />
              Let's start with
              <br />
              your first job post.
            </h1>
            <p className="description-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="start-button" onClick={handleJobPostingButtonClick}>Get start job posting</button>
          </div>
          <BackgroundLining className="background-lining" />
        </div>

        {/* Right Section */}
        <div className="right-section">
          <img src={Illustration} alt="Placeholder" className="illustration" />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
