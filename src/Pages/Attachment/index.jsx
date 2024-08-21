import React from 'react';
import Header from "../../components/Common/Header"; // Assuming you have a Header component
import ProgressBar from "../../components/Common/ProgressBar.jsx"; // Import your ProgressBar component
import './styles.scss'; // Import the SCSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Attachment = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const steps = [
    { number: "1", label: "Job Title", color: "#4BCBEB" },
    { number: "2", label: "Description", color: "#4BCBEB" },
    { number: "3", label: "Preferred Skills", color: "#4BCBEB" },
    { number: "4", label: "Budget", color: "#4BCBEB" },
    { number: "5", label: "Project Duration", color: "#4BCBEB" },
    { number: "6", label: "Attachment", color: "#4BCBEB" },
  ];
  const handleBackButtonClick = () => {
    navigate('/ProjectDuration'); // Replace with your target route
  };
  const handleReviewButtonClick = () => {
    navigate('/ProjectDetails'); // Replace with your target route
  };
  
  
  const currentStep = 1;
  
  return (
    <div className="attachment-container">
      <Header />
      <div className="content">
        <ProgressBar steps={steps} currentStep={5} />
        <div className="form-container">
          <div className="left-side">
            <h4>4/6 Attachment</h4>
            <h1>Start the
                <br/> conversation.</h1>
            <p>Talent are looking for:</p>
            <ul>
              <li>Clear expectations about your task or deliverables</li>
              <li>The skills required for your work</li>
              <li>Good communication</li>
              <li>Details about how you or your team like to work</li>
            </ul>
            <button className="back-button" onClick={handleBackButtonClick}>Back</button>
          </div>
          <div className="right-side">
            <div className="form-group">
              <label>Describe what you need:</label>
              <textarea placeholder="Enter about your project details" style={{ height: '150px' }}></textarea>
            </div>
            <div className="attach-container">
              <button className="attach-button">
                <svg width="16" height="16" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                  <path d="M8.5 0a2.5 2.5 0 0 1 2.5 2.5V5H12a2.5 2.5 0 0 1 0 5h-1.5V12a2.5 2.5 0 0 1-5 0V10H2a2.5 2.5 0 0 1 0-5h1.5V2.5A2.5 2.5 0 0 1 8.5 0zm0 1A1.5 1.5 0 0 0 7 2.5V5H4.5a1.5 1.5 0 0 0 0 3h1.5v2.5a1.5 1.5 0 0 0 3 0V8h2.5a1.5 1.5 0 0 0 0-3H9V2.5A1.5 1.5 0 0 0 8.5 1z"/>
                </svg>
                Attach file
              </button>
              <p>Max file size: 100 MB</p>
            </div>
            <button className="review-button"onClick={handleReviewButtonClick}>Review job post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attachment;
