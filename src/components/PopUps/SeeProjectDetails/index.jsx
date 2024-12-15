import React, { useState } from 'react';
import './styles.scss';

const ProjectDetailsModal = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      {/* The Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            {/* Close Button */}
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>
            <h2 className="modal-title">Project Details</h2>

            {/* Project Information */}
            <div className="modal-content">
              <p><strong>Project Name:</strong> Sample Project</p>
              <p><strong>Description:</strong> A detailed project description goes here.</p>
              <p><strong>Deadline:</strong> December 30, 2024</p>
              <p><strong>Budget:</strong> $5000</p>
              <p>
                <strong>GitHub URL:</strong>{' '}
                <a href="https://github.com/example" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </p>
              <p><strong>Additional Notes:</strong> Add your additional notes here.</p>
            </div>

            {/* Remarks Section */}
            <div className="remarks-section">
              <label htmlFor="remarks">Add Your Remarks:</label>
              <textarea id="remarks" placeholder="Write your remarks here..." rows="4"></textarea>
              <button className="add-remarks-btn">Submit Remarks</button>
            </div>

            {/* Guidelines */}
            <div className="guidelines">
              <p>If you have any queries:</p>
              <ul>
                <li>Contact via <a href="mailto:client@example.com">Email</a></li>
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

      {/* Integrate this into your existing button */}
      <button className="see-details-btn" onClick={openModal}>
        See Project Details
      </button>
    </>
  );
};

export default ProjectDetailsModal;
