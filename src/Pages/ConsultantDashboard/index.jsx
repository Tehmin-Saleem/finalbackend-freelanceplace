import React from "react";
import "./styles.scss";
import { FaUserCircle, FaEye, FaBriefcase } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components";

const ConsultantDashboard = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => navigate("/ConsultantProfileForm");
  const handleViewClick = () => navigate("/ConsultantProfileView");
  const handleOffersClick = () => navigate("/ConsultantOffers");

  return (
    <>
      <Header />
      <div className="consultant-dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Consultant Dashboard</h1>
            <p>Welcome! Manage your projects, feedback, and offers here.</p>
          </div>
          <div className="action-buttons">
            <button className="icon-button" onClick={handleProfileClick}>
              <FaUserCircle size={20} />
              <span>Profile</span>
            </button>
            <button className="icon-button" onClick={handleViewClick}>
              <FaEye size={20} />
              <span>View Profile</span>
            </button>
          </div>
        </header>

        <div className="dashboard-sections">
          <div className="dashboard-card assigned-jobs">
            <FaBriefcase className="card-icon" />
            <h2>Assigned Jobs</h2>
            <ul>
              <li>
                <strong>Website Redesign</strong> - Tech Solutions (Due: Nov 10)
              </li>
              <li>
                <strong>Mobile App Development</strong> - Healthify (Due: Nov 15)
              </li>
            </ul>
          </div>

          <div className="dashboard-card progress-review">
            <FaBriefcase className="card-icon" />
            <h2>Progress Review</h2>
            <ul>
              <li>
                <strong>Website Redesign</strong> - On Track
              </li>
              <li>
                <strong>Mobile App Development</strong> - Delayed
              </li>
            </ul>
          </div>

          <div className="dashboard-card feedback-submission">
            <FaBriefcase className="card-icon" />
            <h2>Feedback Submission</h2>
            <ul>
              <li>
                <strong>Website Redesign</strong> - Feedback submitted.
              </li>
              <li>
                <strong>Mobile App Development</strong> - Feedback needed.
              </li>
            </ul>
          </div>

          <div className="dashboard-card offers" onClick={() => navigate('/ConsultantOfferPage')}>
            <FaBriefcase className="card-icon" />
            <h2>Offers</h2>
            <p>View and manage client offers for projects.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDashboard;
