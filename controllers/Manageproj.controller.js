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
      projectId,
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
      freelancer_id, job_id
    } = req.body;

    // Enhanced validation
    const requiredFields = {
      projectName,
      budget,
      due_date,
      client_id,
      freelancer_id,
      job_id
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
      projectId,
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
      freelancer_id,
      job_id
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
exports.getClientJobsProgress = async (req, res) => {
  try {
    const { client_id } = req.params;

    // Verify authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate client ID
    if (!mongoose.Types.ObjectId.isValid(client_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID format'
      });
    }

    // Find all projects for the specific client
    const projects = await Project.find({ client_id })
      .populate( 'first_name last_name image title email')
      .populate('proposal_id')
      .select('projectName progress milestones status due_date budget projectType clientApproved')
      .sort({ createdAt: -1 });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found for this client'
      });
    }

    // Format the response data
    const formattedProjects = projects.map(project => ({
      projectId: project._id,
      projectName: project.projectName,
      overallProgress: project.progress,
      status: project.status,
      dueDate: project.due_date,
      budget: project.budget,
      projectType: project.projectType,
      clientApproved: project.clientApproved,
      freelancer: project.freelancer_profile_id ? {
        id: project.freelancer_profile_id._id,
        name: `${project.freelancer_profile_id.first_name} ${project.freelancer_profile_id.last_name}`,
        email: project.freelancer_profile_id.email,
        title: project.freelancer_profile_id.title,
        profilePicture: project.freelancer_profile_id.image
      } : null,
      milestones: project.milestones.map(milestone => ({
        name: milestone.name,
        status: milestone.status,
        amount: milestone.amount,
        dueDate: milestone.due_date
      }))
    }));

    res.status(200).json({
      success: true,
      data: formattedProjects,
      message: 'Projects progress fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching client jobs progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress details',
      error: error.message
    });
  }
};

exports.getSpecificJobProgress = async (req, res) => {
  try {
    const { client_id, project_id } = req.params;

    console.log("client_id", client_id)
    console.log("project_id", project_id)

    // Verify authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(client_id) || 
        !mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    // Find specific project
    const project = await Project.findOne({
      _id: project_id,
      client_id: client_id
    })
    .populate('freelancer_profile_id', 'first_name last_name image title email skills experience')
    .populate('proposal_id');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Format the response data
    const projectDetails = {
      projectId: project._id,
      projectName: project.projectName,
      overallProgress: project.progress,
      status: project.status,
      dueDate: project.due_date,
      budget: project.budget,
      projectType: project.projectType,
      clientApproved: project.clientApproved,
      description: project.description,
      freelancer: project.freelancer_profile_id ? {
        id: project.freelancer_profile_id._id,
        name: `${project.freelancer_profile_id.first_name} ${project.freelancer_profile_id.last_name}`,
        email: project.freelancer_profile_id.email,
        title: project.freelancer_profile_id.title,
        profilePicture: project.freelancer_profile_id.image,
        skills: project.freelancer_profile_id.skills,
        experience: project.freelancer_profile_id.experience
      } : null,
      milestones: project.milestones.map(milestone => ({
        name: milestone.name,
        status: milestone.status,
        amount: milestone.amount,
        dueDate: milestone.due_date
      })),
      proposal: project.proposal_id
    };

    res.status(200).json({
      success: true,
      data: projectDetails,
      message: 'Project progress fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching specific job progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress details',
      error: error.message
    });
  }
};




// exports.getProjectProgress = async (req, res) => {
//   try {
//     // Verify authentication
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     const { projectId } = req.params;
//     const { client_id } = req.query;

//     console.log("projectid",projectId)

//     // Validate IDs
//     if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(client_id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid project or client ID format'
//       });
//     } // Fetch project with populated freelancer profile details
//     const project = await Project.findOne({
//       _id: projectId,
//       client_id: client_id
//     }).populate({
//       path: 'freelancer_profile_id',
//       select: 'name email profilePicture rating hourlyRate skills'
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found or unauthorized access'
//       });
//     }
//  // Prepare response based on project type
//  let progressData;

//  if (project.projectType === 'milestone') {
//    // For milestone-based projects
//    const milestoneProgress = {
//      totalMilestones: project.milestones.length,
//      completedMilestones: project.milestones.filter(m => m.status === 'Completed').length,
//      milestones: project.milestones.map(milestone => ({
//        name: milestone.name,
//        status: milestone.status,
//        amount: milestone.amount,
//        due_date: milestone.due_date,
//        progress: milestone.status === 'Completed' ? 100 : 
//                 milestone.status === 'In Progress' ? 50 : 0
//      })),
//      overallProgress: project.progress,
//      lastUpdated: project.updatedAt
//    };   progressData = {
//     type: 'milestone',
//     ...milestoneProgress
//   };
// } else {
//   // For fixed projects
//   progressData = {
//     type: 'fixed',
//     progress: project.progress,
//     status: project.status,
//     lastUpdated: project.updatedAt
//   };
// }
//   // Prepare freelancer details safely
//   const freelancerDetails = project.freelancer_profile_id ? {
//     name: project.freelancer_profile_id.name,
//     email: project.freelancer_profile_id.email,
//     profilePicture: project.freelancer_profile_id.profilePicture,
//     rating: project.freelancer_profile_id.rating,
//     skills: project.freelancer_profile_id.skills,
//     hourlyRate: project.freelancer_profile_id.hourlyRate
//   } : null;

//   // Calculate time-based metrics
//   const now = new Date();
//   const startDate = new Date(project.createdAt);
//   const dueDate = new Date(project.due_date);
  
//   const timeMetrics = {
//     totalDays: Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24)),
//     daysElapsed: Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)),
//     daysRemaining: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)),
//     isOverdue: now > dueDate
//   }; const response = {
//     success: true,
//     projectDetails: {
//       projectId: project._id,
//       projectName: project.projectName,
//       description: project.description,
//       startDate: project.createdAt,
//       due_date: project.due_date,
//       budget: project.budget,
//       status: project.status,
//       clientApproved: project.clientApproved,
//       projectType: project.projectType
//     },
//     freelancerDetails,
//     progressData,
//     timeMetrics
//   };

//   res.status(200).json(response);} catch (error) {
//     console.error('Error in getProjectProgress:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching project progress',
//       error: error.message
//     });
//   }
// };

exports.getProjectProgress = async (req, res) => {
  try {
    // Verify authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { proposal_id } = req.params;
    const { client_id } = req.query;

    console.log("proposal_id", proposal_id);

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(proposal_id) || !mongoose.Types.ObjectId.isValid(client_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid proposal or client ID format'
      });
    }





  // Modified aggregation pipeline
    const project = await Project.aggregate([
      {
        $match: {
          proposal_id: new mongoose.Types.ObjectId(proposal_id),
          client_id: new mongoose.Types.ObjectId(client_id)
        }
      },
      {
        $lookup: {
          from: 'freelancerprofiles',
          localField: 'freelancer_id', // Make sure this matches your schema
          foreignField: '_id',
          as: 'freelancerInfo'
        }
      },
      {
        $lookup: {
          from: 'projectupdates',
          localField: '_id',
          foreignField: 'project_id',
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: 'latestUpdate'
        }
      },
      {
        $unwind: {
          path: '$freelancerInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { updatedAt: -1 }
      },
      {
        $limit: 1
      }
    ]).exec();

    if (!project || project.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized access'
      });
    }

    const currentProject = project[0];


// Prepare response based on project type
let progressData;

if (currentProject.projectType === 'milestone') {
  // For milestone-based projects
  const milestoneProgress = {
    totalMilestones: currentProject.milestones.length, // Direct access to milestones array
    completedMilestones: currentProject.milestones.filter(m => m.status === 'Completed').length,
    milestones: currentProject.milestones.map(milestone => ({
      name: milestone.name,
      status: milestone.status,
      amount: milestone.amount,
      due_date: milestone.due_date,
      progress: milestone.status === 'Completed' ? 100 : 
               milestone.status === 'In Progress' ? 50 : 0,
      last_updated: milestone.updatedAt
    })),
    overallProgress: currentProject.progress,
    lastUpdated: currentProject.updatedAt
  };
  
  progressData = {
    type: 'milestone',
    ...milestoneProgress
  };
} else {
  // For fixed projects
  progressData = {
    type: 'fixed',
    overallProgress: currentProject.progress,
    status: currentProject.status,
    lastUpdated: currentProject.updatedAt,
    totalMilestones: currentProject.milestones.length,
    completedMilestones: currentProject.milestones.filter(m => m.status === 'Completed').length,
    milestones: currentProject.milestones.map(milestone => ({
      name: milestone.name,
      status: milestone.status,
      amount: milestone.amount,
      due_date: milestone.due_date,
      progress: milestone.status === 'Completed' ? 100 : 
               milestone.status === 'In Progress' ? 50 : 0,
      last_updated: milestone.updatedAt
    })),
  };
}

    // Prepare freelancer details safely
    const freelancerDetails = currentProject.freelancerInfo ? {
      name: currentProject.freelancerInfo.name,
      email: currentProject.freelancerInfo.email,
      profilePicture: currentProject.freelancerInfo.profilePicture,
      rating: currentProject.freelancerInfo.rating,
      skills: currentProject.freelancerInfo.skills,
      hourlyRate: currentProject.freelancerInfo.hourlyRate,
      lastActive: currentProject.freelancerInfo.lastActive
    } : null;

    // Calculate time-based metrics
    const now = new Date();
    const startDate = new Date(currentProject.createdAt);
    const dueDate = new Date(currentProject.due_date);
    
    const timeMetrics = {
      totalDays: Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24)),
      daysElapsed: Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)),
      daysRemaining: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)),
      isOverdue: now > dueDate,
      lastUpdated: currentProject.latestUpdate[0]?.createdAt || currentProject.updatedAt
    };

    const response = {
      success: true,
      projectDetails: {
        projectId: currentProject._id,
        proposalId: currentProject.proposal_id,
        projectName: currentProject.projectName,
        description: currentProject.description,
        startDate: currentProject.createdAt,
        due_date: currentProject.due_date,
        budget: currentProject.budget,
        status: currentProject.status,
        clientApproved: currentProject.clientApproved,
        projectType: currentProject.projectType,
        lastModified: currentProject.updatedAt,
        latestUpdate: currentProject.latestUpdate[0] || null
      },
      freelancerDetails,
      progressData,
      timeMetrics,
      timestamp: new Date()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getProjectProgress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project progress',
      error: error.message
    });
  }
};