import React from 'react';
import Header from "../../components/Common/Header"; // Assuming you have a Header component
import ProgressBar from "../../components/Common/ProgressBar.jsx"; // Assuming you have a ProgressBar component
import './styles.scss'; // Import the SCSS file
import ClientFrame from '../../svg components/ClientFrame.jsx';
import HourlyRate from '../../svg components/HourlyRate.jsx';
import FixedRate from '../../svg components/FixedRate.jsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ProjectDuration from '../ProjectDuration/index.jsx';

const Budget = () => {

    const navigate = useNavigate(); // Initialize useNavigate
    const steps = [
        { number: "1", label: "Job Title", color: "#4BCBEB" },
        { number: "2", label: "Description", color: "#4BCBEB" },
        { number: "3", label: "Preferred Skills", color: "#4BCBEB" },
        { number: "4", label: "Budget", color: "#6b7280" },
        { number: "5", label: "Project Duration", color: "#6b7280" },
        { number: "6", label: "Attachment", color: "#6b7280" },
      ];
      const handleProjectDurationButtonClick = () => {
        navigate('/ProjectDuration'); // Replace with your target route
      };
      const handleBackButtonClick = () => {
        navigate('/PreferredSkills'); // Replace with your target route
      };
      
      const currentStep = 1;
  return (
    <div className="budget-page">
      <Header />
      <div className="progress-container">
      <ProgressBar steps={steps} currentStep={3} />
      </div>
      <div className="container">
        <div className="left-section">
          <h3>4/6 Budget</h3>
          <h2>Tell us about your budget.</h2>
          <p>This will help us match you to talent within 
            <br/>
            your range.</p>
          <button className="back-button" onClick={handleBackButtonClick}>Back</button>
        </div>
        <div className="right-section">
          <div className="pricing-options">
            <div className="option-box client">
              <div className="box-content">
                <span  >
                <HourlyRate />
                <span >Client</span>
                </span>
                <p>Hourly rate</p>
                <input type="radio" name="pricing" className="radio-btn" />
              </div>
            </div>
            <div className="option-box freelancer">
              <div className="box-content">
                <span>
                <FixedRate/>
                <span>Freelancer</span>
                </span>
                <p>Fixed price</p>
                <input type="radio" name="pricing" className="radio-btn" />
              </div>
            </div>
          </div>
          <div className="rate-inputs">
  <div className="labels">
    <label>From</label>
    <label className="to-label">To</label>
  </div>
  <div className="input-group">
    <div className="input-wrapper">
      <input type="text" placeholder="$12.00" />
      <span className="rate-unit">/hr</span>
    </div>
    <div className="input-wrapper">
      <input type="text" placeholder="$15.00" />
      <span className="rate-unit">/hr</span>
    </div>
  </div>
</div>
          <p className="average-rate-text">This is the average rate for similar projects.</p>
          <button className="next-button" onClick={handleProjectDurationButtonClick}>Next: Project Duration</button>
        </div>
      </div>
    </div>
  );
};

export default Budget;
