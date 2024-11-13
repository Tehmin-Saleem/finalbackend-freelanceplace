import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.scss";
import StarRating from "../ProfileView/starrating";
import { JobSucces } from "../../svg";
import { jwtDecode } from "jwt-decode";

const JobsCard = ({
  job_id,
  type,
  title,
  rate,
  timeline,
  level,
  description,
  freelancer_id,
  client_id,
  tags,
  verified,
  rating,
  location,
  postedTime,
  source,
  proposalId,
  status, // Add status prop
  jobStatus, // Add jobStatus prop
}) => {
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [rating , setrating] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [message, setMessage] = useState(null);

  // const [error, setError] = useState(null);



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

        // console.log("Fetching review for job:", job_id); // Debug log

        const response = await axios.get(
          `http://localhost:5000/api/freelancer/job-review/${job_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("Review response:", response.data.data); // Debug log

        if (response.data.success) {
          setReview(response.data.data);
          setRatings(response.data.data.rating);
          setMessage(response.data.data.review_message);
        }
      } catch (err) {
        console.error("Error fetching review:", err);
        // Only set error if it's not a 404 (no review found)
        if (err.response?.status !== 404) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [job_id]); // Include status and jobStatus in dependencies

  // Function to check if job is completed
  const isJobCompleted = () => {
    return status === "completed" || jobStatus === "completed";
  };

  const handleViewClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      if (source === 'offer') {
        // Navigate directly without fetching proposal
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
              postedTime
            },
            // Create minimal proposal data structure for offers
            proposalData: {
              _id: job_id,
              freelancer_id: freelancer_id,
              client_id: client_id
            },
            freelancer_id: freelancer_id,
            client_id: client_id,
            job_id: job_id,
          },
        });
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`, // Fixed template literal
        "Content-Type": "application/json",
      };

      // Fetch specific proposal data
      const response = await axios.get(
        `http://localhost:5000/api/freelancer/getproposals?jobId=${job_id}`, // Fixed template literal
        { headers }
      );
      console.log("Fetched job_id:", job_id); // Debug log
      // Find the specific proposal for this job
      const specificProposal = response.data.proposals.find(
        (proposal) => proposal._id === proposalId
      );

      console.log("proposals", response.data);

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
        <div className="job-card__information">
          <span className="job-card__rate-head">{type}:</span>
          <span className="job-card__rated">{rate}</span>
          <span className="job-card__timeline-head">Estimated time:</span>
          <span className="job-card__timeline"> {timeline}</span>
          <span className="job-card__level-head">Level:</span>
          <span className="job-card__level"> {level}</span>
        </div>
        <p className="job-card__description">{description}</p>
        <div className="job-card__tags">
          {tags.map((tag, index) => (
            <span key={index} className="job-card__tag">
              {tag}
            </span>
          ))}
        </div>
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
                <StarRating rating={ratings} showRatingValue={true} />
              </div>
              {message && (
                <div className="job-card__review-content">
                  <p className="job-card__review-message">"{message}"</p>
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
