import React from "react";
import "./styles.scss";
import { Header } from "../../components/index";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import JobPostedPopup from "../../components/PopUps/JobPosted";

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
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleClosePopup = () => {
    // Close the popup and redirect to homepage
    setPopupVisible(false);
    navigate("/ClientDashboard"); // Redirect to homepage
  };

  const navigate = useNavigate();
  const [jobData, setJobData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const storedData = {
      job_title: localStorage.getItem("jobTitle"),
      description: localStorage.getItem("jobDescription"),
      preferred_skills: JSON.parse(localStorage.getItem("preferredSkills")),
      budget: JSON.parse(localStorage.getItem("jobBudget")),
      duration: JSON.parse(localStorage.getItem("projectDuration")),
      attachment: JSON.parse(localStorage.getItem("jobAttachment")),
    };

    const parsedMinRate = storedData.budget?.minRate
      ? parseFloat(storedData.budget.minRate)
      : null;
    const parsedMaxRate = storedData.budget?.maxRate
      ? parseFloat(storedData.budget.maxRate)
      : null;

    setJobData({
      job_title: storedData.job_title,
      description: storedData.description,
      preferred_skills: storedData.preferred_skills,
      budget_type: storedData.budget?.type,
      hourly_rate:
        storedData.budget?.type === "hourly"
          ? {
              from: parsedMinRate,
              to: parsedMaxRate,
            }
          : null,
      fixed_price: storedData.budget?.type === "fixed" ? parsedMaxRate : null,
      project_duration: {
        project_size: storedData.duration?.size,
        duration_of_work: storedData.duration?.duration,
        experience_level: storedData.duration?.experienceLevel,
      },
      attachment: {
        fileName:
          storedData.attachment?.attachment?.fileName ||
          storedData.attachment?.fileName,
        base64: storedData.attachment?.attachment?.base64,
        detailed_description: storedData.attachment?.description || ''
      }
    });
    if (storedData.attachment?.attachment?.base64) {
      setFileUrl(storedData.attachment.attachment.base64);
      // Determine file type from base64 string or filename
      const fileExtension = storedData.attachment.attachment.fileName.split('.').pop().toLowerCase();
      setFileType(
        fileExtension === 'pdf' ? 'application/pdf' :
        fileExtension.match(/(jpg|jpeg|png|gif)/) ? `image/${fileExtension}` :
        'application/octet-stream'
      );
    }
  }, [navigate]);
  const handlePostJob = async () => {
    setPopupVisible(false);
    try {
      const token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("job_title", jobData.job_title);
      formData.append("description", jobData.description);

      jobData.preferred_skills.forEach((skill) =>
        formData.append("preferred_skills[]", skill)
      );

      formData.append("budget_type", jobData.budget_type);

      if (jobData.budget_type === "hourly") {
        formData.append("hourly_rate_from", jobData.hourly_rate.from);
        formData.append("hourly_rate_to", jobData.hourly_rate.to);
      } else if (jobData.budget_type === "fixed") {
        formData.append("fixed_price", jobData.fixed_price);
      }

      Object.entries(jobData.project_duration).forEach(([key, value]) => {
        formData.append(`project_duration[${key}]`, value);
      });

      formData.append("status", "public");

      if (jobData.attachment?.base64) {
        const blob = await fetch(jobData.attachment.base64).then((res) =>
          res.blob()
        );
        formData.append("attachment", blob, jobData.attachment.fileName);
        formData.append(
          "attachment_description",
          jobData.attachment.detailed_description || ""
        );
      }
  console.log('file',jobData.attachment)
      const response = await axios.post(
        "http://localhost:5000/api/client/jobpost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // params: { token: token }
        }
      );

      // navigate('/ClientDashboard');
      if (response.status === 200 || response.status === 201) {
        setPopupVisible(true);
      } else {
        // Handle unexpected success status
        alert('Something went wrong while posting the job. Please try again.');
      }
  
    } catch (error) {
      setError(error.response?.data?.message || 'Error posting job. Please try again.');
      alert("Error posting job:", error);
      setPopupVisible(false);
    } finally {
      setIsLoading(false); // End loading regardless of outcome
    }
  };
  const handleViewFile = () => {
    if (fileType && fileUrl) {
      // For PDF files, we need to properly format the base64 data URL
      if (fileType === 'application/pdf') {
        // Check if the base64 string already includes the data URL prefix
        const pdfDataUrl = fileUrl.startsWith('data:') 
          ? fileUrl 
          : `data:application/pdf;base64,${fileUrl}`;
        console.log('attachment', fileUrl)
        // Open PDF in a new window
        const pdfWindow = window.open();
        if (pdfWindow) {
          pdfWindow.document.write(
            `<iframe width='100%' height='100%' src='${pdfDataUrl}'></iframe>`
          );
        }
      } 
      // For images, keep the existing behavior
      else if (fileType.startsWith('image/')) {
        const imageDataUrl = fileUrl.startsWith('data:') 
          ? fileUrl 
          : `data:${fileType};base64,${fileUrl}`;
        window.open(imageDataUrl, '_blank');
      } 
      else {
        alert('Unsupported file type.');
      }
    } else {
      alert("No file available to view.");
    }
  };
  const renderFilePreview = () => {
    if (fileType && fileUrl) {
      // Format the data URL properly based on file type
      const dataUrl = fileUrl.startsWith('data:') 
        ? fileUrl 
        : `data:${fileType};base64,${fileUrl}`;

      if (fileType.startsWith('image/')) {
        return (
          <div className="file-preview">
            <img 
              src={dataUrl} 
              alt="Attachment Preview" 
              className="file-preview-image w-full max-h-64 object-contain" 
            />
          </div>
        );
      } else if (fileType === 'application/pdf') {
        return (
          <div className="file-preview">
            <iframe
              src={dataUrl}
              type="application/pdf"
              className="file-preview-pdf w-full h-64"
              title="PDF Preview"
            />
          </div>
        );
      }
    }
    return null;
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
              <p className="detail-text">
                {jobData.preferred_skills?.join(", ")}
              </p>
              {/* <EditIcon /> */}
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Budget</h3>
              <p className="detail-text">
                {jobData.budget_type === "hourly"
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
                  <span className="file-icon">📄</span>
                  <span className="file-name">
                    {jobData.attachment?.fileName || "No file uploaded"}
                  </span>
                </div>
                {jobData.attachment?.fileName && (
                  <button className="btn view-btn" onClick={handleViewFile}>
                    <EyeIcon />
                    View
                  </button>
                )}
                {/* File Preview Section */}
                {renderFilePreview()}
              </div>
            </div>
          </div>
          <div className="actions">
          <button 
              className="btn back-btn" 
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >Back</button>
            <button 
              className={`btn post-job-btn ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handlePostJob}
              disabled={isLoading}
            >
              {isLoading ? 'Posting...' : 'Post a Job'}
            </button>
          </div>
        </div>
      </div>
      {isPopupVisible && <JobPostedPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default JobDetails;
