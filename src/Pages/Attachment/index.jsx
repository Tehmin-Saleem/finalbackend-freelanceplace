import React, { useState, useEffect } from 'react';
import {ProgressBar , Header} from "../../components/index";
import './styles.scss';
import { useNavigate } from 'react-router-dom';

const Attachment = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [preview, setPreview] = useState(null);
  const steps = [
    { number: "1", label: "Job Title", color: "#4BCBEB" },
    { number: "2", label: "Description", color: "#4BCBEB" },
    { number: "3", label: "Preferred Skills", color: "#4BCBEB" },
    { number: "4", label: "Budget", color: "#4BCBEB" },
    { number: "5", label: "Project Duration", color: "#4BCBEB" },
    { number: "6", label: "Attachment", color: "#4BCBEB" },
  ];

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('jobAttachment')) || {};
    setDescription(storedData.description || "");
    setAttachment(storedData.attachment ? { name: storedData.attachment.fileName, base64: storedData.attachment.base64 } : null);
  }, []);

  const handleBackButtonClick = () => navigate('/ProjectDuration');

  const handleReviewButtonClick = () => {
    localStorage.setItem('jobAttachment', JSON.stringify({
      description,
      attachment: attachment ? { fileName: attachment.name, base64: attachment.base64 } : null
    }));
    navigate('/ProjectDetails');
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert("File size exceeds 100MB limit.");
        return;
      }
      
      setAttachment({ name: file.name });
      
      // Create a preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAttachment({ name: file.name, base64: base64String });
  
        localStorage.setItem('jobAttachment', JSON.stringify({
          description,
          attachment: { fileName: file.name, base64: base64String }
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
    <Header />
    <div className="attachment-container">
      
      <div className="content">
        <ProgressBar steps={steps} currentStep={6} />
        <div className="form-container">
          <div className="left-sideBox">
            <h4>6/6 Attachment</h4>
            <h1>Start the conversation.</h1>
            <p>Talent are looking for:</p>
            <ul>
              <li>Clear expectations about your task or deliverables</li>
              <li>The skills required for your work</li>
              <li>Good communication</li>
              <li>Details about how you or your team like to work</li>
            </ul>
            <button className="back-button" onClick={handleBackButtonClick}>Back</button>
          </div>
          <div className="right-side">
            <div className="form-group">
              <label>Describe what you need:</label>
              <textarea
                placeholder="Enter your project details"
                style={{ height: '150px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="attach-container">
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
              />
              <label htmlFor="fileInput" className="attach-button">
                <svg width="16" height="16" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                  <path d="M8.5 0a2.5 2.5 0 0 1 2.5 2.5V5H12a2.5 2.5 0 0 1 0 5h-1.5V12a2.5 2.5 0 0 1-5 0V10H2a2.5 2.5 0 0 1 0-5h1.5V2.5A2.5 2.5 0 0 1 8.5 0zm0 1A1.5 1.5 0 0 0 7 2.5V5H4.5a1.5 1.5 0 0 0 0 3h1.5v2.5a1.5 1.5 0 0 0 3 0V8h2.5a1.5 1.5 0 0 0 0-3H9V2.5A1.5 1.5 0 0 0 8.5 1z"/>
                </svg>
                Attach file
              </label>
              {attachment && (
                <div className="file-info">
                  <p>Attached file: {attachment.name}</p>
                  {preview && <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
                </div>
              )}
              <p>Max file size: 100 MB</p>
              <p>Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG</p>
            </div>
            <button className="review-button" onClick={handleReviewButtonClick}>Review job post</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Attachment;