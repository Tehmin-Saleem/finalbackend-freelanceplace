import React, { useState } from "react";
import styles from "./style.module.scss";
// import SearchIcon from "../../svg components/SearchIcon";
// import CrossIcon from "../../svg components/CrossIcon";
// import PlusIcon from "../../svg components/PlusIcon";
// import HourlyRate from "../../svg components/HourlyRate";
// import FixedRate from "../../svg components/FixedRate";
import {
  SearchIcon,
  CrossIcon,
  PlusIcon,
  HourlyRate,
  FixedRate,
} from "../../svg components/index";

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
      {/* <h2 className={styles.h2}>Send an offer</h2> */}
      <div className={styles.container}>
        {/* <h2 className={styles.h2}>Send an offer</h2> */}
        <div className={styles.left}>
          <h2 className={styles.h2}>Send an offer</h2>
          <div className={styles.field}>
            <label>Enter job tittle:</label>
            <div className={styles.roundedInput}>
              <input type="text" placeholder="UI/UX Designer" />
            </div>
          </div>
          <div className={styles.field}>
            <label>Description:</label>

            <div className={styles.textArea}>
              <textarea placeholder="Enter about your project details"></textarea>
            </div>
          </div>
          <div className={styles.field}>
            <label>Search skills or add you own:</label>
            <div className={styles.inputWithIcon}>
              <input type="text" />
              <span>
                <SearchIcon className={styles.searchIcon} />
              </span>
            </div>
          </div>
          <h3 className={styles.field}>Selected skills</h3>
          <div className={styles.skill}>
            {selectedSkills.map((skill) => (
              <button
                key={skill}
                className={styles.skillButton}
                onClick={() => handleSkillRemove(skill)}
              >
                {skill}{" "}
                <span>
                  <CrossIcon />
                </span>
              </button>
            ))}
          </div>
          <h3 className={styles.field}>Popular skills for UI/UX Design</h3>
          <div className={styles.skills}>
            {popularSkills.map((skill) => (
              <button
                key={skill}
                className={styles.skillButton}
                onClick={() => handleSkillAdd(skill)}
              >
                {skill}{" "}
                <span>
                  <PlusIcon />
                </span>
              </button>
            ))}
          </div>

          <div className={styles.options}>
            <div
              className={`${styles.option} ${
                selectedOption === "option1" ? styles.selected : ""
              }`}
              onClick={() => handleOptionChange("option1")}
            >
              <input type="radio" name="options" className={styles.Radio} />
              <span className={styles.optionText}>
                <HourlyRate />
                HourlyRate
              </span>
            </div>
            <div
              className={`${styles.option} ${
                selectedOption === "option2" ? styles.selected : ""
              }`}
              onClick={() => handleOptionChange("option2")}
            >
              <input type="radio" name="options" className={styles.Radio} />
              <span className={styles.optionText}>
                <FixedRate />
                FixedRate
              </span>
            </div>
          </div>
          <div className={styles.field}>
            <div>
              <label>Describe what you need:</label>
              <textarea className={styles.textArea}></textarea>
            </div>
          </div>
          <div className={styles.field}>
            <button className={styles.attachButton}>
              <span className={styles.icon}>📎</span>
              ATTACH
              <input type="file" onChange={handleFileAttach} />
            </button>
            {attachedFile && (
              <div className={styles.attachedFile}>
                <span>{attachedFile.name}</span>
                <button onClick={handleFileRemove}>
                  <span className={styles.icon}>✖</span>
                </button>
              </div>
            )}
          </div>
          <div className={styles.field}>
            <button className={styles.buttonWithIcon}>
              <span className={styles.icon}>📤</span>
              SEND OFFER
            </button>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.userProfile}>
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
    </>
  );
};

export default OfferForm;
