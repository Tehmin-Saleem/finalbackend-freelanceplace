import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/index";
import "./styles.scss";

const ApplyJob = () => {
  const { jobPostId } = useParams();
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token retrieved:', token);
        
        const response = await fetch(`http://localhost:5000/api/client/job-posts/${jobPostId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch job post: ${response.statusText} - ${errorData.message}`);
        }
    
        const data = await response.json();
        setJobPost(data.jobPost);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job post:', error);
        setError(error.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [jobPostId]);

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

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleViewFile = () => {
    const filePath = jobPost.attachment?.path; // Assuming the path to the file is stored in `attachment.path`
    if (filePath) {
      const fileUrl = `http://localhost:5000/${filePath}`; // Adjust this base URL as needed
      const win = window.open();
      win.document.write('<iframe src="' + fileUrl + '" frameborder="0" style="width:100%; height:100%;" allowfullscreen></iframe>');
    } else {
      console.error("No file available to view.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!jobPost) return <div>No job post found</div>;

  return (
    <>
      <Header />
      <div className="job-details-container">
        <h2 className="job-details-heading">Job details</h2>

        <div className="job-card">
          <div className="job-header">
            <div>
              <h3 className="job-title">{jobPost.job_title}</h3>
              <p className="job-location">Lahore</p>
              <p className="job-posted-time">
                <span className="posted-text">Posted:</span> 
                <span className="time-text"> {formatTimeAgo(jobPost.createdAt)}</span>
              </p>
            </div>
            <button className="apply-now-btn">Apply now</button>
          </div>

          <hr className="divider" />

          <div className="job-info">
            <span className="job-info-item">
              <span className="label">
                {jobPost.budget_type === 'fixed' ? 'Fixed Price:' : 'Hourly Rate:'}
              </span> 
              <span className="value">
                {jobPost.budget_type === 'fixed'
                  ? `$${jobPost.fixed_price}`
                  : `$${jobPost.hourly_rate?.from} - $${jobPost.hourly_rate?.to} /hr`}
              </span>
            </span>
            <span className="job-info-item">
              <span className="label">Estimated Time:</span> 
              <span className="value">{jobPost.project_duration?.duration_of_work}</span>
            </span>
            <span className="job-info-item">
              <span className="label">Level:</span> 
              <span className="value">{jobPost.project_duration?.experience_level}</span>
            </span>
          </div>

          <h4 className="section-title">Project Overview:</h4>
          <p className="job-description">{jobPost.description || "No description provided."}</p>

          {jobPost.attachment && (
            <>
              <h4 className="section-title">Attachment:</h4>
              <div className="attachments">
                <div className="attachment-item">
                  <div className="attachment-file">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{jobPost.attachment.fileName}</span>
                  </div>
                  <button className="view-btn" onClick={handleViewFile}>
                    <EyeIcon />
                    View
                  </button>
                </div>
              </div>
            </>
          )}

          <h4 className="section-title">Skills and Expertise:</h4>
          <div className="skills">
            {jobPost.preferred_skills.map((skill) => (
              <span key={skill} className="skill">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyJob;
