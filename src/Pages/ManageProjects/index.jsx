import React, { useState } from 'react';
import EditableProjectCard from "../../components/EditAbleProjectCard";

const ManageProjects = () => {
  const [projects, setProjects] = useState([
    {
      projectName: 'Website Redesign',
      freelancerName: 'John Doe',
      deadline: '2024-11-01',
      progress: 60,
      milestones: [
        { name: 'Initial Design', status: 'Completed' },
        { name: 'Development', status: 'In Progress' },
        { name: 'Testing', status: 'Not Started' }
      ],
      budget: '5,000 USD'
    },
    {
      projectName: 'Mobile App Development',
      freelancerName: 'Jane Smith',
      deadline: '2024-12-15',
      progress: 30,
      milestones: [
        { name: 'Requirement Gathering', status: 'Completed' },
        { name: 'UI/UX Design', status: 'In Progress' },
        { name: 'Development', status: 'Not Started' }
      ],
      budget: '10,000 USD'
    }
  ]);

  // Handle saving updated data from EditableProjectCard
  const handleSave = (index, updatedProject) => {
    const updatedProjects = projects.map((project, i) =>
      i === index ? updatedProject : project
    );
    setProjects(updatedProjects);
  };

  return (
    <div className="manage-projects">
      <header className="header">
        <h1>Manage Ongoing Projects</h1>
      </header>

      <div className="project-list">
        {projects.map((project, index) => (
          <EditableProjectCard
            key={index}
            project={project}
            onSave={(updatedProject) => handleSave(index, updatedProject)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
