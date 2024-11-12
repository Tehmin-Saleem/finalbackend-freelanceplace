import React, { useState, useEffect } from "react";
import {
  Header,
  FreelancersJobsCard,
  CommonButton,
  Spinner
} from "../../components/index";
import "./styles.scss";
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

      const hireResponse = await axios.get('http://localhost:5000/api/client/hire', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('hire response', hireResponse.data);
      
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

      console.log('hire response', hireResponse.data);

      const jobsResponse = await axios.get('http://localhost:5000/api/client/job-posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!jobsResponse.data?.jobPosts) {
        throw new Error('Invalid job posts data');
      }
      
      console.log('jobsprespinse', jobsResponse.data)
      const matchedJobs = jobsResponse.data.jobPosts
        .filter(job => jobToFreelancerMap[job._id])
        .map(job => ({
          job_id: job._id,
          type: job.budget_type === "fixed" ? "Fixed" : "Hourly",
          title: job.job_title || 'Untitled Job',
          client_id: job.client_id._id,
          freelancer_id: jobToFreelancerMap[job._id],
          rate: job.budget_type === "fixed" 
            ? `${job.fixed_price}`
            : `${job.hourly_rate?.from}-${job.hourly_rate?.to}/hr`,
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

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        </div>
        <span>Go to page</span>
        <input type="text" />
        <button>→</button>
      </div>
    </div>
  );
};

export default FreelancersJobsPage;