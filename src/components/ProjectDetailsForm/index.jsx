import React, { useState } from "react";
import axios from "axios";
import "./styles.scss";

const SendProjectDetails = ({ consultantId, onProjectSent, onClose }) => {
  const [formData, setFormData] = useState({
    githubUrl: "",
    additionalNotes: "",
    confidentialityAgreement: false,
  });

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

      const response = await axios.post(
        `http://localhost:5000/api/consultantOffers/sendProjectDetails/${consultantId}`,
        {
          githubUrl: formData.githubUrl,
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
      console.log("Consultant ID in API Call:", consultantId);

      

      console.log("Project details sent successfully:", response.data);
      alert("Project details sent successfully!");

      // Change the button to show that the details are sent
      setIsSent(true);

      // Clear the form data after successful submission
      setFormData({
        githubUrl: "",
        additionalNotes: "",
        confidentialityAgreement: false,
      });

      // Trigger callback after successful submission
      if (onProjectSent) onProjectSent();
    } catch (error) {
      console.error("Error sending project details:", error);
      alert("Failed to send project details. Please try again.");
    }
  };

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
