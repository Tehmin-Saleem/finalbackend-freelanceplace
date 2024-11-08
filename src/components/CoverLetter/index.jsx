import React from 'react';
import './styles.scss';

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
  handleInputChange
}) => {
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

          {generatedCoverLetter ? (
            <pre className="generated-letter">{generatedCoverLetter}</pre>
          ) : (
            <p>No cover letter available</p>
          )}

          {generatedCoverLetter && (
            <div className="textarea-container">
              <label>Generated Cover Letter</label>
              <textarea
                rows="10"

                value={freelancerCoverLetter}
                // onChange={(e) => setFreelancerCoverLetter(e.target.value)}
                onChange={handleInputChange}
                // value={formdata.freelancerCoverLetter}
                
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
