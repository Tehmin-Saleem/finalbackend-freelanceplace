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
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4MzViZWQ0OTViZGIyNmJhOWMyYmQiLCJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJpYXQiOjE3MjQ0MDEzMDIsImV4cCI6MTcyNDQwNDkwMn0.fn1JButsWkDqBChSan7ibMNTvdNAuz9eovfDMRenC2A'; // Replace with actual token retrieval
      let fileName = jobData.attachment?.fileName;

      let uploadedFile = null;
      if (jobData.attachment?.base64) {
        uploadedFile = await handleFileUpload(jobData.attachment.base64, jobData.attachment.fileName);
      }

      const postData = {
        attachment: uploadedFile ? {
          fileName: uploadedFile.fileName,
          description: jobData.attachment.detailed_description || ''
        } : null,
        budget_type: jobData.budget_type,
        hourly_rate: jobData.hourly_rate,
        fixed_price: jobData.fixed_price,
        description: jobData.description,
        job_title: jobData.job_title,
        project_duration: jobData.project_duration,
        preferred_skills: jobData.preferred_skills,
        status: 'public', // Assuming a default status
      };

      const response = await axios.post('http://localhost:5000/api/client/jobpost', postData, {
        params: { token: token }
      });

      localStorage.clear();
      navigate('/ClientDashboard');
    } catch (error) {
      console.error('Error posting job:', error.response ? error.response.data : error.message);
    }
  };

// Add this function to handle file upload
const handleFileUpload = async (base64File, fileName) => {
  const formData = new FormData();
  const blob = await fetch(base64File).then(res => res.blob());
  formData.append('file', blob, fileName);
  console.log('File:', base64File);
  console.log('FileName:', fileName);
  try {
    const response = await axios.post('http://localhost:5000/api/client/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4MzViZWQ0OTViZGIyNmJhOWMyYmQiLCJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJpYXQiOjE3MjQ0MDEzMDIsImV4cCI6MTcyNDQwNDkwMn0.fn1JButsWkDqBChSan7ibMNTvdNAuz9eovfDMRenC2A' }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
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
      <span className="file-name">
        {jobData.attachment?.fileName || "No file uploaded"}
      </span>
      {jobData.attachment?.detailed_description && (
        <span className="file-description">
          {jobData.attachment.detailed_description}
        </span>
      )}
    </div>
    {jobData.attachment?.fileName && (
      <button className="btn view-btn">
        <EyeIcon />
        View
      </button>
    )}
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
