import React, { useState } from "react";
import "./styles.scss";

const SendProjectDetails= () => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    deadline: "",
    githubUrl: "",
    additionalNotes: "",
    ndaAgreement: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data (e.g., via API)
    console.log("Form Submitted:", formData);
    alert("Offer sent successfully!");
    setFormData({
      projectTitle: "",
      projectDescription: "",
      deadline: "",
      githubUrl: "",
      additionalNotes: "",
      ndaAgreement: false,
    });
  };

  return (
    <div className="send-offer-form-container">
      <h1>Send Project Details</h1>
      <form className="send-offer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectTitle">Project Title</label>
          <input
            type="text"
            id="projectTitle"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            placeholder="Enter project title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectDescription">Project Description</label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            placeholder="Provide a brief description of the project"
            rows="4"
            required
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

        <div className="form-group">
          <label htmlFor="githubUrl">Confidential Link (GitHub, Figma, etc.)</label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="Enter URL (e.g., GitHub)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalNotes">Additional Notes</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Provide any additional instructions or information"
            rows="3"
          ></textarea>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="ndaAgreement"
            name="ndaAgreement"
            checked={formData.ndaAgreement}
            onChange={handleChange}
            required
          />
          <label htmlFor="ndaAgreement">
            I agree to share this information under confidentiality (NDA).
          </label>
        </div>

        <button type="submit" className="submit-button">
          Send 
        </button>
      </form>
    </div>
  );
};

export default SendProjectDetails;
