import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.scss';
import Header from '../../Commoncomponents/Header';
import { useLocation } from 'react-router-dom';

const ProjectDetailsModal = () => {
  const location = useLocation();
  const { offerId } = location.state || {}; // Retrieve offerId from state
  const [projectDetails, setProjectDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setError(null); // Clear any error when closing
    setProjectDetails(null); // Clear project details when closing
  };

  // Fetch project details when modal is opened
  const openModal = async () => {
    console.log('Offer ID is getting!',offerId);
    if (!offerId) {
      console.log('Offer ID is missing!');
      setError('Offer ID is missing. Please provide a valid offer ID.');
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve the token
    if (!token) {
      setError('You are not authorized. Please log in first.');
      return;
    }

    setShowModal(true);
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/client/project-details/${offerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
console.log("oferrrr id",offerId);
      console.log('Response data:', response.data);
      setProjectDetails(response.data); // Assuming response.data contains project details
    } catch (err) {
      console.error('Error fetching project details:', err.response || err);
      setError(
        err.response?.data?.message || 'Failed to load project details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      {/* Confidentiality Instruction */}
      <div className="confidentiality-instruction">
        <p>
          <strong>Note:</strong> By clicking on "See Project Details," you agree
          to keep all project information confidential. Sharing or misuse of
          this information is strictly prohibited.
        </p>
      </div>

      {/* Button to Open Modal */}
      <button className="see-details-btn" onClick={openModal}>
        See Project Details
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>
            <h2 className="modal-title">Project Details</h2>

            {/* Loading State */}
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {/* Project Details */}
            {projectDetails && !loading && !error && (
              <div className="modal-content">
                <p>
                  <strong>Project Name:</strong> {projectDetails.projectName}
                </p>
                <p>
                  <strong>Description:</strong> {projectDetails.description}
                </p>
                <p>
                  <strong>Budget:</strong> {projectDetails.budget}
                </p>
                <p>
                  <strong>Deadline:</strong>{' '}
                  {new Date(projectDetails.deadline).toLocaleDateString()}
                </p>
                <p>
                  <strong>GitHub URL:</strong>{' '}
                  <a
                    href={projectDetails.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </p>
                <p>
                  <strong>Additional Notes:</strong>{' '}
                  {projectDetails.additionalNotes || 'N/A'}
                </p>
              </div>
            )}

            {/* Remarks Section */}
            <div className="remarks-section">
              <label htmlFor="remarks">Add Your Remarks:</label>
              <textarea
                id="remarks"
                placeholder="Write your remarks here..."
                rows="4"
              ></textarea>
              <button className="add-remarks-btn">Submit Remarks</button>
            </div>

            {/* Guidelines */}
            <div className="guidelines">
              <p>If you have any queries:</p>
              <ul>
                <li>
                  Contact via{' '}
                  <a href="mailto:client@example.com">Email</a>
                </li>
                <li>Chat using the icon below</li>
                <li>Schedule a meeting at your convenience</li>
              </ul>
            </div>

            {/* Chat Icon */}
            <div className="chat-icon">
              <a href="#chat" title="Chat with Client">
                💬 Chat
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetailsModal;
