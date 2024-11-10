const Project = require('../models/manageProject.model');
const mongoose = require('mongoose');
const Proposal= require('../models/proposal.model')
exports.createProject = async (req, res) => {
    try {
      // Verify authentication
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
  
      const {
        projectName,
        progress,
        due_date,
        milestones,
        budget,
        description,
        projectType,
        status,
        clientApproved,
        proposal_id,
        client_id,
        freelancer_id
      } = req.body;
  
      // Enhanced validation
      const requiredFields = {
        projectName,
        budget,
        due_date,
        client_id,
        freelancer_id
      };
  
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([field]) => field);
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
  
      // Validate ObjectIds
      const validateId = (id, fieldName) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid ${fieldName} format`);
        }
      };
  
      validateId(freelancer_id, 'freelancer ID');
      validateId(client_id, 'client ID');
      if (proposal_id) validateId(proposal_id, 'proposal ID');
  
      // Process milestones and calculate progress
      const processedMilestones = milestones?.map(milestone => ({
        name: milestone.name,
        status: milestone.status,
        amount: parseFloat(milestone.amount) || 0,
        due_date: milestone.due_date || due_date
      })) || [];
  
      // Calculate progress based on milestones
      let calculatedProgress = parseInt(progress) || 0;
      if (projectType === 'milestone' && processedMilestones.length > 0) {
        const completedMilestones = processedMilestones.filter(m => m.status === 'Completed').length;
        calculatedProgress = Math.round((completedMilestones / processedMilestones.length) * 100);
      }
  
      const projectData = {
        projectName,
        progress: calculatedProgress,
        due_date,
        milestones: processedMilestones,
        budget: parseFloat(budget),
        description: description || '',
        projectType: projectType || 'milestone',
        status: calculatedProgress === 100 ? 'Pending Approval' : (status || 'Ongoing'),
        clientApproved: clientApproved || false,
        proposal_id,
        client_id,
        freelancer_id
      };
  
      const project = new Project(projectData);
      await project.save();
  
      // Update related proposal if it exists
      if (proposal_id) {
        await Proposal.findByIdAndUpdate(proposal_id, {
          projectStatus: project.status
        });
      }
  
      res.status(201).json({
        success: true,
        data: project,
        message: project.status === 'Pending Approval' ? 
          'Project marked as pending approval' : 
          'Project created successfully',
        status: project.status
      });
  
    } catch (error) {
      console.error('Error in createProject:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
  
      res.status(500).json({
        success: false,
        message: error.message || 'Error processing project'
      });
    }
  };

// Get project details
exports.getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('client_id', 'name email')
      .populate('freelancer_id', 'name email')
      .populate('proposal_id');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Update milestone status
exports.updateMilestoneStatus = async (req, res) => {
  try {
    const { projectId, milestoneIndex } = req.params;
    const { status } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update the specific milestone
    if (project.milestones[milestoneIndex]) {
      project.milestones[milestoneIndex].status = status;
      
      // Calculate new progress based on completed milestones
      const completedMilestones = project.milestones.filter(m => m.status === 'Completed').length;
      project.progress = Math.round((completedMilestones / project.milestones.length) * 100);
      
      await project.save();

      res.status(200).json({
        success: true,
        data: project,
        message: 'Milestone status updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }
  } catch (error) {
    console.error('Error updating milestone status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating milestone status',
      error: error.message
    });
  }
};
