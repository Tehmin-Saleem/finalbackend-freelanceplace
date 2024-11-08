import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Header } from "../../components";

const OfferDetails = () => {
    const { offerId } = useParams(); // Extract offerId from URL
    const [offerDetails, setOfferDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            try {
                setLoading(true);
                // Fetch token from localStorage or any other means
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Unauthorized access: No token found");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/freelancer/offers/${offerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOfferDetails(response.data);
            } catch (err) {
                setError("Failed to load offer details");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOfferDetails();
    }, [offerId]);

    const handleAcceptOffer = () => {
        // Handle the accept offer functionality
        console.log("Offer accepted:", offerDetails.job_title);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Header />
            <div className="offer-details-card">
                {offerDetails ? (
                    <div className="freelancer-header">
                        <div className="freelancer-profile">
                            <img
                                src={offerDetails.freelancer.profilePic}
                                alt="Profile"
                                className="profile-pic"
                            />
                        </div>
                        <div className="freelancer-info">
                            <h2 className="freelancer-name">{offerDetails.freelancer.name}</h2>
                            <span className="freelancer-location">{offerDetails.freelancer.location}</span>
                            <div className="freelancer-role">{offerDetails.freelancer.roles.join(", ")}</div>
                            <div className="freelancer-meta">
                                <span className="freelancer-rate">Rate: {offerDetails.freelancer.rate}</span>
                                <span className="freelancer-success">
                                    Success Rate: {offerDetails.freelancer.successRate}
                                </span>
                                <span className="freelancer-earnings">
                                    Earnings: {offerDetails.freelancer.earnings}
                                </span>
                                <span className="freelancer-ratings">
                                    Ratings: {offerDetails.freelancer.ratings}
                                </span>
                                <span className="freelancer-projects">
                                    Total Projects: {offerDetails.freelancer.totalProjects}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Offer details not found.</p>
                )}

                <div className="freelancer-skills">
                    <h3>Skills</h3>
                    <div className="skill-badges">
                        {offerDetails && offerDetails.freelancer.skills && offerDetails.freelancer.skills.map((skill, index) => (
                            <span key={index} className="skill-badge">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="freelancer-description">
                    <h3>Description</h3>
                    <p>{offerDetails.description}</p>
                </div>

                <div className="freelancer-attachments">
                    <h3>Attachments</h3>
                    <ul>
                        {offerDetails.attachments && offerDetails.attachments.map((attachment, index) => (
                            <li key={index} className="attachment-item">
                                {attachment.fileName}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="button-container">
                    <button className="accept-btn" onClick={handleAcceptOffer}>
                        Accept Offer
                    </button>
                </div>
            </div>
        </>
    );
};

export default OfferDetails;
