import React, { useState } from "react";
import { ClientFrame, FreelancerFrame, ConsultantFrame } from "../../svg/index"; // Import Consultant SVG
import "./styles.scss";
import { useNavigate } from 'react-router-dom';

const SignUpSection = () => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState("");

  const handleChange = (e) => {
    setSelectedUserType(e.target.value);
  };

  const handleCreateAccountButtonClick = () => {
    if (selectedUserType) {
      localStorage.setItem("userType", selectedUserType);
      navigate('/signup');
    } else {
      alert("Please select a user type.");
    }
  };

  return (
    <div className="sign-up-section">
      <div className="main-container">
        <div className="title">Freelance Marketplace</div>
        <div className="join-section">
          <h2 className="join-title">Join as a Client, Consultant, or Freelancer</h2>
          <div className="options-container">
            <div
              className={`option ${selectedUserType === "client" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="userType"
                value="client"
                id="client"
                className="radio-input"
                onChange={handleChange}
                checked={selectedUserType === "client"}
                required
              />
              <div className="option-content">
                <ClientFrame className="frame-icon" />
                <label htmlFor="client" className="option-label">
                  Client
                </label>
              </div>
              <p className="option-description">
                I’m a client, hiring for a project.
              </p>
            </div>

            {/* Consultant Option */}
            <div
              className={`option ${selectedUserType === "consultant" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="userType"
                value="consultant"
                id="consultant"
                className="radio-input"
                onChange={handleChange}
                checked={selectedUserType === "consultant"}
                required
              />
              <div className="option-content">
                <ConsultantFrame className="frame-icon" />
                <label htmlFor="consultant" className="option-label">
                  Consultant
                </label>
              </div>
              <p className="option-description">
                I’m a consultant, offering advice and expertise.
              </p>
            </div>

            <div
              className={`option ${selectedUserType === "freelancer" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="userType"
                value="freelancer"
                id="freelancer"
                className="radio-input"
                onChange={handleChange}
                checked={selectedUserType === "freelancer"}
                required
              />
              <div className="option-content">
                <FreelancerFrame className="frame-icon" />
                <label htmlFor="freelancer" className="option-label">
                  Freelancer
                </label>
              </div>
              <p className="option-description">
                I’m a freelancer, looking for work.
              </p>
            </div>
          </div>
        </div>
        <div className="account-section">
          <button
            className="create-account-button"
            onClick={handleCreateAccountButtonClick}
          >
            Create Account
          </button>
          <p className="login-text">
            Already have an account?{" "}
            <a href="signin" className="login-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpSection;
