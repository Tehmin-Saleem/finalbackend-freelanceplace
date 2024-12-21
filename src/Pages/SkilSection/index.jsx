import React, { useState } from "react";
import "./styles.scss"; // Import your SCSS file here
import { ProgressBar, Header } from "../../components/index"; // Import your ProgressBar component
import { CrossIcon, PlusIcon } from "../../svg/index.js"; // Dummy SVG icons, replace with your own SVGs
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.7428 10.1254H11.2284L10.9872 9.88367C11.6571 9.00653 12.0007 7.87679 12.0007 6.65882C12.0007 2.97597 9.02403 0 5.34118 0C1.65833 0 -1.31727 2.97597 -1.31727 6.65882C-1.31727 10.3417 1.65833 13.3173 5.34118 13.3173C6.70964 13.3173 7.98657 12.8944 9.08524 12.1272L9.32812 12.3692V12.8837L10.7886 14.3442L12.2189 12.9139L11.7428 10.1254ZM5.34118 10.1254C3.62413 10.1254 2.1254 8.62671 2.1254 6.65882C2.1254 4.69093 3.62413 3.1922 5.34118 3.1922C7.05823 3.1922 8.55696 4.69093 8.55696 6.65882C8.55696 8.62671 7.05823 10.1254 5.34118 10.1254Z"
      fill="#6B6B6B"
    />
  </svg>
);

const SkillManagement = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([
    "HTML", "CSS", "JavaScript", "React", "Figma", "Mobile App Design", "Prototyping", "Mockups"
  ]);
  const [filteredSkills, setFilteredSkills] = useState([...availableSkills]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
      // Remove the added skill from available skills and filtered skills
      setAvailableSkills(availableSkills.filter((s) => s !== skill));
      setFilteredSkills(filteredSkills.filter((s) => s !== skill));
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
    setAvailableSkills([...availableSkills, skill]);
    setFilteredSkills([...filteredSkills, skill]);
  };

  const handleBudgetButtonClick = () => {
    localStorage.setItem('preferredSkills', JSON.stringify(skills));
    navigate('/Budget');
  };

  const handleBackButtonClick = () => {
    navigate('/JobDescription'); // Replace with your target route
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter available skills based on search input
    const filtered = availableSkills.filter((skill) =>
      skill.toLowerCase().includes(value)
    );

    // If the input is not empty, include previously selected skills
    if (value) {
      setFilteredSkills([...filtered, ...skills]);
    } else {
      setFilteredSkills(availableSkills);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      handleAddSkill(searchTerm.trim());
      setSearchTerm(""); // Clear the search input
    }
  };

  const steps = [
    { number: "1", label: "Job Title", color: "#4BCBEB" },
    { number: "2", label: "Description", color: "#4BCBEB" },
    { number: "3", label: "Preferred Skills", color: "#6b7280" },
    { number: "4", label: "Budget", color: "#6b7280" },
    { number: "5", label: "Project Duration", color: "#6b7280" },
    { number: "6", label: "Attachment", color: "#6b7280" },
  ];

  return (
    <>
    <Header />
    <div className="skill-management">
      

      <div className="progress-container">
        <ProgressBar steps={steps} currentStep={2} />
      </div>

      <div className="precontainer">
        <div className="left-section">
          <h2>3/6 Preferred Skills</h2>
          <div className="info">
            <h3>
              Please consider adding
              <br />
              the "valuable skills" filter
              <br /> to your project
            </h3>
            <p className="para">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
              explicabo earum ratione provident commodi quidem, voluptate quia
              voluptatem eveniet voluptas itaque nam! Consequatur totam
              voluptates similique quaerat porro a vero.
            </p>
          </div>
          <button className="back-button" onClick={handleBackButtonClick}>
            Back
          </button>
        </div>

        <div className="right-section">
          <label htmlFor="search">Search skills or add your own</label>
          <div className="search-bar">
            <input
              id="search"
              type="text"
              placeholder="Search skills or add your own"
              value={searchTerm}
              onChange={handleSearchChange} // Search handler
              onKeyDown={handleKeyDown} // Handle Enter key
            />
            <SearchIcon />
          </div>

          <div className="skills-section">
            <h3>Selected Skills</h3>
            <div className="skills-list">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleRemoveSkill(skill)}
                  className="skill-button"
                >
                  {skill}
                  <CrossIcon />
                </button>
              ))}
            </div>
          </div>

          <div className="skills-section">
            <h3>Popular Skills for UI/UX Design</h3>
            <div className="skills-list">
              {filteredSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleAddSkill(skill)}
                  className="skill-button"
                >
                  {skill}
                  <PlusIcon />
                </button>
              ))}
            </div>
          </div>

          <button className="next-button" onClick={handleBudgetButtonClick}>
            Next: Budget
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default SkillManagement;
