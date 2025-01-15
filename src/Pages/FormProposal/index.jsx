import React, { useState } from "react";
import { Header } from "../../components/index";
import "./styles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  SearchIcon,
  CrossIcon,
  PlusIcon,
  HourlyRate,
  FixedRate,
} from "../../svg/index";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OfferForm = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [timelineDuration, setTimelineDuration] = useState("");
  const [timelineUnit, setTimelineUnit] = useState("days"); // default to days
  const [fileError, setFileError] = useState(""); // New state for file error

  const [popularSkills, setPopularSkills] = useState([
    "HTML",
    "CSS",
    "JavaScript",
    "React",
  ]);

  const [filteredSkills, setFilteredSkills] = useState(popularSkills);
  const [inputValue, setInputValue] = useState('');

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filtered = popularSkills.filter((skill) =>
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(popularSkills);
    }
  };

  // Handle adding new skills
  const handleSkillAdd = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Handle removing selected skills
  const handleSkillRemove = (skill) => {
    const updatedSkills = selectedSkills.filter((selectedSkill) => selectedSkill !== skill);
    setSelectedSkills(updatedSkills);
  };

  // Handle adding skills via input
  const handleAddCustomSkill = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      if (!selectedSkills.includes(inputValue)) {
        setSelectedSkills([...selectedSkills, inputValue]);
      }
      setInputValue('');
      setFilteredSkills(popularSkills); // Reset popular skills after adding custom skill
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { freelancerProfile } = location.state || {};
  const [attachedFile, setAttachedFile] = useState(null);
  const [budgetType, setBudgetType] = useState("");
  const [hourlyRate, setHourlyRate] = useState({ min: "", max: "" });
  const [fixedPrice, setFixedPrice] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileAttach = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Only PDF, JPG, and JPEG files are allowed. Please upload a valid file.");
        setAttachedFile(null);
      } else {
        setFileError(""); // Clear error if the file is valid
        setAttachedFile(file);
      }
    }
  };
  

  const handleFileRemove = () => {
    setAttachedFile(null);
  };

  const handleBudgetTypeChange = (type) => {
    setBudgetType(type);
    if (type === "fixed") {
      setHourlyRate({ min: "", max: "" });
    } else {
      setFixedPrice("");
    }
  };

  const validateForm = () => {
    if (!jobTitle || !description || !budgetType ||!dueDate ||!timelineDuration|| !timelineUnit) {
      setError("Please fill in all required fields");
      return false;
    }
    if (!timelineDuration || parseFloat(timelineDuration) <= 0) {
      setError("Please provide a valid timeline duration");
      return false;
    }
    if (budgetType === 'hourly' && (!hourlyRate.min || !hourlyRate.max)) {
      setError("Please provide both minimum and maximum hourly rates");
      return false;
    }
    if (budgetType === 'fixed' && !fixedPrice) {
      setError("Please provide a fixed price");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    console.log('Submitting form with values:', {
      budgetType,
      hourlyRate,
      fixedPrice,
      description,
      detailedDescription,
      freelancerProfile,
      jobTitle,
      selectedSkills
    });
    const formData = new FormData();
    formData.append('budget_type', budgetType);
    if (budgetType === 'hourly') {
      console.log('Setting hourly rates:', hourlyRate);
      // Send hourly rates in the correct format for the new schema
      formData.append('hourly_rate_from', hourlyRate.min);
      formData.append('hourly_rate_to', hourlyRate.max);
    } else {
      console.log('Setting fixed price:', fixedPrice);
      formData.append('fixed_price', fixedPrice);
    }

    formData.append('due_date', dueDate);
    formData.append('estimated_timeline_duration', timelineDuration);
    formData.append('estimated_timeline_unit', timelineUnit);

    formData.append('description', description);
    formData.append('detailed_description', detailedDescription);
    formData.append('freelancer_id', freelancerProfile.freelancer_id);
    formData.append('job_title', jobTitle);
    formData.append('preferred_skills', JSON.stringify(selectedSkills));
    formData.append('status', 'pending');

    if (attachedFile) {
      formData.append('attachment', attachedFile);
    }

    try {
      console.log('Calling toast.success');
      toast.success('Offer sent successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Log the FormData entries for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
      const response = await axios.post(`${BASE_URL}/api/client/offerform`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log('Offer created successfully:', response.data);
      const offerId = response.data._id || response.data.offerId;
      console.log('Generated offer ID:', offerId);

      navigate('/clientDashboard');
    } catch (error) {
      console.error('Error creating offer:', error);
      setError(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <h2 className="offerTitle">Send an offer</h2>
      <div className="outerContainer">
        <div className="container">
          <div className="left">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Enter job title:</label>
                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder="UI/UX Designer..."
                    className="roundedInput"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Description:</label>
                <div className="inputWrapper">
                  <textarea
                    placeholder="Enter about your project details"
                    className="textArea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="field">
                <label>Due Date:</label>
                <div className="input-wrapper">
                  <input
                    type="date"
                    className="roundedInput"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Estimated Timeline:</label>
                <div className="timeline-inputs">
                  <select
                    className="roundedInput timeline-unit"
                    value={timelineUnit}
                    onChange={(e) => setTimelineUnit(e.target.value)}
                    required
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                  <input
                    type="number"
                    className="roundedInput timeline-duration"
                    value={timelineDuration}
                    onChange={(e) => setTimelineDuration(e.target.value)}
                    placeholder="Duration"
                    min="1"
                    required
                  />
                </div>
              </div>
              {/* Skills section */}
              <div className="field">
                <label>Search skills or add your own:</label>
                <div className="inputWrapper">
                  <input
                    type="text"
                    className="inputWithIcon"
                    value={inputValue}
                    onChange={handleSearch}
                    onKeyDown={handleAddCustomSkill}
                    placeholder="Search skill "
                  />
                </div>
              </div>

              {/* Selected Skills */}
              <h3 className="field">Selected skills</h3>
              <div className="skill">
                {selectedSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className="skillButton"
                    onClick={() => handleSkillRemove(skill)}
                  >
                    {skill}
                    <span>
                      <CrossIcon />
                    </span>
                  </button>
                ))}
              </div>

              {/* Filtered or Popular Skills */}
              <h3 className="field">Popular skills for UI/UX Design</h3>
              <div className="skills">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className="skillButton"
                    onClick={() => handleSkillAdd(skill)}
                  >
                    {skill}
                    <span>
                      <PlusIcon />
                    </span>
                  </button>
                ))}
              </div>

              {/* Budget section */}
              <h3 className="field">Budget:</h3>
              <div className="budget-section">
                <div className="pricing-options">
                  <div
                    className={`option-box ${budgetType === 'hourly' ? 'selected' : ''}`}
                    onClick={() => handleBudgetTypeChange('hourly')}
                  >
                    <div className="box-content">
                      <input
                        type="radio"
                        name="budgetType"
                        value="hourly"
                        checked={budgetType === 'hourly'}
                        onChange={() => handleBudgetTypeChange('hourly')}
                        className="radio-button"
                      />
                      <span className="icon">
                        <HourlyRate />
                      </span>
                      <p>Hourly rate</p>
                    </div>
                  </div>
                  <div
                    className={`option-box ${budgetType === 'fixed' ? 'selected' : ''}`}
                    onClick={() => handleBudgetTypeChange('fixed')}
                  >
                    <div className="box-content">
                      <input
                        type="radio"
                        name="budgetType"
                        value="fixed"
                        checked={budgetType === 'fixed'}
                        onChange={() => handleBudgetTypeChange('fixed')}
                        className="radio-button"
                      />
                      <span className="icon">
                        <FixedRate />
                      </span>
                      <p>Fixed price</p>
                    </div>
                  </div>
                </div>

                {budgetType === 'hourly' && (
                  <div className="rate-inputs">
                    <div className="labels">
                      <label>From</label>
                      <label className="label1">To</label>
                    </div>
                    <div className="input-group">
                      <div className="input-wrapper">
                        <input
                          type="number"
                          placeholder="$12.00"
                          value={hourlyRate.min}
                          onChange={(e) => setHourlyRate({...hourlyRate, min: e.target.value})}
                          required={budgetType === 'hourly'}
                        />
                        <span className="rate-unit">/hr</span>
                      </div>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          placeholder="$15.00"
                          value={hourlyRate.max}
                          onChange={(e) => setHourlyRate({...hourlyRate, max: e.target.value})}
                          required={budgetType === 'hourly'}
                        />
                        <span className="rate-unit">/hr</span>
                      </div>
                    </div>
                  </div>
                )}

                {budgetType === 'fixed' && (
                  <div className="rate-inputs">
                    <div className="input-group">
                      <div className="input-wrapper">
                        <input
                          type="number"
                          placeholder="$1500.00"
                          value={fixedPrice}
                          onChange={(e) => setFixedPrice(e.target.value)}
                          required={budgetType === 'fixed'}
                        />
                        <span className="rate-unit">Total</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="field">
                  <label>Describe what you need:</label>
                  <div>
                    <textarea
                      className="textArea"
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="field">
                <label className="attachButton">
    <span className="icon">📎</span>
    ATTACH (Allowed formats: PDF, JPG, JPEG)
    <input
      type="file"
      style={{ display: 'none' }}
      onChange={handleFileAttach}
    />
  </label>
  {fileError && <div className="error-message">{fileError}</div>} {/* Display error */}
  {attachedFile && (
    <div className="attachedFile">
      <span>{attachedFile.name}</span>
      <button type="button" onClick={handleFileRemove}>
        <span className="icon">✖</span>
      </button>
    </div>
  )}
  </div>

                <div className="field">
                  {error && <div className="error-message">{error}</div>}
                  <button type="submit" className="buttonWithIcon" disabled={isLoading}>
                    {isLoading ? "Sending..." : "SEND OFFER"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="right">
            <div className="userProfile">
              {freelancerProfile ? (
                <div className="freelancerProfile">
                  <h3>{freelancerProfile.name}</h3>
                  <p>{freelancerProfile.country || "No country provided"}</p>
                  <p>{freelancerProfile.experience?.title}</p>
                  <p>${freelancerProfile.rate} /hr</p>
                  <p>{freelancerProfile.completedJobs} jobs completed</p>
                </div>
              ) : (
                <p>No freelancer profile selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default OfferForm;
