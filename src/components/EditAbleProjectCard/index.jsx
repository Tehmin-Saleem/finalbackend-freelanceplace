import React, { useState, useEffect } from 'react';
import './styles.scss';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const EditableProjectCard = ({ project, onSave, onComplete }) => {
 
 
 
  const [freelancerData, setFreelancerData] = useState({
    projectName: '',
    progress: 0,
    due_date: '',
    milestones: [],
    budget: 0,
    description: '',
    projectType: 'milestone',
    status: 'Ongoing',
    clientApproved: false,
    proposal_id: '',
    client_id: '',
    freelancer_id: ''
  });

  const [clientInfo, setClientInfo] = useState({
    clientName: 'Not specified'
  });
  
  const [showDueDateNotification, setShowDueDateNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    setFreelancerData({
      projectName: project.projectName || '',
      progress: project.progress || 0,
      due_date: project.due_date || new Date().toISOString(),
      milestones: project.milestones?.map(milestone => ({
        name: milestone.name || '',
        status: milestone.status || 'Not Started',
        amount: parseFloat(milestone.amount) || 0,
        due_date: milestone.due_date || project.due_date
      })) || [],
      budget: typeof project.budget === 'string' ? 
        parseFloat(project.budget.replace(/[^0-9.-]+/g, '')) : 
        project.budget || 0,
     
      projectType: project.projectType || 'milestone',
      status: project.status || 'Ongoing',
      clientApproved: project.clientApproved || false,
      proposal_id: project.proposal_id || '',
      client_id: project.client_id || '',
      freelancer_id: project.freelancer_id || ''
    });
      console.log("project type", project.projectType);
      
    setClientInfo({
      clientName: project.clientInfo?.clientName || 'Not specified'
    });

    const dueDate = new Date(project.due_date);
    const today = new Date();
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    setShowDueDateNotification(daysLeft <= 5);
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'progress') {
      processedValue = Math.min(Math.max(parseInt(value) || 0, 0), 100);
    } else if (name === 'budget') {
      processedValue = parseFloat(value) || 0;
    }

    setFreelancerData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleMilestoneChange = (index, status) => {
    const updatedMilestones = freelancerData.milestones.map((milestone, i) =>
      i === index ? { ...milestone, status } : milestone
    );

    const completedMilestones = updatedMilestones.filter(m => m.status === 'Completed').length;
    const totalMilestones = updatedMilestones.length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    setFreelancerData(prev => ({
      ...prev,
      milestones: updatedMilestones,
      progress
    }));
  };

  const shouldShowPendingApproval = () => {
    return freelancerData.progress === 100;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const projectData = {
        ...freelancerData,
        status: freelancerData.progress === 100 ? 'Pending Approval' : 'Ongoing'
      };
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authorization token not found");
      }
  
      if (!freelancerData.projectName) {
        throw new Error("Project name is required");
      }
  
      const formattedBudget = typeof freelancerData.budget === 'string' ? 
        parseFloat(freelancerData.budget.replace(/[^0-9.-]+/g, '')) : 
        freelancerData.budget;
  
  
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/freelancer/manageproj', 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: projectData
      });
  
      console.log("saved progress", response.data.data)
      if (response.data.success) {
        const data = response.data.data;
        
      
        // Determine the action based on `shouldShowPendingApproval`
        if (shouldShowPendingApproval()) {
          await onComplete?.(data);
        } else {
          await onSave?.(data);
        }
      
        // Navigate to freelancersjobpage for both cases
        navigate('/freelancersjobpage');
      } else {
        throw new Error(response.data.message || 'Failed to process project');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error updating project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="editable-project-card">
      {error && <div className="error-message">{error}</div>}
      
      <div className="client-info">
        <label>Client Name:</label>
        <p>{clientInfo.clientName || 'Not Specified'}</p>
      </div>

      <div className="project-info">
        <label>Project Name:</label>
        <input type="text" name="projectName" value={freelancerData.projectName} onChange={handleChange} />
        <label>Deadline:</label>
        <p style={{ color: showDueDateNotification ? 'red' : 'inherit' }}>
          {new Date(freelancerData.due_date).toLocaleString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </p>
        {showDueDateNotification && (
          <div className="due-date-notification">
            <p>This job is due in 5 days or less. Please complete the work before the deadline.</p>
          </div>
        )}
      </div>

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


           
      {freelancerData.projectType === 'milestone' && freelancerData.milestones.length > 0 && (
        <div className="milestones">
          <h5>Edit Milestones</h5>
          {freelancerData.milestones.map((milestone, index) => (
            <div key={index} className="milestone-item">
              <p>{milestone.name}</p>
              <select
                value={milestone.status}
                onChange={(e) => handleMilestoneChange(index, e.target.value)}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="project-description">
        <label>Comment or Description:</label>
        <textarea
          name="description"
          
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="project-budget">
        <label>Budget (USD):</label>
        <input
          type="text"
          name="budget"
          value={freelancerData.budget}
          onChange={handleChange}
        />
      </div>

      <div className="buttons-container">
        <button 
          onClick={handleSubmit} 
          className={`submit-btn ${shouldShowPendingApproval() ? 'pending-btn' : 'save-btn'}`}
          disabled={isLoading}
        >
          {isLoading
  ? 'Saving...'
  : freelancerData.progress === 100
  ? 'Mark as Pending Approval'
  : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditableProjectCard;