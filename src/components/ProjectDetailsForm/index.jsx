import React, { useState } from "react";
import axios from "axios";
import "./styles.scss";

const SendProjectDetails = ({ consultantId, onProjectSent, onClose, clientId }) => {
  const [formData, setFormData] = useState({
    githubUrl: "",
    clientId,
    deadline:"",
    additionalNotes: "",
    confidentialityAgreement: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSent, setIsSent] = useState(false); // Track if the project details were sent

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      console.log('Sending project details with:', {
        consultantId,
        deadline,
        clientId: clientId,
        githubUrl: formData.githubUrl,
        additionalNotes: formData.additionalNotes,
        confidentialityAgreement: formData.confidentialityAgreement
      });
      console.log("Sending deadline:", formData.deadline);
      const response = await axios.post(
        `http://localhost:5000/api/client/sendProjectDetails/${consultantId}`,
        {
          githubUrl: formData.githubUrl,
          deadline: formData.deadline,
          clientId,
          additionalNotes: formData.additionalNotes,
          confidentialityAgreement: formData.confidentialityAgreement,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Project details sent successfully:", response.data);
      onProjectSent();
      alert("Project details sent successfully!");

      setIsSent(true);
      setFormData({
        githubUrl: "",
        clientId: clientId,
        additionalNotes: "",
        confidentialityAgreement: false,
        deadline: "",
      });

      // Close the modal
      setIsModalOpen(false);
      // if (onProjectSent) onProjectSent(); 

      
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response ? error.response.data : 'No response',
        config: error.config
      });
      console.log("Failed to send project details. Please check the console for details.");
    }
  };

  if (!isModalOpen) {
    return null; // Return null if the modal is not open
  }


  return (
    <div className="send-offer-overlay">
      <div className="send-offer-form-details">
        {/* Close button */}
        <button className="close-popup-button" onClick={onClose}>
          ✖
        </button>

        <h1>Send Additional Details</h1>
        <form className="send-offer-form" onSubmit={handleSubmit}>
          {/* URL Field */}
          <div className="form-group">
            <label htmlFor="githubUrl">Confidential Link</label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="Enter a confidential link (e.g., GitHub, Figma, etc.)"
              required
            />
          </div>

          {/* Additional Notes Field */}
          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Provide any additional instructions or notes"
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
          {/* Confidentiality Agreement Checkbox */}
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="confidentialityAgreement"
              name="confidentialityAgreement"
              checked={formData.confidentialityAgreement}
              onChange={handleChange}
              required
            />
            <label htmlFor="confidentialityAgreement">
              I agree to keep this information confidential.
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            {isSent ? "Sent" : "Send Details"} {/* Change button text after submission */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendProjectDetails;