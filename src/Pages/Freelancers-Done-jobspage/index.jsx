
import React, { useState, useEffect } from "react";
import {
  Header,
  FreelancersJobsCard,
  CommonButton,
} from "../../components/index";
import "./styles.scss"; // Import the SCSS file
import { Filter, IconSearchBar } from "../../svg";
import axios from "axios";
const FreelancersJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // First fetch job IDs from /hire API
      const hireResponse = await axios.get('http://localhost:5000/api/client/hire', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!hireResponse.data?.data) {
        throw new Error('Invalid hire data format');
      }

      // Extract job IDs from hire data
      const hiredJobIds = new Set(hireResponse.data.data.map(hire => hire.jobId?.id));

      // Fetch all jobs from /job-posts API
      const jobsResponse = await axios.get('http://localhost:5000/api/client/job-posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!jobsResponse.data?.jobPosts) {
        throw new Error('Invalid job posts data');
      }

      // Filter jobs to only include those with matching IDs
      const matchedJobs = jobsResponse.data.jobPosts
        .filter(job => hiredJobIds.has(job._id))
        .map(job => ({
          id: job._id,
          type: job.budget_type === "fixed" ? "Fixed" : "Hourly",
          title: job.job_title || 'Untitled Job',
          rate: job.budget_type === "fixed" 
            ? `$${job.fixed_price}` 
            : `$${job.hourly_rate?.from}-$${job.hourly_rate?.to}/hr`,
          timeline: job.project_duration?.duration_of_work || "Not specified",
          level: job.project_duration?.experience_level || "Not specified",
          description: job.description || "No description provided",
          tags: job.preferred_skills || [],
          verified: job.paymentMethodStatus === "Payment method verified",
          location: job.country || "Not specified",
          postedTime: new Date(job.createdAt).toLocaleDateString()
        }));

      setJobs(matchedJobs);
    } catch (error) {
      console.error('Error in fetchJobs:', error);
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="jobs-page">
      <Header />
      <h1 className="jobs-heading">My Jobs</h1>
      
      <div className="searchbar-container">
        <div className="search-bar-wrapper">
          <IconSearchBar className="icon" width="20" height="20" />
          <input 
            type="text" 
            placeholder="Search jobs" 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-button">
          <Filter className="filter-icon" />
          All Filters
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="jobs-container">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => (
              <FreelancersJobsCard 
                key={job.title}
                id={job.id} 

                {...job}
              />
            ))
          ) : (
            <div className="no-jobs">
              {searchTerm ? 'No matching jobs found' : 'No jobs found'}
            </div>
          )}
        </div>
      )}

      <div className="pagination">
        <span>Rows per page</span>
        <select 
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <div className="page-controls">
        <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>...</span>
          <span>10</span>
          <span>11</span>
          <span>12</span>
          {/* {[...Array(totalPages)].map((_, index) => (
            <span 
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </span>
          ))} */}
        </div>
        <span>Go to page</span>
        <input type="text" />
        <button>→</button>
      </div>
    </div>
  );
};

export default FreelancersJobsPage;