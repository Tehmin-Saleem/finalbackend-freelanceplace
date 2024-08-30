import React, { useState } from "react";
import {
  Header,
  FreelancersJobsCard,
  CommonButton,
} from "../../components/index";
import "./styles.scss"; // Import the SCSS file
import { Filter, IconSearchBar } from "../../svg";

const FreelancersJobsPage = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      type: "Hourly",
      title: "Freelance Graphic Designer for Cricket Tech Brand",
      rate: "$12/hr",
      timeline: "1 to 3 months",
      level: "Expert",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi nam totam cupiditate odit esse, quisquam deserunt aut cumque odio consequuntur maxime distinctio non, illo dolor adipisci molestias pariatur. Maiores, officia...",
      tags: [
        "Mobile app design",
        "Wireframe",
        "Mockup",
        "Prototyping",
        "Figma",
      ],
      verified: true,
      rating: "Top rated",
      location: "Lahore, Punjab, Pakistan",
      postedTime: "30 minutes ago", // Add posted time
    },
    {
      id: 2,
      type: "Fixed",
      title: "Freelance Graphic Designer for Cricket Tech Brand",
      rate: "$120",
      timeline: "1 to 3 months",
      level: "Intermediate",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi nam totam cupiditate odit esse, quisquam deserunt aut cumque odio consequuntur maxime distinctio non, illo dolor adipisci molestias pariatur. Maiores, officia...",
      tags: [
        "Mobile app design",
        "Wireframe",
        "Mockup",
        "Prototyping",
        "Figma",
      ],
      verified: true,
      rating: "Top rated",
      location: "Lahore, Punjab, Pakistan",
      postedTime: "45 minutes ago", // Add posted time
    },
    // Add more jobs...
  ]);

  return (
    <div className="jobs-page">
      <Header />
      <h1 className="jobs-heading">My Jobs</h1>
      <div className="search-container">
        <div className="search-bar-wrapper">
          <IconSearchBar className="icon" width="20" height="20" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <button className="filter-button">
          <Filter className="filter-icon" />
          All Filters
        </button>
      </div>
      

      <div className="jobs-container">
        {jobs.map((job) => (
          <FreelancersJobsCard key={job.id} {...job} />
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

export default FreelancersJobsPage;
