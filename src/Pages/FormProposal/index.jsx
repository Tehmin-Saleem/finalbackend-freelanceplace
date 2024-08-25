import React, { useState } from "react";
import {Header} from "../../components/index"; // Import the Header component
import "./styles.scss"; // Correctly import the SCSS file
import {
  SearchIcon,
  CrossIcon,
  PlusIcon,
  HourlyRate,
  FixedRate,
} from "../../svg/index";

const OfferForm = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [popularSkills, setPopularSkills] = useState([
    "HTML",
    "CSS",
    "JavaScript",
    "React",
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  const handleSkillAdd = (skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setPopularSkills(popularSkills.filter((item) => item !== skill));
  };

  const handleSkillRemove = (skill) => {
    setPopularSkills([...popularSkills, skill]);
    setSelectedSkills(selectedSkills.filter((item) => item !== skill));
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleFileAttach = (event) => {
    setAttachedFile(event.target.files[0]);
  };

  const handleFileRemove = () => {
    setAttachedFile(null);
  };

  return (
    <>
      <Header />
      <h2 className="offerTitle">Send an offer</h2>
      
      <div className="outerContainer">
        <div className="container">
          <div className="left">
           
              <div className="field">
             <label>Enter job title:</label>
             <div className="inputWrapper">
              <input type="text" placeholder="UI/UX Designer" className="roundedInput" />
              </div>
              </div>

            <div className="field">
              <label>Description:</label>
              <div className="inputWrapper">
                <textarea placeholder="Enter about your project details" className="textArea"></textarea>
                </div>
            </div>

            <div className="field">
              <label>Search skills or add your own:</label>

              <div >
                <input type="text" className="inputWithIcon"  />
                <span>
                  <SearchIcon className="searchIcon" />
                </span>
              </div>
            </div>

            <h3 className="field">Selected skills</h3>
            <div className="skill">
              {selectedSkills.map((skill) => (
                <button
                  key={skill}
                  className="skillButton"
                  onClick={() => handleSkillRemove(skill)}
                >
                  {skill}{" "}
                  <span>
                    <CrossIcon />
                  </span>
                </button>
              ))}
            </div>

            <h3 className="field">Popular skills for UI/UX Design</h3>
            <div className="skills">
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  className="skillButton"
                  onClick={() => handleSkillAdd(skill)}
                >
                  {skill}{" "}
                  <span>
                    <PlusIcon />
                  </span>
                </button>
              ))}
            </div>

            <div className="options">
              <div
                className={`option ${
                  selectedOption === "option1" ? "selected" : ""
                }`}
                onClick={() => handleOptionChange("option1")}
              >
                <input type="radio" name="options" className="Radio" />
                <span className="optionText">
                  <HourlyRate />
                  Hourly Rate
                </span>
              </div>
              <div
                className={`option ${
                  selectedOption === "option2" ? "selected" : ""
                }`}
                onClick={() => handleOptionChange("option2")}
              >
                <input type="radio" name="options" className="Radio" />
                <span className="optionText">
                  <FixedRate />
                  Fixed Rate
                </span>
              </div>
            </div>

            <div className="field">
              <label>Describe what you need:</label>
              <div>
              <textarea className="textArea"></textarea>
            </div>
            </div>

            <div className="field">
              <button className="attachButton">
                <span className="icon">📎</span>
                ATTACH
                <input type="file" onChange={handleFileAttach} />
              </button>
              {attachedFile && (
                <div className="attachedFile">
                  <span>{attachedFile.name}</span>
                  <button onClick={handleFileRemove}>
                    <span className="icon">✖</span>
                  </button>
                </div>
              )}
            </div>

            <div className="field">
              <button className="buttonWithIcon">
                <span className="icon">📤</span>
                SEND OFFER
              </button>
            </div>
          </div>
          
          <div className="right">
            <div className="userProfile">
              <h3>User Profile</h3>
              <p>Name: John Doe</p>
              <p>Location: New York, USA</p>
              <p>Success Rate: 90%</p>
              <p>Top Rated: ⭐️⭐️⭐️⭐️⭐️</p>
              <p>Experience: 10 years</p>
              <p>Total Jobs: 187</p>
              <p>Total Hours: 156</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferForm;
