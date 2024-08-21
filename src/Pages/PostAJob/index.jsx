import React from "react";
import "./style.scss";
import Header from "../../components/Common/Header";
import GreaterThan from "../../svg components/GreaterThan";
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const PostJob = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const steps = [
    { number: "1", label: "Job Title", color: "#4BCBEB" }, // Blue
    { number: "2", label: "Description", color: "#6b7280" }, // Coral
    { number: "3", label: "Preferred Skills", color: "#6b7280" }, // Medium Sea Green
    { number: "4", label: "Budget", color: "#6b7280" }, // Gold
    { number: "5", label: "Project Duration", color: "#6b7280" }, // Blue Violet
    { number: "6", label: "Attachment", color: "#6b7280" }, // Orange Red
  ];
  const handleDescriptionButtonClick = () => {
    navigate('/JobDescription'); // Replace with your target route
  };

  return (
    <div className="post-job">
      <Header />
      <div className="container">
        <div className="job-form">
          <div className="title-container">
            <h2 className="title">Jobs</h2>
            <GreaterThan />
            <h2 className="title">Post a Job</h2>
          </div>
          <div className="progressdiv">
            <div className="progress-bar">
              <div className="bar"></div>
              <div className="steps">
                {steps.map((step, index) => (
                  <div key={index} className="step">
                    <div
                      className="step-circle"
                       style={{ backgroundColor: step.color }}
                    >
                      <span className="number">{step.number}</span>
                    </div>
                    <div className="step-label" style={{ color: step.color }}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h3 className="step-title">1/6 Job Title</h3>
          <div className="content">
            <div className="content-left">
              <h4 className="subtitle">Let’s start with a
                <br/>
               strong title.</h4>
              <p className="description">
                This helps your job post stand out
                <br/>
                 to the right candidates. It’s
                the first thing 
                <br/>
                they’ll see, so make it count!
              </p>
            </div>
            <div className="content-right">
              <label htmlFor="jobTitle" className="label">
                Enter job title:
              </label>
              <input
                type="text"
                id="jobTitle"
                className="input"
                placeholder="UI/UX Designer"
              />
              <div className="examples">
                <strong>Example titles:</strong>
                <ul className="list">
                  <li>
                    Build responsive WordPress site with booking/payment
                    functionality
                  </li>
                  <li>
                    AR experience needed for virtual product demos (ARCore)
                  </li>
                  <li>
                    Developer needed to update Android app UI for new OS/device
                    specs
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="actions">
            <button className="btn back-btn">Back</button>
            <button className="btn next-btn" onClick={handleDescriptionButtonClick}>Next: Description</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
