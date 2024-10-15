import React, { useState } from 'react';
import './styles.scss';

const EditableProjectCard = ({ project, onSave }) => {
  const [freelancerData, setFreelancerData] = useState({
    projectName: project.projectName,
    progress: project.progress,
    milestones: project.milestones,
    budget: project.budget
  });

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFreelancerData({ ...freelancerData, [name]: value });
  };

  // Function to update milestone status
  const handleMilestoneChange = (index, status) => {
    const updatedMilestones = freelancerData.milestones.map((milestone, i) =>
      i === index ? { ...milestone, status } : milestone
    );
    setFreelancerData({ ...freelancerData, milestones: updatedMilestones });
  };

  // Save the changes (this would normally involve an API call)
  const handleSave = () => {
    onSave(freelancerData); // Pass the updated data back to the parent component
  };

  return (
    <div className="editable-project-card">
      {/* Project Info */}
      <div className="project-info">
        <label>Project Name:</label>
        <input
          type="text"
          name="projectName"
          value={freelancerData.projectName}
          onChange={handleChange}
        />
      </div>

      {/* Progress */}
      <div className="project-progress">
        <label>Progress (%):</label>
        <input
          type="number"
          name="progress"
          value={freelancerData.progress}
          onChange={handleChange}
          max="100"
        />
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${freelancerData.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones */}
      <div className="milestones">
        <h3>Edit Milestones</h3>
        {freelancerData.milestones.map((milestone, index) => (
          <div key={index} className="milestone-item">
            <p>{milestone.name}</p>
            <select
              value={milestone.status}
              onChange={(e) => handleMilestoneChange(index, e.target.value)}
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
        ))}
      </div>

      {/* Budget */}
      <div className="project-budget">
        <label>Budget (USD):</label>
        <input
          type="text"
          name="budget"
          value={freelancerData.budget}
          onChange={handleChange}
        />
      </div>

      {/* Save Button */}
      <button onClick={handleSave} className="save-btn">Save Changes</button>
    </div>
  );
};

export default EditableProjectCard;
