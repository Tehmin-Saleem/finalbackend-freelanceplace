import React, { useState, useEffect } from "react";
import {
  Header,
  FreelancersJobsCard,
  CommonButton,
  Spinner,
} from "../../components/index";
import "./styles.scss";
import { Filter, IconSearchBar } from "../../svg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const FreelancersJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [specificjobs, setSpecificJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all"); // all, ongoing, pending, completed

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
console.log('hire response', hireResponse.data)
if (!hireResponse.data || !Array.isArray(hireResponse.data.data)) {
  console.log('Hire response structure:', hireResponse.data);
  setJobs([]);
  return;
}
const jobToFreelancerMap = hireResponse.data.data.reduce((map, hire) => {
  if (hire?.jobId?.id && hire?.freelancerId?.id) {
    map[hire.jobId.id] = hire.freelancerId.id;
  }
  return map;
}, {});
const hiredJobIds = new Set(
  hireResponse.data.data
    .filter(hire => hire?.jobId?.id)
    .map(hire => hire.jobId.id)
);
      // Extract job IDs from hire data
     
console.log('hire response', hireResponse.data)
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
      // console.log('response', jobsResponse.data)
      // Filter jobs to only include those with matching IDs
      console.log('jobsprespinse', jobsResponse.data)
      const matchedJobs = jobsResponse.data.jobPosts
        .filter(job => jobToFreelancerMap[job._id])
        .map(job => ({
          job_id: job._id,
          type: job.budget_type === "fixed" ? "Fixed" : "Hourly",
          title: job.job_title || 'Untitled Job',
          client_id: job.client_id._id,
          freelancer_id: jobToFreelancerMap[job._id], // Add freelancer_id from the map
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
      console.log('matched jobs', matchedJobs)
      console.log('id', matchedJobs.job_id)
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

  // const fetchFreelancerHiredJobs = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       throw new Error("No authentication token found");
  //     }

  //     const decodedToken = jwtDecode(token);
  //     const freelancerId = decodedToken.userId;

  //     if (!freelancerId) {
  //       throw new Error("Freelancer ID not found");
  //     }

  //     const response = await axios.get(
  //       `http://localhost:5000/api/freelancer/hired-jobs/${freelancerId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.data || !Array.isArray(response.data.data)) {
  //       setSpecificJobs([]);
  //       return;
  //     }

  //     const formattedJobs = response.data.data.map((hire) => ({
  //       id: hire.hireId,
  //       jobId: hire.job?.jobId || hire.job?.id,
  //       proposalId: hire.proposal?.proposalId || hire.proposal?.id, // Adding proposal ID
  //       type: hire.job?.budget_type === "fixed" ? "Fixed" : "Hourly",
  //       title: hire.job?.title || "Untitled Job",
  //       client_id: hire.client?.id,
  //       freelancer_id: freelancerId,
  //       rate: hire.job?.budget || "Not specified",
  //       timeline: hire.job?.deadline || "Not specified",
  //       level: hire.job?.category || "Not specified",
  //       description: hire.job?.description || "No description provided",
  //       tags: hire.job?.skills || [],
  //       verified: true,
  //       location: "Not specified",
  //       postedTime: new Date(hire.hiredDate).toLocaleDateString(),
  //       status: hire.status,
  //       dueDate: hire.job?.deadline ? new Date(hire.job.deadline) : null,
  //       proposalDetails: {
  //         ...hire.proposal,
  //         id: hire.proposal?.id || hire.proposal?.proposalId, // Including proposal ID in details
  //         milestones: hire.proposal?.milestones || [],
  //         projectBid: hire.proposal?.projectBid || null,
  //       },
  //     }));

  //     setSpecificJobs(formattedJobs);
  //   } catch (error) {
  //     console.error("Error in fetchFreelancerHiredJobs:", error);
  //     setError("Failed to fetch your hired jobs. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchFreelancerHiredJobs();
  // }, []);

  // Filter jobs based on status and search term
  const getFilteredJobs = () => {
    return jobs.filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (statusFilter === "all") return matchesSearch;

      const today = new Date();
      const dueDate = job.dueDate ? new Date(job.dueDate) : null;

      switch (statusFilter) {
        case "ongoing":
          return matchesSearch && (!dueDate || dueDate > today);
        case "pending":
          return matchesSearch && dueDate && dueDate < today;
        case "completed":
          return matchesSearch && job.status === "completed";
        default:
          return matchesSearch;
      }
    });
  };

  const filteredJobs = getFilteredJobs();
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleGoToPage = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(e.target.value);
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        e.target.value = "";
      }
    }
  };

  return (
    <div className="jobs-page">
      <Header />
      <h1 className="jobs-heading">My Hired Jobs</h1>
      <div className="filters-container">
        <div className="searchbar-container">
          <div className="search-bar-wrapper">
            <IconSearchBar className="icon" width="20" height="20" />
            <input
              type="text"
              placeholder="Search jobs by title"
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>
        <div className="status-filters">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="status-select"
          >
            <option value="all">All Jobs</option>
            <option value="ongoing">Ongoing</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>{" "}
      {loading ? (
        <Spinner size={100} alignCenter />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="jobs-container">
        
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => (
              <FreelancersJobsCard 
                key={job.title}
                job_id={job.job_id}
                client_id={job.client_id} 
                freelancer_id={job.freelancer_id}
                {...job}
              />


            ))
          ) : (
            <div className="no-jobs">
              {searchTerm
                ? "No matching jobs found"
                : "You haven't been hired for any jobs yet"}
            </div>
          )}
        </div>
      )}
      {filteredJobs.length > 0 && (
        <div className="pagination">
          <div className="rows-per-page">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="page-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-button"
            >
              ←
            </button>

            {getPageNumbers().map((pageNum, index) => (
              <span
                key={index}
                className={`page-number ${
                  pageNum === currentPage ? "active" : ""
                } ${pageNum === "..." ? "dots" : ""}`}
                onClick={() => pageNum !== "..." && handlePageChange(pageNum)}
              >
                {pageNum}
              </span>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-button"
            >
              →
            </button>
          </div>

          <div className="go-to-page">
            <span>Go to page</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              onKeyPress={handleGoToPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancersJobsPage;
