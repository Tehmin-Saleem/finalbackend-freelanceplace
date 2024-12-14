import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";
import Header from "../Commoncomponents/Header";
import Spinner from "../chatcomponents/Spinner";

const ConsultantOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.log("Offers data:", response.data);
        setOffers(response.data.offers || []); // Ensure offers is always an array
      } catch (err) {
        console.error("Fetch offers error:", err.response || err.message);
        setError("Failed to fetch offers.");
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
            <div className="no-offers">No offers received.</div>
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
                  <p>
                    <strong>Client:</strong> {client.name || "N/A"}
                  </p>
                  <p>
                    <strong>Description:</strong> {project.description|| "N/A"}
                  </p>
                  <p>
                    <strong>Rating:</strong> {offer.clientRating || "N/A"}
                  </p>
                  <p>
                    <strong>Deadline:</strong> {project.deadline || "N/A"}
                  </p>
                  <p>
                    <strong>Budget:</strong> {project.budget || "N/A"}
                  </p>
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
                      <button
                        className="accept-button"
                        onClick={() => alert("Redirect to offer details")}
                      >
                        See Project Details
                      </button>
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
