import React, { useState, useEffect, useRef } from 'react';
import "./styles.scss";
import Spinner from "../chatcomponents/Spinner";

const CoverLetterComponent = ({
  handleClose,
  generateCoverLetter,
  handleSubmitCoverLetter,
  generatedCoverLetter,
  formData,
  freelancerCoverLetter,
  setFreelancerCoverLetter,
  additionalSkills,
  handleSkillsChange,
  handleInputChange,
  loading,
}) => {


  // Add refs and state for cursor management
  const textareaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null);

  // Handle textarea changes while maintaining cursor position
  const handleTextareaChange = (e) => {
    const textarea = e.target;
    const newValue = textarea.value;
    const newPosition = textarea.selectionStart;
    
    setFreelancerCoverLetter(newValue); // This will trigger both state updates
    setCursorPosition(newPosition);
  };

  // Update cursor position after state change
  React.useEffect(() => {
    if (cursorPosition !== null && textareaRef.current) {
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      textareaRef.current.focus(); // Add focus to maintain cursor visibility
    }
  }, [freelancerCoverLetter, cursorPosition]);



  return (
    <div className="cover-letter-overlay">
      <div className="cover-letter-container">
        <div className="cover-letter-header">
          <h2>Generate Cover Letter</h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>

        <div className="cover-letter-body">
          <label>Additional Skills (Optional)</label>
          <input
            type="text"
            placeholder="Add additional skills"
            value={additionalSkills}
            onChange={handleSkillsChange}
          />

          <button className="generate-button" onClick={generateCoverLetter}>
            Generate Cover Letter
          </button>

          {/* {generatedCoverLetter ? (
           
            <pre className="generated-letter">{generatedCoverLetter}</pre>
          ) : (
            <p>No cover letter available</p>
          )} */}

          {loading ? (
            // Show Spinner if loading is true
            <Spinner size={50} alignCenter />
          ) : generatedCoverLetter ? (
            // Show generated cover letter if available
            <pre className="generated-letter">{generatedCoverLetter}</pre>
          ) : (
            // Show fallback message if no cover letter is available
            <p>No cover letter available</p>
          )}

          {generatedCoverLetter && (
            <div className="textarea-container">
              <label>Generated Cover Letter</label>
              <textarea
              ref={textareaRef}
                rows="10"
                spellCheck="true"
                value={freelancerCoverLetter}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
                      e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    setCursorPosition(null);
                  }
                }}
                onClick={(e) => {
                  setCursorPosition(e.target.selectionStart);
                }}

                onChange={handleTextareaChange} // Add the onChange handler here
              
                // onChange={(e) => setFreelancerCoverLetter(e.target.value)}
                // onChange={handleInputChange}
                // value={formdata.freelancerCoverLetter}
                className="editable-cover-letter"
              />
            </div>
          )}
        </div>

        <div className="cover-letter-footer">
          <button className="close-button" onClick={handleClose}>
            Close
          </button>
          <button className="submit-button" onClick={handleSubmitCoverLetter}>
            Save and Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterComponent;
