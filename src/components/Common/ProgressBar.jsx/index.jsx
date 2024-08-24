import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const ProgressBar = ({ steps, currentStep }) => {
  if (!steps || steps.length === 0) {
    return null; // Render nothing if no steps are provided
  }

  return (
    <div className="progress-bar">
      <div className="progress-bar__title">Jobs &gt; Post a Job</div>
      <div className="progress-bar__steps">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`progress-bar__step ${currentStep > index ? 'completed' : ''} ${currentStep === index ? 'active' : ''}`}
            >
              <div
                className={`progress-bar__circle ${currentStep >= index ? 'completed' : ''}`}
              >
                {step.number}
              </div>
              <div className={`progress-bar__label ${currentStep >= index ? 'completed' : ''}`}>
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`progress-bar__line ${currentStep > index ? 'completed' : ''}`}
                style={{ backgroundColor: currentStep > index ? step.color : '#e2e8f0' }} // Dynamic bar color
              ></div>
            )}
           </React.Fragment> 
        ))}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired, // Color for the completed step
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default ProgressBar;
