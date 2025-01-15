import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.scss";
import StarRating from "../ProfileView/starrating";
import { JobSucces } from "../../svg";
import { jwtDecode } from "jwt-decode";

const JobsCard = ({
  _id,
  job_id,
  estimated_timeline,
  due_date,
  type,
  title,
  rate,
  timeline,
  level,
  description,
  freelancer_id,
  client_id,
  tags,
  proposalId,
  verified,
  rating,
  location,
  postedTime,
  source,
  proposal_id,
  status, // Add status prop
  jobStatus, // Add jobStatus prop
  clientName, // Add these new props
  clientCountry, // Add these new props
  attachment,
  paymentStatus,
  paymentDetails,
}) => {
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [rating , setrating] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [message, setMessage] = useState(null);

  // ... existing state ...
  const [progressData, setProgressData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // console.log("clientid", client_id);
  // console.log("proposalid", proposal_id);

  // useEffect(() => {
  //   const fetchProgress = async () => {
  //     try {
  //       setLoadingProgress(true);
  //       const token = localStorage.getItem("token");
  //       if (!token) throw new Error("No authentication token found");

  //       const response = await axios.get(
  //         `http://localhost:5000/api/client/project-progress/${proposal_id}?client_id=${client_id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       console.log("fetch progress response", response.data);

  //       if (response.data.success) {
  //         setProgressData(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching project progress:", error);
  //     } finally {
  //       setLoadingProgress(false);
  //     }
  //   };

  //   if (client_id && proposal_id) {
  //     fetchProgress();
  //   }
  // }, [client_id, proposal_id]); // Remove the parameters from useEffect and add them as dependencies

  const [error, setError] = useState(null);

  // In your JobsCard component, modify the fetchProgress function:

  const fetchProgress = async () => {
    try {
      setLoadingProgress(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
      let url;
      if (source === "offer") {
        // For offers, use projectName
        url = `${BASE_URL}/api/client/project-progress/null?client_id=${client_id}&projectName=${encodeURIComponent(title)}`;
      } else {
        // For normal jobs
        url = `${BASE_URL}/api/client/project-progress/${proposal_id}?client_id=${client_id}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // console.log("fetch progress response", response.data);

      if (response.data.success) {
        setProgressData(response.data);
      }
    } catch (error) {
      console.error("Error fetching project progress:", error);
    } finally {
      setLoadingProgress(false);
    }
  };

  // Modify the useEffect dependency array to include necessary variables
  useEffect(() => {
    if (
      (client_id && proposal_id) ||
      (client_id && source === "offer" && title)
    ) {
      fetchProgress();
    }
  }, [client_id, proposal_id, source, title]);

  const handleAttachmentClick = (path) => {
    if (path) {
      // If the path is a full URL
      if (path.startsWith("http")) {
        window.open(path, "_blank");
      } else {
        // If it's a relative path, prepend your backend URL
        window.open(`${BASE_URL}/${path}`, "_blank");
      }
    }
  };

  useEffect(() => {
    const fetchReview = async () => {
      // Only fetch if job is completed and has an ID
      if (!job_id || !isJobCompleted()) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // For offers, use the offer ID but include source=offer

        // Determine which ID to use based on source
        const reviewId = source === "offer" ? job_id : _id;

        console.log("Fetching review with:", {
          source,
          reviewId,
          job_id,
          _id,
        });
        const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
        const response = await axios.get(
          `${BASE_URL}/api/freelancer/job-review/${reviewId}${source === 'offer' ? '?source=offer' : ''}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Review data successfully fetched:", response.data.data);
        // console.log("Review response:", response.data.data); // Debug log

        if (response.data.success) {
          setReview(response.data.data);
          setRatings(response.data.data.rating);
          setMessage(response.data.data.review_message);
        }
      } catch (err) {
        // Don't set error for 404 (no review yet) case
        if (err.response && err.response.status === 404) {
          setReview(null);
          setRatings(null);
          setMessage(null);
        } else {
          console.error("Error fetching review:", err);
          // Only set error for non-404 errors if you want to show them
          setError("Failed to load review");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [_id, job_id, source]); // Include status and jobStatus in dependencies

  // Function to check if job is completed
  const isJobCompleted = () => {
    if (source === 'offer') {
      return status === "completed";
    }
    return status === "completed" || jobStatus === "completed";
  };

  const handleViewClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      if (source === "offer") {
        // Navigate directly without fetching proposal
        navigate("/manageproj", {
          state: {
            jobData: {
              job_id: _id,
              type,
              title,
              rate,
              due_date, // Add due_date
              timeline: `${estimated_timeline?.duration} ${estimated_timeline?.unit}`,

              // timeline,
              level,
              description: description,
              tags,
              verified,
              rating,
              location,
              postedTime,
              projectType: "byproject",
              clientName,
              clientCountry,
            },
            proposalData: {
              _id,
              freelancer_id,
              client_id,
              clientName, // Add these new props
              clientCountry,
              status: "accepted",
              projectType: "byproject",
              add_requirements: {
                by_milestones: [
                  {
                    amount: parseFloat(rate.replace(/[^0-9.-]+/g, "")),
                    due_date: new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                    status: "Not Started",
                  },
                ],
              },
            },
            freelancer_id,
            client_id,
            isOffer: true, // Flag to identify this is an offer
          },
        });
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`, // Fixed template literal
        "Content-Type": "application/json",
      };
      const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
      // Fetch specific proposal data
      const response = await axios.get(
        `${BASE_URL}/api/freelancer/getproposals?jobId=${job_id}`, // Fixed template literal
        { headers }
      );
      // console.log("Fetched job_id:", job_id); // Debug log
      // Find the specific proposal for this job
      const specificProposal = response.data.proposals.find(
        (proposal) => proposal._id === proposalId
      );

      // console.log("proposals", response.data);

      if (!specificProposal) {
        throw new Error("No proposal found for this job");
      }

      // Navigate to ManageProj page with job and specific proposal data
      navigate("/manageproj", {
        state: {
          jobData: {
            job_id,
            type,
            title,
            rate,
            timeline,
            level,
            description,
            tags,
            verified,
            rating,
            location,
            postedTime, // Removed trailing comma
          },
          proposalData: specificProposal,
          freelancer_id: freelancer_id,
          client_id: client_id,
          job_id: job_id,
        },
      });
    } catch (error) {
      console.error("Error fetching proposal data:", error);
    }
  };

  useEffect(() => {
    // console.log("Current job attachment:", attachment);
    // console.log("rate", rate);
  }, [attachment]);

  const PaymentStatus = ({ PaymentStatus, details }) => {
    if (!PaymentStatus || PaymentStatus !== "paid") return null;

    return (
      <div className="job-card__payment-status">
        <div className="payment-status-badge">
          <i className="fas fa-check-circle"></i>
          <span>Payment Received</span>
        </div>
        <div className="payment-details">
          <div className="payment-detail-item">
            <span>Amount:</span>
            <strong>${details.amount}</strong>
          </div>
          <div className="payment-detail-item">
            <span>Date:</span>
            <strong>
              {new Date(details.paymentDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </strong>
          </div>
          <div className="payment-detail-item">
            <span>Transaction ID:</span>
            <strong>{details.transactionId}</strong>
          </div>
          <div className="payment-detail-item">
            <span>Method:</span>
            <strong>{details.paymentMethod}</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="job-card">
      <div className="job-card__content">
        <div className="job-card__header">
          <span className="job-card__title">{title}</span>
          <span className="job-card__posted-time">Posted {postedTime}</span>
          <button
            className={`job-card__view-button ${
              isJobCompleted() ? "disabled" : ""
            }`}
            onClick={handleViewClick}
            disabled={isJobCompleted()}
            title={
              isJobCompleted() ? "This job is completed" : "View job details"
            }
          >
            View
          </button>
        </div>

        {/* Add Client Information Section */}
        <div className="job-card__client-info">
          <div className="job-card__client-details">
            <span className="job-card__client-label">Client:</span>
            <span className="job-card__client-name">
              {clientName || "Unknown Client"}
            </span>
            <span className="job-card__client-location">
              <i className="fas fa-map-marker-alt"></i>{" "}
              {/* If you're using Font Awesome */}
              {clientCountry || "Unknown Location"}
            </span>
          </div>
        </div>

        <div className="job-card__information">
          <span className="job-card__rate-head">{type}:</span>
          <span className="job-card__rated">{rate}</span>
          <span className="job-card__timeline-head">Estimated time:</span>
          <span className="job-card__timeline"> {timeline}</span>
          {source !== "offer" && (
            <>
              <span className="job-card__level-head">Level:</span>
              <span className="job-card__level">{level}</span>
            </>
          )}
        </div>

        <p className="job-card__description">{description}</p>

        {/* Add Attachment Section */}
        {attachment && (
          <div className="job-card__attachment">
            <div className="job-card__attachment-header">
              <i className="fas fa-paperclip"></i>
              <span>Attachment</span>
            </div>
            <div
              className="job-card__attachment-content"
              onClick={() => {
                if (attachment.path) {
                  handleAttachmentClick(attachment.path);
                }
              }}
              style={{ cursor: attachment.path ? "pointer" : "default" }}
            >
              <i className="fas fa-file"></i>
              <span className="job-card__attachment-name">
                {attachment.fileName ||
                  attachment.originalname ||
                  "View Attachment"}
              </span>
            </div>
          </div>
        )}
        {progressData ? (
          <div className="job-card__progress-section">
            <div className="progress-container">
              {/* Header */}
              <div className="progress-header">
                <h3 className="project-title">Progress</h3>
                <span className="project-due-date">
                  Due:{" "}
                  {new Date(
                    progressData.projectDetails.due_date
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Progress Stats */}
              <div className="progress-stats">
                <div className="progress-percentage">
                  <h2>{progressData.progressData.overallProgress}%</h2>
                  <span>Complete</span>
                </div>
                <div className="time-metrics">
                  <div className="metric">
                    <span className="value">
                      {progressData.timeMetrics.daysRemaining}
                    </span>
                    <span className="label">Days Left</span>
                  </div>
                  <div className="metric">
                    <span className="value">
                      {progressData.timeMetrics.daysElapsed}
                    </span>
                    <span className="label">Days Elapsed</span>
                  </div>
                  {progressData.projectDetails.paymentStatus === "paid" && (
                    <div className="metric payment-metric">
                      <span className="value">
                        ${progressData.projectDetails.paymentDetails.amount}
                      </span>
                      <span className="label">Paid</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="overall-progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progressData.progressData.overallProgress}%`,
                  }}
                />
              </div>

              {/* Milestones Section */}
              <div className="milestones-section">
                <h4 className="milestone-header">
                  {progressData.progressData.completedMilestones} of{" "}
                  {progressData.progressData.totalMilestones} milestones
                  completed
                </h4>

                <div className="milestone-list">
                  {progressData.progressData.milestones.map(
                    (milestone, index) => (
                      <div key={index} className="milestone-item">
                        <div className="milestone-main">
                          <div className="milestone-info">
                            <h5>{milestone.name}</h5>
                            <span className="due-date">
                              Due:{" "}
                              {new Date(milestone.due_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="milestone-status-amount">
                            <span
                              className={`status ${milestone.status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {milestone.status}
                            </span>
                            <span className="amount">
                              ${milestone.amount}
                              {milestone.paid && (
                                <span className="payment-indicator">
                                  <i className="fas fa-check-circle"></i> Paid
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="milestone-progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="job-card__no-progress">
            {loadingProgress ? (
              <div className="loading">Loading progress data...</div>
            ) : (
              <div className="no-data">No progress data available yet</div>
            )}
          </div>
        )}
        <div className="job-card__tags">
          {tags.map((tag, index) => (
            <span key={index} className="job-card__tag">
              {tag}
            </span>
          ))}
        </div>

        {progressData &&
          progressData.projectDetails.paymentStatus === "paid" && (
            <PaymentStatus
              PaymentStatus={progressData.projectDetails.paymentStatus}
              details={progressData.projectDetails.paymentDetails}
            />
          )}
        <div className="job-card__extra">
          <JobSucces className="h-3 w-3" />
          {verified && (
            <span className="job-card__verified">Verified account</span>
          )}
          {/* Show review data if available */}
          {/* <div className="job-card__review">
            <StarRating rating={ratings} showRatingValue={true} />
            <span>{ratings}</span>
            {message && <p className="job-card__review-message">{message}</p>}
          </div> */}

          {/* Replace the existing review div with this */}
          {isJobCompleted() && (
            <div className="job-card__review-container">
              <div className="job-card__review-header">
                <h4>Client Review</h4>
                {ratings ? (
                  <StarRating rating={ratings} showRatingValue={true} />
                ) : (
                  <span className="pending-review">Pending</span>
                )}
              </div>
              {message ? (
                <div className="job-card__review-content">
                  <p className="job-card__review-message">"{message}"</p>
                </div>
              ) : (
                <div className="job-card__review-pending">
                  <i className="fas fa-hourglass-half"></i>
                  <p>Awaiting client review</p>
                  <span>
                    The client hasn't provided a review for this job yet.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Show loading state */}
          {loading && <span>Loading review...</span>}
          {/* Show error state */}
          {/* {error && <span className="error-message">Error loading review</span>} */}
          {/* <span className="job-card__location">{location}</span> */}
        </div>
      </div>
    </div>
  );
};

export default JobsCard;
