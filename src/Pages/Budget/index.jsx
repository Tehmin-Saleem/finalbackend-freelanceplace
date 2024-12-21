import React, { useState, useEffect } from 'react';
import { ProgressBar, Header } from '../../components/index';
import './styles.scss';
import { ClientFrame, HourlyRate, FixedRate } from '../../svg/index.js';
import { useNavigate } from 'react-router-dom';

const Budget = () => {
  const [budgetType, setBudgetType] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const steps = [
    { number: "1", label: "Job Title", color: "#4BCBEB" },
    { number: "2", label: "Description", color: "#4BCBEB" },
    { number: "3", label: "Preferred Skills", color: "#4BCBEB"},
    { number: "4", label: "Budget", color: "#6b7280" },
    { number: "5", label: "Project Duration", color: "#6b7280" },
    { number: "6", label: "Attachment", color: "#6b7280" },
  ];

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('jobBudget')) || {};
    setBudgetType(storedData.type || "");
    setMinRate(storedData.minRate || "");
    setMaxRate(storedData.maxRate || "");
  }, []);

  const handleProjectDurationButtonClick = () => {
    if (budgetType === "hourly" && (!minRate || !maxRate)) {
      setError("Please enter both minimum and maximum hourly rates.");
      return;
    }
    if (budgetType === "fixed" && !maxRate) {
      setError("Please enter a total fixed price.");
      return;
    }
    setError("");
    localStorage.setItem('jobBudget', JSON.stringify({
      type: budgetType,
      minRate,
      maxRate
    }));
    navigate('/ProjectDuration');
  };

  const handleBackButtonClick = () => {
    navigate('/PreferredSkills');
  };

  const handleBudgetTypeChange = (type) => {
    setBudgetType(type);
    if (type === 'fixed') {
      setMinRate("");
    }
    setError("");
    localStorage.setItem('jobBudget', JSON.stringify({
      type,
      minRate: type === 'fixed' ? "" : minRate,
      maxRate
    }));
  };

  const handleHourlyRateChange = (e, field) => {
    const value = e.target.value;
    if (field === 'min') setMinRate(value);
    if (field === 'max') setMaxRate(value);
    setError("");
    localStorage.setItem('jobBudget', JSON.stringify({
      type: budgetType,
      minRate: field === 'min' ? value : minRate,
      maxRate: field === 'max' ? value : maxRate
    }));
  };

  const handleFixedPriceChange = (e) => {
    setMaxRate(e.target.value);
    setError("");
    localStorage.setItem('jobBudget', JSON.stringify({
      type: budgetType,
      minRate: "",
      maxRate: e.target.value
    }));
  };

  return (
    <>
    <Header />
    <div className="budget-page">
     
      <div className="progress-container">
        <ProgressBar steps={steps} currentStep={3} />
      </div>
      <div className="budgetcontainer">
        <div className="left-section">
          <h3>4/6 Budget</h3>
          <h2>Tell us about your budget.</h2>
          <p>This will help us match you to talent within 
            <br/>
            your range.</p>
          <button className="back-button" onClick={handleBackButtonClick}>Back</button>
        </div>
        <div className="right-section">
          <div className="pricing-options">
            <div className="option-box client" onClick={() => handleBudgetTypeChange('hourly')}>
              <div className="box-content">
                <span>
                  <HourlyRate />
                </span>
                <p>Hourly rate</p>
                <input
                  type="radio"
                  name="pricing"
                  className="radio-btn"
                  checked={budgetType === 'hourly'}
                />
              </div>
            </div>
            <div className="option-box freelancer" onClick={() => handleBudgetTypeChange('fixed')}>
              <div className="box-content">
                <span>
                  <FixedRate/>
                </span>
                <p>Fixed price</p>
                <input
                  type="radio"
                  name="pricing"
                  className="radio-btn"
                  checked={budgetType === 'fixed'}
                />
              </div>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          {budgetType === 'hourly' && (
            <div className="rate-inputs">
              <div className="labels">
                <label>From</label>
                <label className="to-label">To</label>
              </div>
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="$12.00"
                    value={minRate}
                    onChange={(e) => handleHourlyRateChange(e, 'min')}
                  />
                  <span className="rate-unit">/hr</span>
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="$15.00"
                    value={maxRate}
                    onChange={(e) => handleHourlyRateChange(e, 'max')}
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
                    type="text"
                    placeholder="$1500.00"
                    value={maxRate}
                    onChange={handleFixedPriceChange}
                  />
                  <span className="rate-unit">Total</span>
                </div>
              </div>
            </div>
          )}
          <p className="average-rate-text">This is the average rate for similar projects.</p>
          <button className="next-button" onClick={handleProjectDurationButtonClick}>Next: Project Duration</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Budget;