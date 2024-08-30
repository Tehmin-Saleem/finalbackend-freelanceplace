import React from "react";
import "./styles.scss";
import {Header} from "../../components/index";
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
    const storedData = {
      job_title: localStorage.getItem('jobTitle'),
      description: localStorage.getItem('jobDescription'),
      preferred_skills: JSON.parse(localStorage.getItem('preferredSkills')),
      budget: JSON.parse(localStorage.getItem('jobBudget')),
      duration: JSON.parse(localStorage.getItem('projectDuration')),
      attachment: JSON.parse(localStorage.getItem('jobAttachment')),
    };

    const parsedMinRate = storedData.budget?.minRate ? parseFloat(storedData.budget.minRate) : null;
    const parsedMaxRate = storedData.budget?.maxRate ? parseFloat(storedData.budget.maxRate) : null;

    setJobData({
      job_title: storedData.job_title,
      description: storedData.description,
      preferred_skills: storedData.preferred_skills,
      budget_type: storedData.budget?.type,
      hourly_rate: storedData.budget?.type === 'hourly' ? {
        from: parsedMinRate,
        to: parsedMaxRate
      } : null,
      fixed_price: storedData.budget?.type === 'fixed' ? parsedMaxRate : null,
      project_duration: {
        project_size: storedData.duration?.size,
        duration_of_work: storedData.duration?.duration,
        experience_level: storedData.duration?.experienceLevel
      },
      attachment: {
        fileName: storedData.attachment?.attachment?.fileName || storedData.attachment?.fileName,
        base64: storedData.attachment?.attachment?.base64,
        detailed_description: storedData.attachment?.description || ''
      }
    });
  }, []);
  const handlePostJob = async () => {
    try {
      const token = localStorage.getItem('token');
      let formData = new FormData();
      formData.append('job_title', jobData.job_title);
      formData.append('description', jobData.description);
  
      jobData.preferred_skills.forEach(skill => formData.append('preferred_skills[]', skill));
  
      formData.append('budget_type', jobData.budget_type);
  
      if (jobData.budget_type === 'hourly') {
        formData.append('hourly_rate_from', jobData.hourly_rate.from);
        formData.append('hourly_rate_to', jobData.hourly_rate.to);
      } else if (jobData.budget_type === 'fixed') {
        formData.append('fixed_price', jobData.fixed_price);
      }
  
      Object.entries(jobData.project_duration).forEach(([key, value]) => {
        formData.append(`project_duration[${key}]`, value);
      });
  
      formData.append('status', 'public');
  
      if (jobData.attachment?.base64) {
        const blob = await fetch(jobData.attachment.base64).then(res => res.blob());
        formData.append('attachment', blob, jobData.attachment.fileName);
        formData.append('attachment_description', jobData.attachment.detailed_description || '');
      }
  
      const response = await axios.post('http://localhost:5000/api/client/jobpost', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        // params: { token: token } 
       
          
        
      });
  
      navigate('/ClientDashboard');
    } catch (error) {
      console.error('Error posting job:', error.response ? error.response.data : error.message);
    }
  };
  const handleViewFile = () => {
    if (jobData.attachment?.base64) {
      const fileUrl = jobData.attachment.base64;
      const win = window.open();
      win.document.write('<iframe src="' + fileUrl + '" frameborder="0" style="width:100%; height:100%;" allowfullscreen></iframe>');
    } else {
      console.error("No file available to view.");
    }
  };
  
    // const handleEditClick = () => {
    //   navigate('/jobPosting'); // Ensure navigation path is correct
    // };
  
  return (
    <div>
      <Header />
      <div className="job-detailsPage">
        <div className="Top-bar">
          <h1 className="title">Job Details</h1>
        </div>
        <div className="JobcontentBox">
          <div className="details-containerBox">
            <div className="detail-row">
              <h2 className="Detail-title">{jobData.job_title}</h2>
              {/* <EditIcon onClick={handleEditClick} /> */}
            </div>
            <div className="detail-row">
              <p className="detail-description">{jobData.description}</p>
              {/* <EditIcon /> */}
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Skills</h3>
              <p className="detail-text">{jobData.preferred_skills?.join(', ')}</p>
              {/* <EditIcon /> */}
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Budget</h3>
              <p className="detail-text">
                {jobData.budget_type === 'hourly'
                  ? `$${jobData.hourly_rate?.from}-${jobData.hourly_rate?.to} /hr`
                  : `$${jobData.fixed_price} fixed`}
              </p>
              {/* <EditIcon /> */}
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Project Duration</h3>
              <p className="detail-text">{`${jobData.project_duration?.project_size}, ${jobData.project_duration?.duration_of_work}, ${jobData.project_duration?.experience_level}`}</p>
              {/* <EditIcon /> */}
            </div>
            <div className="detail-row">
  <h3 className="detail-heading">Attachment</h3>
  <div className="attachment">
    <div className="file-details">
      <span className="file-icon">&#128206;</span>
      <span className="file-name">
        {jobData.attachment?.fileName || "No file uploaded"}
      </span>
      {/* {jobData.attachment?.detailed_description && (
        <span className="file-description">
          {jobData.attachment.detailed_description}
        </span>
      )} */}
    </div>
    {jobData.attachment?.fileName && (
      <button className="btn view-btn" onClick={handleViewFile}>
        <EyeIcon />
        View
      </button>
    )}
  </div>
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
