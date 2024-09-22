import React, { useState, useEffect } from "react";
import { Header, Alljobs } from "../../components";
import { Filter, IconSearchBar } from "../../svg";
import axios from "axios";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

const AllJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/signin");
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/client/jobposts", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      setJobs(response.data.jobPosts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching job posts:", err);
      setError("Failed to fetch job posts. Please try again later.");
      setLoading(false);
  
      if (err.response && err.response.status === 401) {
        navigate("/signin");
      }
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setSelectedFilter(e.target.value);
  const handleRowsPerPageChange = (e) => setRowsPerPage(Number(e.target.value));
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const filteredJobs = jobs.filter((job) =>
    job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastJob = currentPage * rowsPerPage;
  const indexOfFirstJob = indexOfLastJob - rowsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const handleViewClick = (jobId) => {
    if (!jobId) {
      console.error("jobId is undefined");
      return;
    }
    navigate(`/proposals/${jobId}`);
  };
  
  return (
    <div className="jobs-page">
      <Header />

      <h1 className="jobs-heading">All Job Posts</h1>

      {/* Search Bar, Filters, and "Post a new job" button */}
      <div className="search-container">
        <div className="search-bar-wrapper">
          <IconSearchBar className="icon" width="20" height="20" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-wrapper">
          <button className="filter-button">
            <Filter className="filter-icon" />
            All Filters
          </button>
          <div className="filter-dropdown">
            <span className="filter-dropdown__inner">
            <input type="checkbox" id="active-jobs" />
            <label htmlFor="active-jobs">Active Jobs</label>
            </span>
            <span className="filter-dropdown__inner">
            <input type="checkbox" id="pending-jobs" />
            <label htmlFor="pending-jobs">Pending Jobs</label>
            </span>
            <span className="filter-dropdown__inner">
            <input type="checkbox" id="completed-jobs" />
            <label htmlFor="completed-jobs">Completed</label>
            </span>
            <button className="filter-done-button">Done</button>
          </div>
        </div>
        <button className="post-job-button">Post a new job</button>
      </div>

      {/* Jobs List */}
      <div className="jobs-container">
        {loading ? (
          <p>Loading job posts...</p>
        ) : error ? (
          <p>{error}</p>
        ) : currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <Alljobs
              key={job._id}
              jobId={job._id}
              title={job.job_title}
              rate={job.budget_type === "hourly" ? `$${job.hourly_rate.from}-$${job.hourly_rate.to}/hr` : `$${job.fixed_price}/fixed`}
              postedBy={job.posted_by || "Unknown"}
              proposals={job.proposalCount || 0}
              messages={job.messages ? job.messages.length : 0}
              onViewClick={handleViewClick}
            />
          ))
        ) : (
          <p>No job posts found.</p>
        )}
      </div>
      {/* Pagination */}
      <div className="pagination">
        <span>Rows per page</span>
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        <div className="page-controls">
          {[1, 2, 3, "...", 10, 11, 12].map((page, index) => (
            <span
              key={index}
              className={`page-number ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() =>
                typeof page === "number" && handlePageChange(page)
              }
            >
              {page}
            </span>
          ))}
        </div>
        <span>Go to page</span>
        <input
          type="text"
          className="pagination-input"
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
        />
        <button className="pagination-button">→</button>
      </div>
    </div>
  );
};

export default AllJobsPage;
