import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EditableProjectCard from "../../components/EditAbleProjectCard";
import Header from "../../components/Commoncomponents/Header";
import { useNavigate } from "react-router-dom";
const ManageProjects = () => {
  const location = useLocation();
  const { jobData, proposalData } = location.state || {};
  const [projects, setProjects] = useState([]);
  const { freelancer_id, client_id } = location.state || {};
  const navigate = useNavigate();
  useEffect(() => {
    if (proposalData) {
      const transformedProject = {
        projectName: jobData?.job_title || jobData?.title || "Untitled Project",
        freelancerName:
          getFullName(proposalData?.freelancerProfile) || "Not specified",
        clientInfo: {
          clientName:
            formatClientName(proposalData?.clientInfo) || "Not specified",
        },
        due_date: proposalData?.due_date || new Date().toISOString(),
        progress: 0,
        milestones: formatMilestones(proposalData?.add_requirements),
        budget: formatBudget(proposalData, jobData),
        description: jobData?.description || "",
        proposal_id: proposalData?._id || proposalData?.id,
        client_id:
          client_id || proposalData?.clientInfo?._id || jobData?.client_id,
        freelancer_id:
          freelancer_id ||
          proposalData?.freelancerProfile?._id ||
          proposalData?.freelancer_id,
        projectType: proposalData?.add_requirements?.by_milestones
          ? "milestone"
          : "fixed",
        status: "Ongoing",
        clientApproved: false,
      };

      console.log("Transformed project:", transformedProject);
      setProjects([transformedProject]);
    }
  }, [proposalData, jobData, freelancer_id, client_id]);

  const getFullName = (profile) => {
    if (!profile) return "Not specified";
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "Not specified";
  };

  const formatClientName = (clientInfo) => {
    if (!clientInfo) return "Not specified";
    if (clientInfo.name && clientInfo.name !== "Not specified") {
      return clientInfo.name;
    }
    if (clientInfo.first_name || clientInfo.last_name) {
      const firstName = clientInfo.first_name || "";
      const lastName = clientInfo.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || "Not specified";
    }
    return "Not specified";
  };

  const formatMilestones = (requirements) => {
    if (!requirements?.by_milestones) return [];
    return requirements.by_milestones.map((milestone) => ({
      name: milestone.description || "Milestone",
      status: "Not Started",
      amount: milestone.amount,
      due_date: milestone.due_date,
    }));
  };

  // Helper function to format budget
  const formatBudget = (proposalData, jobData) => {
    if (proposalData?.rate) return proposalData.rate;

    if (jobData?.budget_type === "fixed") {
      return `Fixed: ${jobData.fixed_price || "Not specified"}`;
    }

    if (jobData?.budget_type === "hourly") {
      const from = jobData.hourly_rate?.from;
      const to = jobData.hourly_rate?.to;
      if (from && to) {
        return `Hourly: $${from} - $${to}`;
      }
      return "Hourly: Rate not specified";
    }

    return "Not specified";
  };
  const handleSave = async (index, updatedProject) => {
    console.log("Saving project with updates:", updatedProject);
    try {
      const updatedProjects = [...projects];
      updatedProjects[index] = {
        ...updatedProject,
        clientInfo: projects[index].clientInfo,
      };
      setProjects(updatedProjects);
      navigate("/freelancersjobpage");
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="manage-projects">
        <header className="header">
          <h1>Manage Ongoing Projects</h1>
        </header>

        <div className="project-list">
          {projects.map((project, index) => (
            <EditableProjectCard
              key={index}
              project={project}
              onSave={(updatedProject) => handleSave(index, updatedProject)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageProjects;
