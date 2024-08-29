import React, { useState } from "react";
import { Header, Alljobs } from "../../components";
import { Filter, IconSearchBar } from "../../svg";
import "./styles.scss";

const AllJobsPage = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: "Create UI mockups of new website layout",
      rate: "$200.00/fixed",
      postedBy: "Public",
      proposals: 22,
      messages: 7,
    },
    {
      id: 2,
      title: "Create UI mockups of new website layout",
      rate: "$12.00/Hourly",
      postedBy: "Private",
      proposals: 22,
      messages: 7,
    },
    // Add more jobs here...
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setSelectedFilter(e.target.value);
  const handleRowsPerPageChange = (e) => setRowsPerPage(e.target.value);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
            <div className="filter-dropdown__inner">
            <input type="checkbox" id="active-jobs" />
            <label htmlFor="active-jobs">Active Jobs</label>
            </div>
            <div className="filter-dropdown__inner">
            <input type="checkbox" id="pending-jobs" />
            <label htmlFor="pending-jobs">Pending Jobs</label>
            </div>
            <div className="filter-dropdown__inner">
            <input type="checkbox" id="completed-jobs" />
            <label htmlFor="completed-jobs">Completed</label>
            </div>
            <button className="filter-done-button">Done</button>
          </div>
          
        </div>
        <button className="post-job-button">Post a new job</button>
      </div>

      {/* Jobs List */}
      <div className="jobs-container">
        {jobs
          .filter((job) =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((job) => (
            <Alljobs key={job.id} {...job} />
          ))}
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
