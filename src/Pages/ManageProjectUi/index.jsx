import React, { useState, useEffect } from "react";
import "./styles.scss";
import Header from "../../components/Commoncomponents/Header";
import { Chat } from "../../svg/index";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReviewModal from "../../components/ReviewsModal";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  Progress,
  Tag,
  Row,
  Col,
  Timeline,
  Empty,
  Alert,
  Statistic,
  Typography,
  Modal,
  Button,
  message,
} from "antd";
const { Title, Text } = Typography;
import Spinner from "../../components/chatcomponents/Spinner";

const ManageProjectsByClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch client profile and ongoing projects in parallel
        const [profileResponse, projectsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/client/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/client/ongoing-projects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfileData(profileResponse.data.data);
        setProjects(projectsResponse.data.data);

        console.log("Project Data:", projectsResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  if (loading) return <Spinner alignCenter />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Header />
      <div className="manage-projects">
        {/* Header Section */}
        <header className="header">
          <div className="header-content">
            <h1>Manage Ongoing Projects</h1>
            <p>Track project progress and milestones</p>
          </div>

          <div className="client-profile">
            <img
              src={profileData?.image || "https://via.placeholder.com/150"}
              alt={profileData?.name || "Client"}
              className="profile-image"
            />
            <div className="profile-info">
              <span className="name">{profileData?.name || "Loading..."}</span>
              <span className="email">{profileData?.email}</span>
            </div>
          </div>
        </header>

        {/* Projects Section */}
        <div className="projects-container">
          {/* Project List */}
          <div className="project-list">
            {projects.length === 0 ? (
              <div className="no-projects">No ongoing projects found</div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                  isSelected={selectedProject?.projectId === project.projectId}
                />
              ))
            )}
          </div>

          {/* Project Details */}
          {selectedProject && <ProjectDetails project={selectedProject} />}
        </div>
      </div>
    </>
  );
};

const ProjectCard = ({ project, onClick, isSelected }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatBudgetDisplay = (budget) => {
    if (budget.type === "hourly") {
      return `${budget.hourly_rate.from}-${budget.hourly_rate.to}/hr`;
    }
    return `${budget.amount} USD`;
  };

  return (
    <div
      className={`project-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="project-header">
        <h3>{project.projectName}</h3>
        <span className="budget">{formatBudgetDisplay(project.budget)}</span>
      </div>

      <div className="freelancer-info">
        <img
          src={project?.freelancer?.image || "https://via.placeholder.com/40"}
          alt={project.freelancer.name}
          className="freelancer-image"
        />
        <div className="freelancer-details">
          <span className="name">{project.freelancer.name}</span>
          <div className="freelancer-meta">
            <span className="location">
              {project.freelancer.location?.country}
            </span>
            {/* <span className="rating">★ {project.freelancer.rating.toFixed(1)}</span> */}
          </div>
          <span className="status">
            Hired on {formatDate(project.startDate)}
          </span>
        </div>
      </div>

      <div className="skills">
        {project.preferred_skills &&
          project.preferred_skills.map((skill, index) => (
            <span key={index} className="skill">
              {skill}
            </span>
          ))}
      </div>

      <div className="project-footer">
        <div className="deadline">
          <Chat />
          <span>
            Due:{" "}
            {project.deadline
              ? formatDate(project.deadline)
              : "No deadline set"}
          </span>
        </div>
        <div className="milestone-count">
          <Chat />
          <span>{project.milestones?.length || 0} Milestones</span>
        </div>
      </div>
    </div>
  );
};

const ProjectDetails = ({ project, onProjectStatusChange }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setdescription] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkAsComplete = () => {
    // Instead of making the API call here, just show the modal
    setShowReviewModal(true);
  };

  const fetchProgress = async () => {
    // if (!projectId) return;

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const id = project.proposalDetails.Proposal_id._id;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      console.log("client id", userId);

      console.log("Id", project.proposalDetails.Proposal_id._id);

      const response = await axios.get(
        `http://localhost:5000/api/client/project-progress/${id}?client_id=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Progress :", response.data);
      setdescription(response.data.projectDetails.description);

      setProgressData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching progress:", err);
      setError(
        err.response?.data?.message || "Error fetching project progress"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "milestones") {
      fetchProgress();
    }
  }, [activeTab]);

  // const handleMarkAsCompleted = async (id, reviewData) => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/api/client/complete-project/${id}`,
  //       {
  //         stars: reviewData.rating, // Number between 1-5
  //         message: reviewData.review // Review text
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`
  //         }
  //       }
  //     );

  //     if (response.data.success) {
  //       // Update UI accordingly
  //       message.success('Project marked as completed and review submitted successfully');
  //       // Refresh project list or update state
  //       // You might want to call your fetchProgress function here to update the UI
  //     }
  //   } catch (error) {
  //     console.error('Error marking project as complete:', error);
  //     message.error(error.response?.data?.message || 'Failed to mark project as complete');
  //   }
  // };

  const handleReviewSubmit = async (id, reviewData) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Make the API call to mark project as completed with review
      const response = await axios.post(
        `http://localhost:5000/api/client/complete-project/${id}`,
        {
          stars: reviewData.rating,
          message: reviewData.review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success(
          "Project marked as completed and review submitted successfully"
        );
        setShowReviewModal(false);

        // Notify parent component about status change
        if (onProjectStatusChange) {
          onProjectStatusChange(project._id, "completed");
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatHourlyRate = (project) => {
    if (project.hourly_rate?.from && project.hourly_rate?.to) {
      return `${project.hourly_rate.from} - ${project.hourly_rate.to}/hr`;
    }
    return "Rate not specified";
  };

  const formatProjectDuration = (project) => {
    if (project.project_duration?.duration_of_work?.duration_of_work) {
      return project.project_duration.duration_of_work.duration_of_work;
    }
    return "Duration not specified";
  };

  const formatExperienceLevel = (project) => {
    if (project.project_duration?.duration_of_work?.experience_level) {
      return project.project_duration.duration_of_work.experience_level;
    }
    return "Experience level not specified";
  };

  const renderMilestonesContent = () => {
    if (loading) return <Spinner />;
    if (error)
      return (
        <Alert message="Error" description={error} type="error" showIcon />
      );
    if (!progressData)
      return <Empty description="No progress data available" />;

    const { progressData: progress } = progressData;

    return (
      <div className="milestone-progress">
        {/* Overall Progress Card with Progress Bar */}
        <Card className="overall-progress-card">
          <Title level={4}>Overall Project Progress</Title>
          <div className="progress-container">
            <Progress
              percent={progress.overallProgress}
              status="active"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              strokeWidth={15}
            />
          </div>
        </Card>

        {progress.overallProgress === 100 && (
          <Button
            type="primary"
            className="mark-complete-btn"
            onClick={handleMarkAsComplete}
          >
            Mark as Completed
          </Button>
        )}

        <Row gutter={[16, 16]} className="stats-cards">
          <Col span={8}>
            <Card>
              <Statistic
                title="Overall Progress"
                value={progress.overallProgress}
                suffix="%"
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Completed Milestones"
                value={progress.completedMilestones}
                suffix={`/ ${project.milestones?.length}`}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginTop: 16, marginBottom: 16 }}>
          <Statistic
            title="Project Description"
            value={description}
            valueStyle={{
              color: "#722ed1",
              fontSize: "14px",
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          />
          {description && description.length > 150 && (
            <Typography.Link
              onClick={() =>
                Modal.info({
                  title: "Project Description",
                  content: (
                    <Typography.Paragraph
                      style={{ maxHeight: "60vh", overflow: "auto" }}
                    >
                      {description}
                    </Typography.Paragraph>
                  ),
                  width: 600,
                })
              }
              style={{ marginTop: 8, display: "block" }}
            >
              Read More
            </Typography.Link>
          )}
        </Card>

        <div className="milestones-list">
          {progress.milestones.map((milestone, index) => (
            <Card
              key={index}
              className="milestone-card"
              style={{ marginTop: 16 }}
            >
              <Row justify="space-between" align="middle">
                <Col span={16}>
                  <Title level={4}>{milestone.name}</Title>
                  <Text type="secondary">
                    Due: {new Date(milestone.due_date).toLocaleDateString()}
                  </Text>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Tag
                    color={
                      milestone.status === "Completed"
                        ? "success"
                        : milestone.status === "In Progress"
                        ? "processing"
                        : "default"
                    }
                  >
                    {milestone.status}
                  </Tag>
                  <div style={{ marginTop: 8 }}>
                    <Text strong>${milestone.amount}</Text>
                  </div>
                </Col>
              </Row>
              <Progress
                percent={milestone.progress}
                status={
                  milestone.status === "Completed"
                    ? "success"
                    : milestone.status === "In Progress"
                    ? "active"
                    : "normal"
                }
                style={{ marginTop: 16 }}
              />
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="project-details">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === "milestones" ? "active" : ""}`}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones
        </button>
        <button
          className={`tab ${activeTab === "proposal" ? "active" : ""}`}
          onClick={() => setActiveTab("proposal")}
        >
          Proposal
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview">
            <div className="job-Card">
              <div className="header-job">
                <div>
                  <h3 className="job-Title">{project.job_title}</h3>
                  <p className="job-Location">{project.location || "Remote"}</p>
                  <p className="job-posted-Time">
                    <span className="posted-text">Started:</span>
                    <span className="time-text">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <hr className="divider" />

              <div className="job-infor">
                <span className="job-info-item">
                  <span className="labeltext">
                    {project.budget_type === "fixed"
                      ? "Fixed Price:"
                      : "Hourly Rate:"}
                  </span>
                  <span className="value">
                    <span className="value">{formatHourlyRate(project)}</span>
                  </span>
                </span>
                <span className="job-info-item">
                  <span className="labeltext">Project Duration:</span>
                  <span className="value">
                    {formatProjectDuration(project)}
                  </span>
                </span>
                <span className="job-info-item">
                  <span className="labeltext">Experience Level:</span>
                  <span className="value">
                    {formatExperienceLevel(project)}
                  </span>
                </span>
              </div>

              <h4 className="section-title">Project Overview:</h4>
              <p className="job-description">
                {project.description || "No description provided."}
              </p>

              {project.attachment && (
                <>
                  <h4 className="section-title">Attachment:</h4>
                  <div className="attachments">
                    <div className="attachment-item">
                      <div className="attachment-file">
                        <span className="file-icon">📄</span>
                        <span className="file-name">
                          {project.attachment.fileName}
                        </span>
                      </div>
                      <button
                        className="view-btn"
                        onClick={() => handleViewFile(project.attachment)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="eye-icon"
                          width="20"
                          height="20"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c7 0 10-9 10-9s-3-9-10-9-10 9-10 9 3 9 10 9z"
                          />
                        </svg>
                        View
                      </button>
                    </div>
                  </div>
                </>
              )}

              <h4 className="section-title">Skills and Expertise:</h4>
              <div className="skills">
                {project?.preferred_skills ? (
                  project.preferred_skills.map((skill) => (
                    <span key={skill} className="skill">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No skills specified</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "milestones" && renderMilestonesContent()}

        {activeTab === "proposal" && (
          <div className="proposal">
            <div className="proposal-header">
              <span className="proposal-status accepted">
                Proposal Accepted
              </span>
            </div>

            <div className="proposal-section">
              <h3>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 8h10M7 12h10M7 16h10" />
                </svg>
                Cover Letter
              </h3>
              <div className="cover-letter">
                <p>{project.proposalDetails.coverLetter}</p>
              </div>
            </div>

            <div className="proposal-details">
              <div className="detail-card">
                <div className="detail-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="label">Estimated Duration</span>
                <span className="value">
                  {project.proposalDetails.estimatedDuration}
                </span>
              </div>

              <div className="detail-card">
                <div className="detail-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="label">Proposed Rate</span>
                <span className="value rate">
                  ${project.proposalDetails.proposedRate}/hr
                </span>
              </div>

              {project.proposalDetails.attachments && (
                <div className="proposal-attachments">
                  <h4>Attachments</h4>
                  <div className="attachments-list">
                    {project.proposalDetails.attachments.map(
                      (attachment, index) => (
                        <div key={index} className="attachment-item">
                          <div className="file-icon">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="file-info">
                            <div className="file-name">{attachment.name}</div>
                            <div className="file-size">{attachment.size}</div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="proposal-actions">
              <button className="message-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message Freelancer
              </button>
            </div>
          </div>
        )}
      </div>



       {/* Add ReviewModal here */}
       <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={(reviewData) => handleReviewSubmit(id, reviewData)}
        freelancerName={project.freelancer?.name || 'Freelancer'}
        isSubmitting={isSubmitting}
      />
    </div>
  );


};

export default ManageProjectsByClient;
