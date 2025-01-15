import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";
import { Header, Spinner } from "../../components/index"; // Assuming these are already created.
import SendProjectDetails from "../ProjectDetailsForm";
import { InboxIcon } from '@heroicons/react/outline'; // Make sure to install @heroicons/react if not already installed

const ClientOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [activeOfferId, setActiveOfferId] = useState({});
  const [selectedConsultantId, setSelectedConsultantId] = useState({});
  const [selectedClientId, setSelectedClientId] = useState({});


  const [projectSent, setProjectSent] = useState({});

  const EmptyStateMessage = () => (
    <div className="mt-8 flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-lg">
      <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
        <InboxIcon className="w-8 h-8 text-sky-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        No Offers Available
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        {statusFilter === "all" 
          ? "You haven't sent any offers to consultants yet. When you send offers, they will appear here."
          : `No ${statusFilter} offers found. When consultants ${
              statusFilter === "pending" ? "respond to" : 
              statusFilter === "Accepted" ? "accept" : "decline"
            } your offers, they will appear here.`
        }
      </p>
      <div className="mt-6">
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 transition-colors duration-200"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("projectSent"));
    if (storedData) {
      setProjectSent(storedData);
    }
  }, []);

  const handleProjectSent = (offerId) => {
    const newProjectSent = { ...projectSent, [offerId]: true };
    setProjectSent(newProjectSent);
    localStorage.setItem("projectSent", JSON.stringify(newProjectSent));
  };

  // Function to get client ID from the JWT token stored in localStorage
  const getClientIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.userId;
      } catch (e) {
        console.error("Invalid token format", e);
      }
    }
    return null;
  };

  // Fetching offers when the component mounts or when the filter changes
  useEffect(() => {
    const fetchOffers = async () => {
      const clientId = getClientIdFromToken();
      if (!clientId) {
        setError("Client ID not found.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const statusQueryParam =
          statusFilter === "all" ? undefined : statusFilter;
          const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
        const response = await axios.get(
          `${BASE_URL}/api/client/consultantoffers/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              status: statusQueryParam,
            },
          }
        );

        // setActiveOfferId(response.data.id);
        // // Store consultant ID in the object using offer ID as key
        console.log("fetched offers for consultants", response.data.offers);
        // Log consultant IDs for debugging
        response.data.offers.forEach((offer) => {
          console.log("Consultant ID for offer:", {
            offerId: offer._id,
            consultantId: offer.consultant_id._id,
            consultantName: `${offer.consultant_id.first_name} ${offer.consultant_id.last_name}`,
            clientId: offer.client_id,
          });
        });

        const sortedOffers = [...response.data.offers].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        setOffers(sortedOffers);
        setFilteredOffers(sortedOffers);
      } catch (err) {
        setOffers([]); // Set empty array instead of error
        setFilteredOffers([]); // Set empty array instead of error
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [statusFilter]);

  const handleSendProjectDetails = (offer) => {
    if (!offer.consultant_id?._id || !offer.client_id) {
      console.error("Missing required IDs:", offer);
      return;
    }

    console.log("Sending project details:", {
      offerId: offer._id,
      consultantId: offer.consultant_id._id,
      consultantName: `${offer.consultant_id.first_name} ${offer.consultant_id.last_name}`,
      consultantEmail: offer.consultant_id.email,
      clientId: offer.client_id,
    });

    setActiveOfferId(offer._id);
    setSelectedConsultantId((prev) => ({
      ...prev,
      [offer._id]: offer.consultant_id._id,
    }));
    setSelectedClientId((prev) => ({
      ...prev,
      [offer._id]: offer.client_id,
    }));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Filtering offers based on selected filter
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOffers(offers);
      setError(""); // Clear error when status is 'all'
    } else {
      const filtered = offers.filter((offer) => offer.status === statusFilter);
      setFilteredOffers(filtered);

      // Check if the filtered offers are empty and set the error message
      if (filtered.length === 0) {
        setError("Offers are not found for this offer status.");
      } else {
        setError(""); // Clear error if offers are found
      }
    }
  }, [statusFilter, offers]);

  // Checking if there are any filtered offers
  const noOffersMessage =
    filteredOffers.length === 0 ? (
      <div className="text-center py-8 text-gray-600">
        {statusFilter === "pending" && "No Pending Offers"}
        {statusFilter === "Accepted" && "No Accepted Offers"}
        {statusFilter === "Declined" && "No Declined Offers"}
        {statusFilter === "all" && "No Offers Found"}
      </div>
    ) : null;

  if (loading) return <Spinner size={100} alignCenter />;
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }


  
  
  return (
    <>
      <Header />
      <div className="client-offers-page">
        <h1>All Offers You Sent</h1>


      

        <div className="status-filter-container mb-4 flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded ${statusFilter === "all" ? "bg-sky-400 text-white" : "bg-gray-200"}`}
            onClick={() => handleStatusFilterChange("all")}
          >
            All Offers
          </button>

          <button
            className={`px-4 py-2 rounded ${statusFilter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleStatusFilterChange("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === "Accepted" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleStatusFilterChange("Accepted")}
          >
            Accepted
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === "Declined" ? "bg-red-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleStatusFilterChange("Declined")}
          >
            Declined
          </button>
        </div>

        {filteredOffers.length === 0 ? (
          <EmptyStateMessage />
        ) : (

        <div className="offers-container">
          {filteredOffers.map((offer, index) => (
            <div className="offer-card" key={offer._id || index}>
              <div className="card-header">
                <h3>{offer?.project_name || "Untitled Project"}</h3>
                <span
                  className={`status ${offer?.status?.toLowerCase() || ""}`}
                >
                  {offer?.status || "Unknown"}
                </span>
              </div>

              <div className="card-content">
                <div className="consultant-info">
                  <h4>Consultant Information</h4>
                  <p>
                    <strong>Name:</strong>{" "}
                    {offer?.offer_details?.consultant?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {offer?.offer_details?.consultant?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {offer?.offer_details?.consultant?.skills || "N/A"}
                  </p>
                  <p>
                    <strong>Bio:</strong>{" "}
                    {offer?.offer_details?.consultant?.bio || "N/A"}
                  </p>
                  <p>
                    <strong>LinkedIn:</strong>{" "}
                    <a
                      href={offer?.offer_details?.consultant?.linkedIn || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {offer?.offer_details?.consultant?.linkedIn || "N/A"}
                    </a>
                  </p>
                </div>

                <div className="experience-education">
                  <div>
                    <h4>Experience</h4>
                    {offer?.offer_details?.consultant?.experience?.length >
                    0 ? (
                      <ul>
                        {offer.offer_details.consultant.experience
                          .filter(
                            (exp) => exp.title || exp.company || exp.years
                          ) // Ensure only valid data is shown
                          .map((exp, index) => (
                            <li key={index}>
                              <strong>
                                {exp.title || "No Title Provided"}
                              </strong>{" "}
                              at {exp.company || "No Company Provided"} (
                              {exp.years
                                ? `${exp.years} years`
                                : "No Years Provided"}
                              )
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p>No experience provided.</p>
                    )}
                  </div>
                  <div>
                    <h4>Education</h4>
                    {offer?.offer_details?.consultant?.education?.length > 0 ? (
                      <ul>
                        {offer.offer_details.consultant.education
                          .filter(
                            (edu) => edu.degree || edu.institution || edu.year
                          )
                          .map((edu, index) => (
                            <li key={index}>
                              <strong>
                                {edu.degree || "No Degree Provided"}
                              </strong>{" "}
                              from{" "}
                              {edu.institution || "No Institution Provided"} (
                              {edu.year
                                ? `${edu.year} years`
                                : "No Year Provided"}
                              )
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p>No education details provided.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="project-description">
                <h4>Project Details</h4>
                <p>{offer?.offer_details?.project?.description || "N/A"}</p>
              </div>

              {offer?.status === "Accepted" && (
                <div className="add-project-button">
                  <button
                    className={`btn-primary ${projectSent[offer._id] ? "bg-green-500 text-white" : ""}`} // Change color to green once the project is sent
                    // onClick={() => setActiveOfferId(offer.id)}
                    onClick={() => handleSendProjectDetails(offer)}
                  >
                    {projectSent[offer._id]
                      ? "Project Details Sent"
                      : "Send Project Details"}
                  </button>

                  {/* This success message will always appear after sending the project details */}
                  {projectSent[offer._id] && (
                    <div className="success-message mt-4">
                      <p>
                        Project details have been sent successfully for this
                        offer!
                      </p>
                    </div>
                  )}

                  {activeOfferId === offer._id && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="backdrop"
                        onClick={() => setActiveOfferId(null)}
                      ></div>

                      {/* Send Project Details Form */}
                      <SendProjectDetails
                        consultantId={selectedConsultantId[offer._id]}
                        clientId={selectedClientId[offer._id]}
                        onProjectSent={() => handleProjectSent(offer.id)} // Pass success handler with offer ID
                        onClose={() => {
                          setActiveOfferId(null);
                          setSelectedConsultantId(prev => {
                            const updated = { ...prev };
                            delete updated[offer._id];
                            return updated;
                          });
                          setSelectedClientId(prev => {
                            const updated = { ...prev };
                            delete updated[offer._id];
                            return updated;
                          });
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </>
   
  );

};

export default ClientOffersPage;
