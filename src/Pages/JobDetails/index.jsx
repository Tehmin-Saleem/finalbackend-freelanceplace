import React from "react";
import "./styles.scss";
import Header from "../../components/Common/Header";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="edit-icon"
    width="20"
    height="20"
  >
    <path
      fill="#4BCBEB"
      d="M2 17.25V21h3.75L17.81 8.94l-3.75-3.75L2 17.25zm16.71-9.04a1.001 1.001 0 000-1.41l-2.34-2.34a1.001 1.001 0 00-1.41 0L13 4.94l3.75 3.75 1.96-1.96z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="eye-icon"
    width="20"
    height="20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c7 0 10-9 10-9s-3-9-10-9-10 9-10 9 3 9 10 9z"
    />
  </svg>
);

const JobDetails = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({});
  useEffect(() => {
    // Retrieve all job data from localStorage
    const title = localStorage.getItem('jobTitle');
    const description = localStorage.getItem('jobDescription');
    const skills = JSON.parse(localStorage.getItem('preferredSkills'));
    const budget = JSON.parse(localStorage.getItem('jobBudget'));
    const duration = JSON.parse(localStorage.getItem('projectDuration'));
    const attachment = JSON.parse(localStorage.getItem('jobAttachment'));

    const parsedMinRate = budget?.minRate ? parseFloat(budget.minRate) : null;
    const parsedMaxRate = budget?.maxRate ? parseFloat(budget.maxRate) : null;

    setJobData({
        job_title: title,
        description,
        preferred_skills: skills,
        budget_type: budget?.type,
        hourly_rate: budget?.type === 'hourly' ? {
            from: parsedMinRate,
            to: parsedMaxRate
        } : null,
        fixed_price: budget?.type === 'fixed' ? parsedMaxRate : null, // Make sure to set this correctly
        project_duration: {
            project_size: duration?.size,
            duration_of_work: duration?.duration,
            experience_level: duration?.experienceLevel
        },
        attachment: {
            file: attachment?.fileName,
            detailed_description: attachment?.description || ''
        }
    });
}, []);

  const handlePostJob = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM1YWE4NWI4ZTExYjBiMDIyNDQ2ZDgiLCJlbWFpbCI6ImpvaG4uZEBleGFtcGxlLmNvbSIsImlhdCI6MTcyNDMyNjgzMCwiZXhwIjoxNzI0MzMwNDMwfQ.oF8roTglu1dKC5QtHZmNZer7yAaQ6SREpQUjgavkBOQ';
      const postData = {
        attachment: jobData.attachment,
        budget_type: jobData.budget_type,
        hourly_rate: jobData.hourly_rate,
        fixed_price: jobData.fixed_price,
        description: jobData.description,
        job_title: jobData.job_title,
        project_duration: jobData.project_duration,
        preferred_skills: jobData.preferred_skills,
        status: 'public', // Assuming a default status
      };

      // Log the jobData and token to check the payload and query parameters
      console.log('Posting job data:', postData);
      console.log('Token:', token);

      // Configure axios request with token in Authorization header
      const response = await axios.post('http://localhost:5000/api/client/jobpost', postData, {
        params: {
          token: token // Include token as a query parameter
      }
  });
    

      console.log('Job posted successfully:', response.data);

      // Clear localStorage and navigate only if the request was successful
      localStorage.clear();
      navigate('/ClientDashboard');
    } catch (error) {
      console.error('Error posting job:', error.response ? error.response.data : error.message);
     
    }
  };

  return (
    <div>
      <Header />
      <div className="job-details">
        <div className="top-bar">
          <h1 className="title">Job Details</h1>
        </div>
        <div className="content">
          <div className="details-container">
            <div className="detail-row">
              <h2 className="detail-title">{jobData.job_title}</h2>
              <EditIcon />
            </div>
            <div className="detail-row">
              <p className="detail-description">{jobData.description}</p>
              <EditIcon />
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Skills</h3>
              <p className="detail-text">{jobData.preferred_skills?.join(', ')}</p>
              <EditIcon />
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Budget</h3>
              <p className="detail-text">
                {jobData.budget_type === 'hourly'
                  ? `$${jobData.hourly_rate?.from}-${jobData.hourly_rate?.to} /hr`
                  : `$${jobData.fixed_price} fixed`}
              </p>
              <EditIcon />
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Project Duration</h3>
              <p className="detail-text">{`${jobData.project_duration?.project_size}, ${jobData.project_duration?.duration_of_work}, ${jobData.project_duration?.experience_level}`}</p>
              <EditIcon />
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Attachment</h3>
              <div className="attachment">
                <div className="file-details">
                  <span className="file-icon">&#128206;</span>
                  <span className="file-name">{jobData.attachment?.file}</span>
                </div>
                <button className="btn view-btn">
                  <EyeIcon />
                  View
                </button>
              </div>
              <EditIcon />
            </div>
          </div>
          <div className="actions">
            <button className="btn back-btn" onClick={() => navigate(-1)}>Back</button>
            <button className="btn post-job-btn" onClick={handlePostJob}>Post a Job</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
