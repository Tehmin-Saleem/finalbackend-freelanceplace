
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EditableProjectCard from "../../components/EditAbleProjectCard";
import Header from "../../components/Commoncomponents/Header";
import { useNavigate } from 'react-router-dom';

const ManageProjects = () => {
  const location = useLocation();
  const { jobData, proposalData } = location.state || {};
  const [projects, setProjects] = useState([]);
  const { freelancer_id, client_id } = location.state || {};
  const navigate = useNavigate();
  const extractMilestones = (data) => {
    // Try all possible paths where milestones might be stored
    const possiblePaths = [
      data?.add_requirements?.by_milestones,
      data?.by_milestones,
      data?.milestones,
      data?.proposal?.milestones,
      data?.proposal?.by_milestones,
      data?.proposal?.add_requirements?.by_milestones
    ];

    // Find the first path that contains a valid milestone array
    const milestones = possiblePaths.find(path => Array.isArray(path) && path.length > 0);
    
    return milestones || [];
  };
  useEffect(() => {
    if (proposalData) {
  
      const milestones = extractMilestones(proposalData);
    

      const transformedProject = {
        projectName: jobData?.job_title || jobData?.title || 'Untitled Project',
        freelancerName: getFullName(proposalData?.freelancerProfile) || 'Not specified',
        clientInfo: {
          clientName: jobData?.clientName || formatClientName(
            proposalData?.clientInfo,
            proposalData,
            jobData
          )
        },
        due_date: proposalData?.due_date || new Date().toISOString(),
        progress: 0,
        milestones: formatMilestones(milestones),
        budget: formatBudget(milestones) || 
        (jobData?.rate ? 
          `Fixed Price: $${parseFloat(jobData.rate.replace(/[^0-9.-]+/g, ''))}` : 
          'Not specified'),
        description: jobData?.description || '',
        proposal_id: proposalData?._id || proposalData?.id,
        client_id: client_id || proposalData?.clientInfo?._id || jobData?.client_id,
        freelancer_id: freelancer_id || proposalData?.freelancerProfile?._id || proposalData?.freelancer_id,
        projectType: milestones.length > 0 ? 'milestone' : 'fixed',
        status: 'Ongoing',
      
        clientApproved: false
      };
      
      console.log('6. Final Transformed Project:', transformedProject);
      setProjects([transformedProject]);
    }
  }, [proposalData, jobData, freelancer_id, client_id]);

  const getFullName = (profile) => {
    if (!profile) return 'Not specified';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Not specified';
  };

  const formatClientName = (clientInfo, proposalData, jobData) => {
    console.log('Formatting Client Name - Inputs:', { 
      clientInfo, 
     
      jobData 
    });
  
    const nameOptions = [
      // More aggressive extraction
      clientInfo?.name,
      clientInfo?.full_name,
      clientInfo?.firstName,
      clientInfo?.lastName,
      `${clientInfo?.firstName} ${clientInfo?.lastName}`.trim(),
      
      proposalData?.clientName,
      proposalData?.clientInfo?.name,
      `${proposalData?.clientInfo?.firstName} ${proposalData?.clientInfo?.lastName}`.trim(),
      
      jobData?.clientName,
      jobData?.client?.name,
      `${jobData?.client?.firstName} ${jobData?.client?.lastName}`.trim(),
      `${jobData?.client_first_name} ${jobData?.client_last_name}`.trim()
    ];
  
    const clientName = nameOptions.find(name => 
      name && 
      typeof name === 'string' && 
      name.trim() !== '' && 
      name.toLowerCase() !== 'not specified'
    );
  
    console.log('Extracted Client Name:', jobData.clientName);
    return clientName || 'Not specified';
  };
  
  const formatMilestones = (milestones) => {
    if (!Array.isArray(milestones) || milestones.length === 0) {
      return [];
    }

    return milestones.map((milestone, index) => {
      // Log each milestone's structure
      console.log(`Formatting milestone ${index}:`, milestone);
      
      return {
        name: milestone.description || milestone.name || milestone.milestone_name || `Milestone ${index + 1}`,
        status: milestone.status || 'Not Started',
        amount: parseFloat(milestone.amount || milestone.budget || 0) || 0,
        due_date: milestone.due_date || milestone.deadline || new Date().toISOString()
      };
    });
  };

  const formatBudget = (milestones) => {
    // If milestones exist and have a total amount, use milestone-based budget
    if (Array.isArray(milestones) && milestones.length > 0) {
      const totalAmount = milestones.reduce((sum, milestone) => 
        sum + (parseFloat(milestone.amount) || 0), 0);
      return `By Milestone: $${totalAmount.toFixed(2)}`;
    }
    
    // If no milestones, try to use the rate from the project data
    const rate = jobData?.rate || proposalData?.add_requirements?.byproject?.amount;
    
    if (rate) {
      const formattedRate = typeof rate === 'string' 
        ? parseFloat(rate.replace(/[^0-9.-]+/g, '')) 
        : parseFloat(rate);
      
      return formattedRate > 0 
        ? `Fixed Price: $${formattedRate.toFixed(2)}` 
        : 'Not specified';
    }
    
    return 'Not specified';
  };
  

  const handleSave = async (index, updatedProject) => {
    console.log('Saving project with updates:', updatedProject);
    try {
      const updatedProjects = [...projects];
      updatedProjects[index] = {
        ...updatedProject,
        
        proposal_id: updatedProject.source === 'offer' ? undefined : updatedProject.proposal_id,
        clientInfo: projects[index].clientInfo
      };
      setProjects(updatedProjects);
      navigate('/freelancersjobpage');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <>
      <Header/>
      <div className="manage-projects">
        
          
          

        <div className="project-list">
        
          {projects.map((project, index) => (
            <EditableProjectCard
              key={index}
              project={project}
              onSave={(updatedProject) => handleSave(index, updatedProject)}
              onComplete={(updatedProject) => handleSave(index, updatedProject)} 
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageProjects;