import React, { useState, useEffect } from "react";
import axios from "axios";
import { NewHeader, JobsCard } from "../../components/index";
import "./styles.scss";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          console.log('Token retrieved:', token);
        } else {
          console.log('No token found in local storage.');
        }

        const response = await axios.get('http://localhost:5000/api/client/jobposts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setJobs(response.data.jobPosts);
      } catch (error) {
        setError("Error fetching jobs: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Correct formatRate function
  const formatRate = (job) => {
    if (job.budget_type === "fixed") {
      return `$${job.fixed_price}`;
    } else if (job.budget_type === "hourly" && job.hourly_rate) {
      const { from, to } = job.hourly_rate;
      return `$${from}-$${to}/hr`;
    } else {
      return "Rate not specified";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="jobs-page">
      <NewHeader />
      <h1 className="jobs-heading">Jobs matching your skills</h1>
      <div className="jobs-container">
        {jobs.map((job) => (
          <JobsCard 
            key={job._id}
            jobPostId={job._id}
            type={job.budget_type === "fixed" ? "Fixed" : "Hourly"}
            title={job.job_title}
            rate={formatRate(job)}
            timeline={job.project_duration?.duration_of_work || "Not specified"}
            level={job.project_duration?.experience_level || "Not specified"}
            description={job.description || "No description provided"}
            tags={job.preferred_skills || []}
            verified={true} 
            rating="Top rated" 
            location="Lahore, Punjab, Pakistan" 
          />
        ))}
      </div>
      <div className="pagination">
        <span>Rows per page</span>
        <select>
          <option>5</option>
          <option>10</option>
          <option>15</option>
        </select>
        <div className="page-controls">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>...</span>
          <span>10</span>
          <span>11</span>
          <span>12</span>
        </div>
        <span>Go to page</span>
        <input type="text" />
        <button>→</button>
      </div>
    </div>
  );
};

export default JobsPage;
