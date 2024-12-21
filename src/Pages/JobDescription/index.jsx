import React from 'react';
import Header from "../../components/Commoncomponents/Header";
import ProgressBar from "../../components/Commoncomponents/ProgressBar.jsx";
import "./styles.scss";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { useState, useEffect } from "react";
const DescriptionPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [description, setDescription] = useState("");
    const steps = [
        { number: '1', label: 'Job Title', color: '#4BCBEB' },
        { number: '2', label: 'Description', color: '#4BCBEB' },
        { number: '3', label: 'Preferred Skills', color: '#6b7280' },
        { number: '4', label: 'Budget', color: '#6b7280' },
        { number: '5', label: 'Project Duration', color: '#6b7280' },
        { number: '6', label: 'Attachment', color: '#6b7280' },
      ];
      const handlePrefferedSkillsButtonClick = () => {
        localStorage.setItem('jobDescription', description);
        navigate('/PreferredSkills'); // Replace with your target route
      };
      const handleBackButtonClick = () => {
        navigate('/JobPosting'); // Replace with your target route
      };
      useEffect(() => {
        // Retrieve description from localStorage if it exists
        const savedDescription = localStorage.getItem('jobDescription');
        if (savedDescription) setDescription(savedDescription);
      }, []);
    
    
  
      const currentStep = 1; 
  return (
    <>
    <Header />
    <div className="description-page">
   
      <div className="descontainer">
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
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
    </>
  );
};

export default DescriptionPage;
