import React, { useState, useEffect } from "react";
import "./styles.scss";
import { CommonButton } from "../../components/index";
import { Chat } from "../../svg/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-4 left-4 z-50 bg-white shadow-lg rounded-lg p-4 flex items-center justify-between min-w-[200px] max-w-md border border-gray-200">
    <span className="text-gray-800">{message}</span>
    <button
      onClick={onClose}
      className="ml-4 text-gray-500 hover:text-gray-700"
    >
      <X size={16} />
    </button>
  </div>
);

const ProposalCard = ({
  ProposalID,
  name,
  title,
  location,
  rate,
  earned,
  timeline,
  coverLetter,
  image,
  due_date,
  jobTitle,
  initialStatus,
  onHireSuccess
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null); // Initialize as null instead of initialStatus
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [freelancerData, setFreelancerData] = useState(null);

  // Fetch current proposal status when component mounts
  useEffect(() => {
    fetchProposalStatus();
  }, [ProposalID]);

  const fetchProposalStatus = async () => {
    if (!ProposalID) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `http://localhost:5000/api/client/hire/${ProposalID}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the status based on the response from the database
      if (response.data && response.data.status) {
        setStatus(response.data.status);
      } else {
        // If no status is returned, set it to the default status
        setStatus('pending');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch current status';
      console.error('Error fetching proposal status:', error);
      console.error('Error details:', error.response?.data);
      setError(errorMessage);
      showNotification(errorMessage);
      // Set a default status in case of error
      setStatus('pending');
    }
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleHireClick = async (e) => {
    e.stopPropagation();
    
    if (!ProposalID) {
      setError('Invalid proposal ID');
      console.error('ProposalID is undefined');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/client/hire/${ProposalID}`,
        { status: 'hired' }, // Send the status in the request body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        onHireSuccess?.(ProposalID);
        setStatus('hired');
        showNotification('Freelancer hired successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to hire freelancer. Please try again.';
      setError(errorMessage);
      console.error('Error hiring freelancer:', error);
      showNotification(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = async () => {
    if (!ProposalID) {
      console.error('Invalid proposal ID for chat');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/client/proposal/${ProposalID}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setFreelancerData(response.data);
        navigate("/chat", { 
          state: { 
            proposalId: ProposalID,
            freelancerData: response.data 
          }
        });
      } else {
        showNotification("Failed to load chat. Please try again.");
      }
    } catch (error) {
      console.error('Failed to fetch freelancer details:', error);
      showNotification("Failed to load chat. Please try again.");
    }
  };

  // Show loading state while initial status is being fetched
  if (status === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="proposal-card relative">
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
        />
      )}
      
      <img src={image} alt={`${name}'s profile`} className="proposal-card__image" />
      <div className="proposal-card__content">
        <div className="proposal-card__header">
          <span className="proposal-card__name">{name}</span>
          <span className="proposal-card__status">{status}</span>
        </div>
        <p className="proposal-card__title">{title}</p>
        <p className="proposal-card__due_date">{due_date}</p>
        <p className="proposal-card__location">{location}</p>
        <div className="proposal-card__details">
          <span className="proposal-card__rate">{rate}</span>
          <span className="proposal-card__earned">{earned}</span>
        </div>
        <div className="proposal-card__extra">
          <span className="proposal-card__timeline-head">Estimated timeline:</span>
          <span className="proposal-card__timeline">{timeline}</span>
        </div>
        <div>
          <span className="proposal-card__job-title-head">Job Title: </span>
          <span className="proposal-card__job-title">{jobTitle}</span>
        </div>
        <div>
          <span className="proposal-card__cover-letter-head">Cover Letter</span>
          <p className="proposal-card__cover-letter">{coverLetter}</p>
        </div>
        <div className="proposal-card__actions">
          <CommonButton
            text={<Chat />}
            className="bg-[#FFFFFF] border border-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-1 px-6 w-full focus:outline-none focus:shadow-outline"
            onClick={handleChatClick}
            disabled={isLoading}
          />
          {status !== 'hired' ? (
            <CommonButton
              text={isLoading ? "Hiring..." : "Hire"}
              className="bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline disabled:opacity-50"
              onClick={handleHireClick}
              disabled={isLoading}
            />
          ) : (
            <CommonButton
              text="Hired"
              className="bg-gray-400 text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full cursor-not-allowed"
              disabled={true}
            />
          )}
        </div>
        {error && (
          <div className="text-red-500 mt-2 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;