import React, { useState } from "react";

import Header from "../../components/Commoncomponents/Header";
import "./styles.scss";
// import PlusIcon from "../../svg/Sammar's-SVG-Components/PlusIcon";

const SubmitProposal = () => {

    const PlusIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="10" fill="#00BFFF"/>
  <line x1="12" y1="8" x2="12" y2="16" stroke="white" stroke-width="2"/>
  <line x1="8" y1="12" x2="16" y2="12" stroke="white" stroke-width="2"/>
</svg>
    );
  const CalendarIcon = () => (
    <svg
      className="calendar-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const FileIcon = () => (
    <svg
      className="file-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  const [milestones, setMilestones] = useState([
    { description: "", dueDate: "", amount: "" },
  ]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { description: "", dueDate: "", amount: "" },
    ]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  return (
    <>
      <Header />
      
      <div className="submit-proposal">
        <h1>Submit a Proposal</h1>
        <div className="outerContainer">
        <div className="horizontal-container">
          <div className="left-section">
            <div className="job-details">
              <h2>Job Details</h2>
              <h3>Graphic Designer for Cricket Tech Brand</h3>
              <p>Lahore, Punjab Pakistan.</p>
              <div className="job-info">
                <span>
                  <strong>Hourly:</strong> $12/hr
                </span>
                <span>
                  <strong>Estimated time:</strong> 1 to 3 months
                </span>
                <span>
                  <strong>Level:</strong> Expert
                </span>
              </div>
              <h3 className="projectoverview">Project Overview</h3>
              <p>
                I'm looking to create memorable and user-centric digital
                experiences? Your search ends here! I am a highly skilled and
                innovative UX UI designer, Graphic designer, and WordPress
                designer from Bangladesh, ready to revolutionize your projects.
                With a deep passion for creating outstanding user experiences
                and effective visuals, I guarantee top-notch results that will
                leave a lasting impression.
              </p>
              <h3>Skills and Expertise</h3>
              <div className="skills">
                <span>Mobile app design</span>
                <span>Wireframe</span>
                <span>Mockup</span>
                <span>Prototyping</span>
                <span>Figma</span>
                <span>User flow</span>
                <span>+10</span>
              </div>
            </div>
          </div>
          <div className="right-section">
            <div className="add-requirements">
              <h2>Add Requirements</h2>
              <label className="Label">Select how do you want to be paid:</label>
              <div className="payment-options">
                <div className="option">
                  <label htmlFor="milestone">By milestones</label>
                  <input type="radio" id="milestone" name="payment" />
                </div>
                <div className="option">
                  <label htmlFor="project">By project</label>
                  <input type="radio" id="project" name="payment" />
                </div>
              </div>
              <label className="Label">
    How many milestones do you want to include?
    <span className="add-milestone-span" onClick={addMilestone}>
         Add milestones <PlusIcon />
    </span>
</label>
              
              {milestones.map((milestone, index) => (
  <div key={index} className="milestone">
    <div className="milestone-row">
      <div className="milestone-field">
        <label>{index + 1}. Milestone Description:</label>
        <input
          type="text"
          placeholder="Lorem ipsum"
          value={milestone.description}
          onChange={(e) =>
            handleMilestoneChange(index, "description", e.target.value)
          }
        />
      </div>
      <div className="milestone-field">
        <label>Due date:</label>
        <div className="date-input">
          <CalendarIcon className="calendar-icon" />
          <input
            type="text"
            placeholder="12-May-2024"
            value={milestone.dueDate}
            onChange={(e) =>
              handleMilestoneChange(index, "dueDate", e.target.value)
            }
          />
        </div>
      </div>
      <div className="milestone-field">
        <label>Amount:</label>
        <input
          type="text"
          placeholder="$12,00 per milestone"
          value={milestone.amount}
          onChange={(e) =>
            handleMilestoneChange(index, "amount", e.target.value)
          }
        />
      </div>
    </div>
  </div>
))}

              
              <label className="Label">How long will this project take?</label>
              <input
                type="text"
                placeholder="2 months"
                className="project-duration"
              />
              <label className="Label">Cover letter</label>
              <textarea placeholder="Lorem ipsum dolor sit amet consectetur..."></textarea>
              <label className="Label">Attachment</label>
              <div className="attachment-box">
                <div className="attachment">
                  <FileIcon />
                  <span>Attach file</span>
                </div>
              </div>
              <label className="Label">Add portfolio link</label>
              <input
                type="text"
                placeholder="Lorem ipsum"
                className="portfolio-link"
              />
              <div className="actions">
                <button className="cancel">Cancel</button>
                <button className="submit">Send proposal</button>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
     
    </>
  );
};

export default SubmitProposal;
