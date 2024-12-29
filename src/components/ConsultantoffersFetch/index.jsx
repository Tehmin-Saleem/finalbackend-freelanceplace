import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";
import Header from "../Commoncomponents/Header";
import Spinner from "../chatcomponents/Spinner";
import ProjectDetailsModal from "../PopUps/SeeProjectDetails";
import { useNavigate } from 'react-router-dom';

const ConsultantOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const navigate = useNavigate();

  const handleSeeProjectDetails = (offerId) => {
    navigate('/SeeProjectDetails', { state: { offerId } }); // Pass offerId as state
  };

  // Fetch offers on component mount
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const consultantId = JSON.parse(atob(token.split(".")[1])).userId;

        const response = await axios.get(
          `http://localhost:5000/api/client/offer/${consultantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 404) {
          setOffers([]); // Set offers to an empty array
        } else {
          setOffers(response.data.offers || []); // Ensure offers is always an array
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setOffers([]); // Set offers to an empty array
          setError(""); // Clear the error state
        } else {
          console.error("Fetch offers error:", err.response || err.message);
          setError("Failed to fetch offers.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Handle offer actions
  const handleAction = async (offerId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/client/offer/${offerId}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update offer status locally
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          (offer.id || offer._id) === offerId
            ? {
                ...offer,
                offerDetails: {
                  ...offer.offerDetails,
                  project: {
                    ...offer.offerDetails.project,
                    status: action,
                  },
                },
              }
            : offer
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} the offer`, err);
    }
  };

  if (loading) return <Spinner size={100} alignCenter />;
  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );

  return (
    <>
      <Header />
      <div className="consultant-offers-page">
        <h1>Offers</h1>
        <div className="offers-container">
          {offers.length === 0 ? (
            <div className="no-offers">No offers received yet.</div>
          ) : (
            offers.map((offer) => {
              // Safely extract values with optional chaining
              const project = offer.offerDetails?.project || {};
              const client = offer.offerDetails?.client || {};
              const status =
                offer.offerDetails?.project?.status?.toLowerCase() || "pending";

              return (
                <div className="offer-card" key={offer.id || offer._id}>
                  <div className="card-header">
                    <h3>{project.name || "N/A"}</h3>
                    <span className={`status ${status}`}>
                      {project.status || "N/A"}
                    </span>
                  </div>
                  <div className="offer-details">
                    <div className="detail-section">
                      <h4>Project Details</h4>
                      <p>
                        <strong>Description:</strong> {offer.project_description || project.description || "N/A"}
                      </p>
                      {offer.budget_type === 'fixed' && (
                        <p>
                          <strong>Fixed Price:</strong> ${offer.fixed_price || "N/A"}
                        </p>
                      )}
                      {offer.budget_type === 'hourly' && (
                        <p>
                          <strong>Hourly Rate:</strong> ${offer.hourly_rate?.from || "N/A"} - ${offer.hourly_rate?.to || "N/A"}
                        </p>
                      )}
                    </div>

                    <div className="detail-section">
                      <h4><strong>Client Information:</strong></h4>
                      <p>
                        <strong>Client Name:</strong> {client.name || "N/A"}
                      </p>
                      <p>
                        <strong>Contact:</strong> {offer.client_id?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="action-buttons">
                    {status === "pending" && (
                      <>
                        <button
                          className="accept-button"
                          onClick={() =>
                            handleAction(offer.id || offer._id, "Accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="decline-button"
                          onClick={() =>
                            handleAction(offer.id || offer._id, "Declined")
                          }
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {status === "accepted" && (
        <div>
 <button
  className="accept-button"
  onClick={() => handleSeeProjectDetails(offer._id)} // Use _id here
>
  View Project Details
</button>
        </div>
                    )}
                    {status === "declined" && (
                      <span className="status-message error">
                        You have declined this offer.
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultantOffers;
