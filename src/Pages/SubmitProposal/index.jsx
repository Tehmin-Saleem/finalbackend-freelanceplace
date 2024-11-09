import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import Header from "../../components/Commoncomponents/Header";
import "./styles.scss";
import Popup from "../../components/PopUps/PropsalSubmit";
// import Popup from "../../components/PopUps/PropsalSubmit";

const SubmitProposal = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  // Step 2: Function to show the popup
  const showPopup = () => {
    setPopupVisible(true);
  };

  // Step 3: Function to hide the popup
  const hidePopup = () => {
    setPopupVisible(false);
  };


  const [milestones, setMilestones] = useState([
    { description: "", dueDate: "", amount: "" },
  ]);
  const { jobPostId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freelancerId, setFreelancerId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(""); 

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { description: "", dueDate: "", amount: "" },
    ]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#00BFFF"/>
      <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="2"/>
      <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="2"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      className="calendar-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const FileIcon = () => (
    <svg
      className="file-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }
        const response = await fetch('http://localhost:5000/api/freelancer/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setFreelancerId(userData.id); // Save the freelancer ID
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      }
    };
    fetchUserData();
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }
        const response = await fetch(`http://localhost:5000/api/client/job-posts/${jobPostId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch job details: ${response.statusText}`);
        }

        const data = await response.json();
        setJobDetails(data.jobPost);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobPostId]);
  const [formData, setFormData] = useState({
    add_requirements: [],
    attachment: null,
    cover_letter: "",
    project_duration: "",
    portfolio_link: "",
   
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
     
      const add_requirements = paymentMethod === "milestone" 
        ? { 
            by_milestones: milestones.map(m => ({
              amount: parseFloat(m.amount),
              description: m.description,
              due_date: m.dueDate
            }))
          }
        : { 
            by_project: {
              bid_amount: parseFloat(formData.projectAmount),
              due_date: formData.projectDueDate
            }
          };
      formDataToSend.append('add_requirements', JSON.stringify(add_requirements));
      if (formData.attachment) {
        formDataToSend.append('attachment', formData.attachment);
      }
      formDataToSend.append('cover_letter', formData.cover_letter);
      formDataToSend.append('job_id', jobPostId);
      formDataToSend.append('project_duration', formData.project_duration);
      formDataToSend.append('portfolio_link', formData.portfolio_link);
      formDataToSend.append('client_id', jobDetails._id);
      // Removed: formDataToSend.append('freelancer_id', userId);
  
      const response = await fetch(`http://localhost:5000/api/freelancer/proposal/${jobPostId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to submit proposal: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Proposal submitted successfully:', result);
      navigate('/matchingJobs'); 
    } catch (error) {
      console.error('Error submitting proposal:', error);
      setError(error.message);
    }
  };
return (
  <>
    <Header />
    <div className="submit-proposal">
      <h1>Submit a Proposal</h1>
      <div className="outerContainer">
        <div className="horizontal-container">
          <div className="left-section">
            {loading ? (
              <p>Loading job details...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : jobDetails ? (
              <div className="job-details">
                <h2>Job Details</h2>
                <h3>{jobDetails.job_title}</h3>
                <p>{jobDetails.location}</p>
                <div className="job-info">
                  <span>
                    <strong>{jobDetails.budget_type === 'fixed' ? 'Fixed Price:' : 'Hourly Rate:'}</strong> 
                    {jobDetails.budget_type === 'fixed'
                      ? `$${jobDetails.fixed_price}`
                      : `$${jobDetails.hourly_rate?.from} - $${jobDetails.hourly_rate?.to} /hr`}
                  </span>
                  <span>
                    <strong>Estimated time:</strong> {jobDetails.project_duration?.duration_of_work}
                  </span>
                  <span>
                    <strong>Level:</strong> {jobDetails.project_duration?.experience_level}
                  </span>
                </div>
                <h3 className="projectoverview">Project Overview</h3>
                <p>{jobDetails.description}</p>
                <h3>Skills and Expertise</h3>
                <div className="skills">
                  {jobDetails.preferred_skills.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p>No job details found</p>
            )}
          </div>
          <div className="right-section">
            <div className="add-requirements">
              <h2>Add Requirements</h2>
              <form onSubmit={handleSubmit}>
                <label className="Label">Select how do you want to be paid:</label>
                <div className="payment-options">
                  <div className="option">
                    <label htmlFor="milestone">By milestones</label>
                    <input 
                      type="radio" 
                      id="milestone" 
                      name="payment" 
                      onChange={() => handlePaymentMethodChange("milestone")} 
                    />
                  </div>
                  <div className="option">
                    <label htmlFor="project">By project</label>
                    <input 
                      type="radio" 
                      id="project" 
                      name="payment" 
                      onChange={() => handlePaymentMethodChange("project")} 
                    />
                  </div>
                </div>

                {paymentMethod === "milestone" && (
                  <>
                    <label className="Label">
                      How many milestones do you want to include?
                      <span className="add-milestone-span" onClick={addMilestone}>
                        Add milestones <PlusIcon />
                      </span>
                    </label>

                    {milestones.map((milestone, index) => (
                      <div key={index} className="milestone">
                        <div className="milestone-row">
                          <div className="milestone-field">
                            <label>{index + 1}. Milestone Description:</label>
                            <input
                              type="text"
                              placeholder=""
                              value={milestone.description}
                              onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
                            />
                          </div>
                          <div className="milestone-field">
                            <label>Due date:</label>
                            <div className="date-input">
                              
                              <input
                                type="date"
                                value={milestone.dueDate}
                                onChange={(e) => handleMilestoneChange(index, "dueDate", e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="milestone-field">
                            <label>Amount:</label>
                            <div className="date-input">
                            <input
                              type="number"
                              placeholder="$12,00 per milestone"
                              value={milestone.amount}
                              onChange={(e) => handleMilestoneChange(index, "amount", e.target.value)}
                             
                            />
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {paymentMethod === "project" && (
                  <>
                    <div className="milestone-field">
                      <label>Amount:</label>
                      <input
                        type="number"
                        name="projectAmount"
                        value={formData.projectAmount}
                        onChange={handleInputChange}
                        placeholder="$12,00"
                      />
                    </div>
                    <div className="milestone-field">
                      <label>Due Date:</label>
                      <input
                        type="date"
                        name="projectDueDate"
                        value={formData.projectDueDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <label className="Label">How long will this project take?</label>
                <input
                  type="text"
                  name="project_duration"
                  value={formData.project_duration}
                  onChange={handleInputChange}
                  placeholder="Hours, Days or Months"
                  className="project-duration"
                />
                
                <label className="Label">Cover letter</label>
                <textarea
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleInputChange}
                  placeholder="Write your cover letter here"
                ></textarea>
                
                <label className="Label">Attachment</label>
                <div className="attachment-box">
                  <div className="attachment">
                    
                    <input
                      type="file"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                <label className="Label">Add portfolio link</label>
                <input
                  type="text"
                  name="portfolio_link"
                  value={formData.portfolio_link}
                  onChange={handleInputChange}
                  placeholder="Lorem ipsum"
                  className="portfolio-link"
                />
                
                <div className="actions">
                  <button type="button" className="cancel" onClick={() => navigate(-1)}>Cancel</button>
                  <button type="submit" className="submit" onClick={showPopup}>Send proposal</button>
                  {isPopupVisible && <Popup onClose={hidePopup} />}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default SubmitProposal;