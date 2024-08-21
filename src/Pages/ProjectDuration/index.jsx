
import React from 'react';
import Header from "../../components/Common/Header";
import ProgressBar from "../../components/Common/ProgressBar.jsx";
import "./styles.scss";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProjectDuration = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const steps = [
        { number: "1", label: "Job Title", color: "#4BCBEB" },
        { number: "2", label: "Description", color: "#4BCBEB" },
        { number: "3", label: "Preferred Skills", color: "#4BCBEB" },
        { number: "4", label: "Budget", color: "#4BCBEB" },
        { number: "5", label: "Project Duration", color: "#4BCBEB" },
        { number: "6", label: "Attachment", color: "#6b7280" },
      ];
      
      const currentStep = 1;
      const handleAttachmentButtonClick = () => {
        navigate('/Attachment'); // Replace with your target route
      };
      const handleBackButtonClick = () => {
        navigate('/Budget'); // Replace with your target route
      };

  return (
    <div className="project-duration-container">
      <Header />
      <div className="content">
      <ProgressBar steps={steps} currentStep={4} />
        <div className="content-body">
          <div className="left-section">
            <h4>5/6 Project duration</h4>
            <h1>Next, estimate the 
                <br/>
                
                 scope of your
                 <br/>
                  work.</h1>
            <p>Consider the size of your project 
                <br/>
                
                and the time it will take.</p>
            <button className="back-button" onClick={handleBackButtonClick}>Back</button>
          </div>
          <div className="right-section">
            <div className="size-options">
              <div className="size-box">
                <span>Large</span>
                <input type="radio" name="size" />
              </div>
              <div className="size-box">
                <span>Medium</span>
                <input type="radio" name="size" />
              </div>
              <div className="size-box">
                <span>Small</span>
                <input type="radio" name="size" />
              </div>
            </div>

            <h2>How long will your work take?</h2>
            <div className="work-duration-options">
              <label>
                <input type="radio" name="duration" />
                3 to 6 months
              </label>
              <label>
                <input type="radio" name="duration" />
                1 to 3 months
              </label>
              <label>
                <input type="radio" name="duration" />
                Less than 1 month
              </label>
            </div>

            <h2>What level of experience will it need?</h2>
            <div className="experience-options">
              <label>
                <input type="radio" name="experience" />
                Entry
              </label>
              <label>
                <input type="radio" name="experience" />
                Intermediate
              </label>
              <label>
                <input type="radio" name="experience" />
                Expert
              </label>
            </div>

            <button className="next-button"onClick={handleAttachmentButtonClick}>Next: Attachment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDuration;
