import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, Modal } from "../../components/index";
import "./styles.scss";

const ApplyJob = () => {
  const { jobPostId } = useParams();
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  const checkPaymentMethod = async () => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
      const response = await fetch(
        
        `${BASE_URL}/api/freelancer/checkPaymentMethod`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return {
        hasPaymentMethod: data.hasPaymentMethod,
        paymentDetails: data.paymentDetails,
      };
    } catch (error) {
      console.error("Error checking payment method:", error);
      return {
        hasPaymentMethod: false,
        paymentDetails: null,
      };
    }
  };

// Move handleApplyNow outside useEffect
const handleApplyNow = async () => {
  const paymentStatus = await checkPaymentMethod();
  setHasPaymentMethod(paymentStatus.hasPaymentMethod);
  
  if (!paymentStatus.hasPaymentMethod) {
    setShowPaymentModal(true);
  } else {
    navigate(`/submitProposal/${jobPostId}`);
  }
};

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchJobPost = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
        const response = await fetch(
          `${BASE_URL}/api/client/job-posts/${jobPostId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to fetch job post: ${response.statusText} - ${errorData.message}`
          );
        }

        const data = await response.json();
        setJobPost(data.jobPost);

        // If there's an attachment, handle file type and URL generation
        if (data.jobPost.attachment) {
          setFileUrl(data.jobPost.attachment.path); // Using the Cloudinary URL directly
          setFileType(data.jobPost.attachment.mimeType || "application/pdf");
        }

        setLoading(false);
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [jobPostId, navigate]);

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

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleViewFile = () => {
    if (fileType && fileUrl) {
      if (fileType.startsWith("image/")) {
        // For images, check if it's a URL or a Blob and handle accordingly
        if (fileUrl.startsWith("http")) {
          // If the fileUrl is a URL (like Cloudinary)
          window.open(fileUrl, "_blank");
        } else {
          // Otherwise, open the Blob URL
          window.open(fileUrl, "_blank");
        }
      } else if (fileType === "application/pdf") {
        // For PDF, open in a new tab
        window.open(fileUrl, "_blank");
      } else {
        alert("Unsupported file type.");
      }
    } else {
      alert("No file available to view.");
    }
  };

  // File Preview
  const renderFilePreview = () => {
    if (fileType && fileUrl) {
      if (fileType.startsWith("image/")) {
        return (
          <img
            src={fileUrl}
            alt="Attachment Preview"
            className="file-preview-image"
          />
        );
      } else if (fileType === "application/pdf") {
        return (
          <embed
            src={fileUrl}
            type="application/pdf"
            width="100%"
            height="500px"
            className="file-preview-pdf"
          />
        );
      }
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!jobPost) return <div>No job post found</div>;

  // const handleApplyNow = () => {
  //   navigate(`/submitProposal/${jobPostId}`);
  // };

  return (
    <>
      <Header />
      <div className="job-Details-Container">
        <h2 className="job-details-Heading">Job details</h2>

        <div className="job-Card">
          <div className="header-job">
            <div>
              <h3 className="job-Title">{jobPost.job_title}</h3>
              <p className="job-Location">Lahore</p>
              <p className="job-posted-Time">
                <span className="posted-text">Posted:</span>
                <span className="time-text">
                  {" "}
                  {formatTimeAgo(jobPost.createdAt)}
                </span>
              </p>
            </div>
            <button className="apply-now-bton" onClick={handleApplyNow}>
              Apply now
            </button>
          </div>

          <hr className="divider" />

          <div className="job-infor">
            <span className="job-info-item">
              <span className="labeltext">
                {jobPost.budget_type === "fixed"
                  ? "Fixed Price:"
                  : "Hourly Rate:"}
              </span>
              <span className="value">
                {jobPost.budget_type === "fixed"
                  ? `$${jobPost.fixed_price}`
                  : `$${jobPost.hourly_rate?.from} - $${jobPost.hourly_rate?.to} /hr`}
              </span>
            </span>
            <span className="job-info-item">
              <span className="labeltext">Estimated Time:</span>
              <span className="value">
                {jobPost.project_duration?.duration_of_work}
              </span>
            </span>
            <span className="job-info-item">
              <span className="labeltext">Level:</span>
              <span className="value">
                {jobPost.project_duration?.experience_level}
              </span>
            </span>
          </div>

          <h4 className="section-title">Project Overview:</h4>
          <p className="job-description">
            {jobPost.description || "No description provided."}
          </p>

          {jobPost.attachment && (
            <>
              <h4 className="section-title">Attachment:</h4>
              <div className="attachments">
                <div className="attachment-item">
                  <div className="attachment-file">
                    <span className="file-icon">📄</span>
                    <span className="file-name">
                      {jobPost.attachment.fileName}
                    </span>
                  </div>
                  <button className="view-btn" onClick={handleViewFile}>
                    <EyeIcon />
                    View
                  </button>
                </div>
                {/* Displaying the file preview */}
                <div className="file-preview">{renderFilePreview()}</div>
              </div>
            </>
          )}

          <h4 className="section-title">Skills and Expertise:</h4>
          <div className="skills">
            {jobPost.preferred_skills.map((skill) => (
              <span key={skill} className="skill">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Add the Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      >
        <div className="payment-modal-content">
          <h2>Payment Method Required</h2>
          <p>
            Please set up your payment method before applying for jobs. This
            ensures smooth transactions once you start working.
          </p>
          <div className="modal-buttons">
            <button
              className="setup-payment-btn"
              onClick={() => {
                setShowPaymentModal(false);
                navigate("/payment");
              }}
            >
              Set Up Payment Method
            </button>
            <button
              className="modal-close"
              onClick={() => setShowPaymentModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ApplyJob;
