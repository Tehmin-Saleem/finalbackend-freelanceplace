import React from "react";
import "./style.scss";
// import Header from "../../components/Common/Header";
// import GreaterThan from "../svg coponents/GreaterThan";

const PostJob = () => {
  const steps = [
    { label: "", color: "#4BCBEB" }, // Blue
    { label: "", color: "#FF7F50" }, // Coral
    { label: "", color: "#3CB371" }, // Medium Sea Green
    { label: "D", color: "#FFD700" }, // Gold
    { label: "E", color: "#8A2BE2" }, // Blue Violet
    { label: "F", color: "#FF4500" }, // Orange Red
  ];

  return (
    <div className="post-job">
      {/* <Header /> */}
      <div className="container">
        <div className="job-form">
          <div className="header">
            <h2 className="title">Jobs</h2>
            {/* <GreaterThan /> */}
            <h2 className="title">Post a Job</h2>
          </div>
          <div className="progress-bar">
            <div className="bar"></div>
            <div className="steps">
              {steps.map((step, index) => (
                <div key={index} className="step">
                  <div
                    className="step-circle"
                    style={{ backgroundColor: step.color }}
                  >
                    <span className="text">{step.label}</span>
                  </div>
                  <div className="step-label" style={{ color: step.color }}>
                    {`Label ${step.label}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h3 className="step-title">1/6 Job Title</h3>
          <div className="content">
            <div className="content-left">
              <h4 className="subtitle">Let’s start with a strong title.</h4>
              <p className="description">
                This helps your job post stand out to the right candidates. It’s
                the first thing they’ll see, so make it count!
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
            <button className="btn next-btn">Next: Description</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
