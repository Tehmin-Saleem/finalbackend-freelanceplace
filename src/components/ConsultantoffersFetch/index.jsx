import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";
import Header from "../Commoncomponents/Header";
import Spinner from "../chatcomponents/Spinner";
// import Spinner from "../../components/index";

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
          console.log("consultanvvghbjsjdjjbdtid",consultantId);
      
          const response = await axios.get(
            `http://localhost:5000/api/client/offer/${consultantId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Offers response:", response.data);
      
          setOffers(response.data.offers);
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
          offer.id === offerId ? { ...offer, status: action } : offer
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} the offer`, err);
    }
  };

  if (loading) return <Spinner size={100} alignCenter/>;
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
            offers.map((offer) => (
              <div className="offer-card" key={offer.id}>
                <div className="card-header">
                  <h3>{offer.projectName}</h3>
                  <span className={`status ${offer.status.toLowerCase()}`}>
                    {offer.status}
                  </span>
                </div>
                <p>
                  <strong>Client:</strong> {offer.clientName || "N/A"}
                </p>
                <p>
                  <strong>Rating:</strong> ⭐ {offer.clientRating || "N/A"}
                </p>
                <p>
                  <strong>Deadline:</strong> {offer.deadline || "N/A"}
                </p>
                <p>
                  <strong>Budget:</strong> {offer.budget || "N/A"}
                </p>
                <div className="action-buttons">
                  {offer.status === "Pending" && (
                    <>
                      <button
                        className="accept-button"
                        onClick={() => handleAction(offer.id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="decline-button"
                        onClick={() => handleAction(offer.id, "Declined")}
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {offer.status === "Accepted" && (
                    <span className="status-message success">
                      You have accepted this offer.
                    </span>
                  )}
                  {offer.status === "Declined" && (
                    <span className="status-message error">
                      You have declined this offer.
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultantOffers;
