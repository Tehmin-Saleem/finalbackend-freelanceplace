// import React, { useState, useEffect } from "react";
// import { Header, Alljobs, Spinner } from "../../components";
// import { Filter, IconSearchBar } from "../../svg";
// import axios from "axios";
// import "./styles.scss";
// import { useNavigate } from "react-router-dom";

// const AllJobsPage = () => {
//   const [jobs, setJobs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/signin");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get(
//         "http://localhost:5000/api/client/jobposts",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setJobs(response.data.jobPosts);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching job posts:", err);
//       setError("Failed to fetch job posts. Please try again later.");
//       setLoading(false);

//       if (err.response && err.response.status === 401) {
//         navigate("/signin");
//       }
//     }
//   };

//   const handleSearchChange = (e) => setSearchTerm(e.target.value);
//   const handleFilterChange = (e) => setSelectedFilter(e.target.value);
//   const handleRowsPerPageChange = (e) => setRowsPerPage(Number(e.target.value));
//   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

//   const filteredJobs = jobs.filter((job) => {
//     const matchesSearch = job.job_title
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesFilter =
//       selectedFilter === "All" ||
//       (selectedFilter === "Ongoing" && job.hasHiredProposal);

//     return matchesSearch && matchesFilter;
//   });

//   const indexOfLastJob = currentPage * rowsPerPage;
//   const indexOfFirstJob = indexOfLastJob - rowsPerPage;
//   const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
//   const handleViewClick = (jobId) => {
//     if (!jobId) {
//       console.error("jobId is undefined");
//       return;
//     }
//     navigate(`/proposals/${jobId}`);
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   // const handleClick = () => {
//   //   navigate('./jobposting');
//   // };

//   return (
//     <div className="jobs-Page">
//       <Header />

//       <h1 className="jobs-Heading">All Job Posts</h1>

//       {/* Search Bar, Filters, and "Post a new job" button */}
//       <div className="search-Container">
//         <div className="search-bar-wrapper">
//           <IconSearchBar className="icon" width="20" height="20" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="search-input"
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="{filter-wrapper ${isDropdownOpen ? 'open' : ''}`}">
//           <button className="filter-button" onClick={toggleDropdown}>
//             {/* <Filter className="filter-icon" /> */}
//             All Filters
//           </button>

//           {isDropdownOpen && (
//             <div className="filter-Dropdown">
//               <span className="filter-dropdown__inner">
//                 <input
//                   type="checkbox"
//                   id="ongoing-jobs"
//                   checked={selectedFilter === "Ongoing"}
//                   onChange={() =>
//                     setSelectedFilter(
//                       selectedFilter === "Ongoing" ? "All" : "Ongoing"
//                     )
//                   }
//                 />
//                 <label htmlFor="ongoing-jobs">Ongoing Jobs</label>
//               </span>
//               {/* <span className="filter-dropdown__inner">
//             <input type="checkbox" id="pending-jobs" />
//             <label htmlFor="pending-jobs">Pending Jobs</label>
//             </span>
//             <span className="filter-dropdown__inner">
//             <input type="checkbox" id="completed-jobs" />
//             <label htmlFor="completed-jobs">Completed</label>
//             </span> */}
//               <button className="filter-done-Button" onClick={toggleDropdown}>
//                 Done
//               </button>
//             </div>
//           )}

//         </div>
//         <button className="post-job-Button">Post a new job</button>
//       </div>
//       {/* Jobs List */}
//       <div className="jobs-containers">
//         {loading ? (
//           // <Spinner/>
//           <Spinner size={100} alignCenter />
//         ) : // <p>Loading job posts...</p>
//         error ? (
//           <p>{error}</p>
//         ) : currentJobs.length > 0 ? (
//           currentJobs.map((job) => (
//             <Alljobs
//               key={job._id}
//               jobId={job._id}
//               title={job.job_title}
//               rate={
//                 job.budget_type === "hourly"
//                   ? `$${job.hourly_rate.from}-$${job.hourly_rate.to}/hr`
//                   : `$${job.fixed_price}/fixed`
//               }
//               postedBy={job.posted_by || "Unknown"}
//               proposals={job.proposalCount || 0}
//               messages={job.messages ? job.messages.length : 0}
//               onViewClick={handleViewClick}
//             />
//           ))
//         ) : (
//           <p>No job posts found.</p>
//         )}
//       </div>
//       {/* Pagination */}
//       <div className="pagination">
//         <span>Rows per page</span>
//         <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
//           <option value="5">5</option>
//           <option value="10">10</option>
//           <option value="15">15</option>
//         </select>
//         <div className="page-controls">
//           {[1, 2, 3, "...", 10, 11, 12].map((page, index) => (
//             <span
//               key={index}
//               className={`page-number ${currentPage === page ? "active" : ""}`}
//               onClick={() => typeof page === "number" && handlePageChange(page)}
//             >
//               {page}
//             </span>
//           ))}
//         </div>
//         <span>Go to page</span>
//         <input
//           type="text"
//           className="pagination-input"
//           value={currentPage}
//           onChange={(e) => handlePageChange(Number(e.target.value))}
//         />
//         <button className="pagination-button">→</button>
//       </div>
//     </div>
//   );
// };

// export default AllJobsPage;
import React, { useState, useEffect } from "react";
import { Header, Alljobs, Spinner } from "../../components";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
      const response = await axios.get(
        `http://localhost:5000/api/client/filtered-jobs?filter=${selectedFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add status field to each job based on proposals
      // const jobsWithStatus = response.data.jobPosts.map(job => ({
      //   ...job,
      //   status: determineJobStatus(job)
      // }));
      console.log('Response data:', response.data);

      if (response.data.success) {
        setJobs(response.data.data);
      } else {
        setError('Failed to fetch jobs: ' + response.data.message);
      }

    
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

  // // Helper function to determine job status
  // const determineJobStatus = (job) => {
  //   if (job.hasHiredProposal) return "ongoing";
  //   if (job.isCompleted) return "completed";
  //   return "pending";
  // };

  // Update useEffect to depend on selectedFilter
useEffect(() => {
  fetchJobs();
}, [selectedFilter]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.job_title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === "All" ||
      (selectedFilter === "Ongoing" && job.status === "ongoing") ||
      (selectedFilter === "Completed" && job.status === "completed") ||
      (selectedFilter === "Pending" && job.status === "pending");

    return matchesSearch && matchesFilter;
  });

  const indexOfLastJob = currentPage * rowsPerPage;
  const indexOfFirstJob = indexOfLastJob - rowsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);

  const handleViewClick = (jobId) => {
    if (!jobId) {
      console.error("jobId is undefined");
      return;
    }
    navigate(`/proposals/${jobId}`);
  };

  const handlePostJob = () => {
    navigate('/jobposting');
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="jobs-Page">
      <Header />

      <h1 className="jobs-Heading">All Job Posts</h1>

      <div className="search-Container">
        <div className="search-bar-wrapper">
          <IconSearchBar className="icon" width="20" height="20" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-wrapper">
          <button className="filter-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Filter className="filter-icon" />
            All Filters
          </button>

          {isDropdownOpen && (
            <div className="filter-Dropdown">
              {['All', 'Ongoing', 'Pending', 'Completed'].map((filter) => (
                <span key={filter} className="filter-dropdown__inner">
                  <input
                    type="radio"
                    id={`filter-${filter.toLowerCase()}`}
                    checked={selectedFilter === filter}
                    onChange={() => handleFilterChange(filter)}
                  />
                  <label htmlFor={`filter-${filter.toLowerCase()}`}>{filter} Jobs</label>
                </span>
              ))}
              <button className="filter-done-Button" onClick={() => setIsDropdownOpen(false)}>
                Done
              </button>
            </div>
          )}
        </div>

        <button className="post-job-Button" onClick={handlePostJob}>
          Post a new job
        </button>
      </div>

      <div className="jobs-containers">
        {loading ? (
          <Spinner size={100} alignCenter />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <Alljobs
              key={job._id}
              jobId={job._id}
              title={job.job_title}
              rate={job.budget_type === "hourly"
                ? `${job.hourly_rate.from}-${job.hourly_rate.to}/hr`
                : `${job.fixed_price}/fixed`}
              postedBy={job.posted_by || "Unknown"}
              proposals={job.proposalCount || 0}
              messages={job.messages?.length || 0}
              status={job.status}
              onViewClick={handleViewClick}
            />
          ))
        ) : (
          <p className="no-jobs-message">No job posts found.</p>
        )}
      </div>

      {filteredJobs.length > 0 && (
        <div className="pagination">
          <div className="rows-per-page">
            <span>Rows per page:</span>
            <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
              {[5, 10, 15, 20].map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div className="page-controls">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>
            
            {getPaginationNumbers().map((page, index) => (
              <span
                key={index}
                className={`page-number ${currentPage === page ? "active" : ""} ${page === "..." ? "dots" : ""}`}
                onClick={() => typeof page === "number" && handlePageChange(page)}
              >
                {page}
              </span>
            ))}

            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>

          <div className="go-to-page">
            <span>Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Math.min(Math.max(1, Number(e.target.value)), totalPages);
                handlePageChange(page);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllJobsPage;