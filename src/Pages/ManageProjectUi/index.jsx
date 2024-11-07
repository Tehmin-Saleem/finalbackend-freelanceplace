import React from 'react';
import './styles.scss'; // Assuming you're using SCSS
import Header from "../../components/Commoncomponents/Header";
const ManageProj = () => {
  return (
    <>
        <Header />
    <div className="manage-projects">
      {/* Header Section */}
      <header className="header">
        <h1>Manage Ongoing Projects</h1>
        <p>Track project progress and milestones</p>
        <div className="client-profile">
          <img src="client-profile.jpg" alt="Client" />
          <span>Client Name</span>
        </div>
      </header>

      {/* Project Cards */}
      <div className="project-list">
        {/* Static project card example */}
        <ProjectCard
          projectName="Website Redesign"
          freelancerName="John Doe"
          deadline="2024-11-01"
          progress={60}
          milestones={[
            { name: 'Initial Design', status: 'Completed' },
            { name: 'Development', status: 'In Progress' },
            { name: 'Testing', status: 'Not Started' }
          ]}
          budget="5,000 USD"
        />
        
        <ProjectCard
          projectName="Mobile App Development"
          freelancerName="Jane Smith"
          deadline="2024-12-15"
          progress={30}
          milestones={[
            { name: 'Requirement Gathering', status: 'Completed' },
            { name: 'UI/UX Design', status: 'In Progress' },
            { name: 'Development', status: 'Not Started' }
          ]}
          budget="10,000 USD"
        />
      </div>
    </div>
    </>
  );
};

// Project Card Component
const ProjectCard = ({ projectName, freelancerName, deadline, progress, milestones, budget }) => {
  return (
  
    <div className="project-card">
      {/* Project Header */}
      <div className="project-header">
        <div className="project-info">
          <h2>{projectName}</h2>
          <p>Freelancer: {freelancerName}</p>
        </div>
        <div className="project-deadline">
          <p>Deadline: {deadline}</p>
          <TimerButton />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="project-progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-percent">{progress}% complete</p>

      {/* Milestones */}
      <div className="milestones">
        <h3>Milestones</h3>
        {milestones.map((milestone, index) => (
          <MilestoneItem key={index} name={milestone.name} status={milestone.status} />
        ))}
      </div>

      {/* Project Budget */}
      <div className="project-budget">
        <p>Budget: {budget}</p>
      </div>
    </div>
  );
};

// Milestone Item Component
const MilestoneItem = ({ name, status }) => {
  return (
    <div className="milestone">
      <p>{name}</p>
      <p className={`status ${status.toLowerCase().replace(' ', '-')}`}>{status}</p>
    </div>
  );
};

// Timer Button Component
const TimerButton = () => {
  return (
    <button className="timer-btn">
      <i className="bell-icon">🔔</i> Set Notification
    </button>
   
  );

};

export default ManageProj;
