import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { Header } from "../../components/index";
import { GreaterThan } from "../../svg/index";
import { useNavigate } from "react-router-dom";

const jobTitleSuggestions = [
  "UI/UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Project Manager",
  "WordPress Developer",
  "Mobile App Developer",
  "React Developer",
  "Product Designer",
];
const steps = [
  { number: "1", label: "Job Title", color: "#4BCBEB" }, // Blue
  { number: "2", label: "Description", color: "#6b7280" }, // Coral
  { number: "3", label: "Preferred Skills", color: "#6b7280" }, // Medium Sea Green
  { number: "4", label: "Budget", color: "#6b7280" }, // Gold
  { number: "5", label: "Project Duration", color: "#6b7280" }, // Blue Violet
  { number: "6", label: "Attachment", color: "#6b7280" }, // Orange Red
];
const PostJob = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Handle dropdown suggestions when typing
  useEffect(() => {
    if (jobTitle.length > 0) {
      const filtered = jobTitleSuggestions.filter((title) =>
        title.toLowerCase().includes(jobTitle.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [jobTitle]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDescriptionButtonClick = () => {
    localStorage.setItem("jobTitle", jobTitle);
    navigate("/JobDescription");
  };

  const handleSuggestionClick = (title) => {
    setJobTitle(title);
    setShowSuggestions(false);
  };

  return (
    <>
    <Header />
    <div className="post-job">
      
      <div className="Jobcontainer">
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
              <h4 className="subtitle">
                Let’s start with a
                <br />
                strong title.
              </h4>
              <p className="description">
                This helps your job post stand out
                <br />
                to the right candidates. It’s
                the first thing
                <br />
                they’ll see, so make it count!
              </p>
            </div>

            <div className="content-right">
              <label htmlFor="jobTitle" className="label">
                Enter job title:
              </label>
              <div ref={inputRef} className="input-wrapper">
                <input
                  type="text"
                  id="jobTitle"
                  className="input"
                  placeholder="Type job title or select from suggestions"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onClick={() => setShowSuggestions(true)}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {filteredSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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
            <button
              className="btn next-btn"
              onClick={handleDescriptionButtonClick}
            >
              Next: Description
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PostJob;
