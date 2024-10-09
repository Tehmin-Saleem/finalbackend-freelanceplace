import React from "react";
// Assuming you have a Header component
import "./styles.scss";
import { Header } from "../../components";

const ClientDashboard = () => {
  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome to Your Client Dashboard</h1>
        <p className="dashboard-description">
          Easily manage your projects, view freelancer proposals, and track job progress, all from a single dashboard. 
          Explore the functionalities below to elevate your project management experience.
        </p>
        <div className="dashboard-grid">
          <div className="dashboard-item">
            <h2>Post a Job</h2>
            <p>Create and post new jobs for freelancers to view and apply.</p>
            <button className="action-btn">Post Job</button>
          </div>

          <div className="dashboard-item">
            <h2>Your Jobs</h2>
            <p>View the jobs you’ve posted and their current status.</p>
            <button className="action-btn">View Jobs</button>
          </div>

          <div className="dashboard-item">
            <h2>Proposals</h2>
            <p>See proposals from freelancers who applied for your jobs.</p>
            <button className="action-btn">View Proposals</button>
          </div>

          <div className="dashboard-item">
            <h2>Job Progress</h2>
            <p>Track the progress of your ongoing jobs and milestones.</p>
            <button className="action-btn">View Progress</button>
          </div>

          <div className="dashboard-item">
            <h2>Freelancer Profiles</h2>
            <p>Explore the profiles of freelancers who applied or worked for you.</p>
            <button className="action-btn">View Freelancers</button>
          </div>

          <div className="dashboard-item">
            <h2>Client Ratings</h2>
            <p>View ratings given to freelancers for completed jobs.</p>
            <button className="action-btn">View Ratings</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;
