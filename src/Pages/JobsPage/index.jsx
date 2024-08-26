import React, { useState } from "react";
import { NewHeader, JobsCard, Header } from "../../components/index";

import "./styles.scss"; // Import the SCSS file

const JobsPage = () => {
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
    },
    // Add more jobs
  ]);

  return (
    <div className="jobs-page">
      <Header/>
      <h1 className="jobs-heading">Jobs matching your skills</h1>
      <div className="jobs-container">
        {jobs.map((job) => (
          <JobsCard key={job.id} {...job} />
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
