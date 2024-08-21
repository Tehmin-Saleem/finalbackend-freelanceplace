import React from 'react';
import Header from '../../components/Common/Header';
import ProgressBar from "../../components/Common/ProgressBar.jsx" // Assuming this is the extracted component
import "./styles.scss";
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const DescriptionPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
    const steps = [
        { number: '1', label: 'Job Title', color: '#4BCBEB' },
        { number: '2', label: 'Description', color: '#4BCBEB' },
        { number: '3', label: 'Preferred Skills', color: '#6b7280' },
        { number: '4', label: 'Budget', color: '#6b7280' },
        { number: '5', label: 'Project Duration', color: '#6b7280' },
        { number: '6', label: 'Attachment', color: '#6b7280' },
      ];
      const handlePrefferedSkillsButtonClick = () => {
        navigate('/PreferredSkills'); // Replace with your target route
      };
      const handleBackButtonClick = () => {
        navigate('/'); // Replace with your target route
      };
    
      const currentStep = 1; 
  return (
    <div className="description-page">
      <Header />
      <div className="container">
      <ProgressBar steps={steps} currentStep={1} />
        <h3 className="step-title">2/6 Description</h3>
        <div className="content">
          <div className="content-left">
            <h4 className="title">
              Enter detailed Description about your project
            </h4>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="content-right">
            <label htmlFor="projectDescription" className="label">
              Description
            </label>
            <textarea
              id="projectDescription"
              className="input description-box"
              placeholder="Enter about your project detail"
            ></textarea>
            <div className="examples">
              <strong>Example Description:</strong>
              <ul className="list">
                <li>Must be more than 50 characters</li>
                <li>Define the project overview</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="btn back-btn" onClick={handleBackButtonClick}>Back</button>
          <button className="btn next-btn" onClick={handlePrefferedSkillsButtonClick}>Next: Preferred Skills</button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionPage;
