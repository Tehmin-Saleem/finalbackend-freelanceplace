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
      freelancer_id,
      source,
      paymentStatus,
    } = req.body;

    // Enhanced validation
    const requiredFields = {
      projectName,
      budget,
      due_date,
      client_id,
      freelancer_id,
      
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
   // Ensure proposal_id is valid or null


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
      paymentStatus,

    };
  
    if (proposal_id && proposal_id.trim() !== '' && source !== 'offer') {
      // Validate proposal_id before adding
      try {
        validateId(proposal_id, 'proposal ID');
        projectData.proposal_id = proposal_id;
      } catch (idError) {
        console.warn('Invalid proposal_id:', idError.message);
      }
    }
      if (source === 'offer') {
      const existingProject = await Project.findOne({ projectName, client_id, freelancer_id });

      if (existingProject) {
        // Update the existing project with the new data
        Object.assign(existingProject, projectData); // Merge the new data with existing project
        await existingProject.save();

        return res.status(200).json({
          success: true,
          data: existingProject,
          message: 'Project updated successfully',
          status: existingProject.status
        });
      }
    }

    // Create a new project if not updated
    const project = new Project(projectData);
    await project.save();

    if (proposal_id && proposal_id.trim() !== '' && source !== 'offer') {
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
    const { client_id, projectName } = req.query;

// Build match condition based on available parameters
let matchCondition;
if (proposal_id !== 'null' && proposal_id) {
  // For normal jobs with proposal_id
  matchCondition = {
    proposal_id: new mongoose.Types.ObjectId(proposal_id),
    client_id: new mongoose.Types.ObjectId(client_id)
  };
} else if (projectName) {
  // For offered jobs without proposal_id
  matchCondition = {
    projectName: projectName,
    client_id: new mongoose.Types.ObjectId(client_id),
    proposal_id: null // Specifically for offers
  };
} else {
  return res.status(400).json({
    success: false,
    message: 'Invalid request parameters'
  });
}





  // Modified aggregation pipeline
    const project = await Project.aggregate([
      {
        $match: matchCondition
      },
      {
        $lookup: {
          from: 'freelancer_profiles', // Collection name for Freelancer_Profile  
          localField: 'freelancer_profile_id', // Field in the Project collection  
          foreignField: '_id', // Field in the Freelancer_Profile collection  
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
        paymentStatus: currentProject.paymentStatus,
        paymentDetails: currentProject.paymentDetails,
        description: currentProject.description,
        startDate: currentProject.createdAt,
        due_date: currentProject.due_date,
        budget: currentProject.budget,
        status: currentProject.status,
        clientApproved: currentProject.clientApproved,
        paymentStatus:currentProject.paymentStatus,
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


exports.getProjectProgressById = async (req, res) => {
  try {
    // Verify authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { project_id } = req.params;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    // Fetch project with related data using aggregation
    const project = await Project.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(project_id)
        }
      },
      {
        $lookup: {
          from: 'freelancerprofiles',
          localField: 'freelancer_id',
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
      }
    ]).exec();

    if (!project || project.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const currentProject = project[0];

    // Calculate time metrics
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

    // Calculate milestone progress
    const milestoneStats = {
      total: currentProject.milestones.length,
      completed: currentProject.milestones.filter(m => m.status === 'Completed').length,
      inProgress: currentProject.milestones.filter(m => m.status === 'In Progress').length,
      pending: currentProject.milestones.filter(m => m.status === 'Pending').length
    };

    // Format milestone details
    const milestones = currentProject.milestones.map(milestone => ({
      name: milestone.name,
      status: milestone.status,
      amount: milestone.amount,
      due_date: milestone.due_date,
      progress: milestone.status === 'Completed' ? 100 : 
               milestone.status === 'In Progress' ? 50 : 0,
      isOverdue: now > new Date(milestone.due_date),
      daysRemaining: Math.ceil((new Date(milestone.due_date) - now) / (1000 * 60 * 60 * 24))
    }));

    const response = {
      success: true,
      data: {
        projectDetails: {
          projectId: currentProject._id,
          projectName: currentProject.projectName,
          description: currentProject.description,
          status: currentProject.status,
          projectType: currentProject.projectType,
          budget: currentProject.budget,
          overallProgress: currentProject.progress,
          clientApproved: currentProject.clientApproved,
          startDate: currentProject.createdAt,
          dueDate: currentProject.due_date
        },
        timeMetrics,
        progressDetails: {
          milestoneStats,
          milestones,
          latestUpdate: currentProject.latestUpdate[0] || null
        },
        freelancer: currentProject.freelancerInfo ? {
          id: currentProject.freelancerInfo._id,
          name: `${currentProject.freelancerInfo.first_name} ${currentProject.freelancerInfo.last_name}`,
          email: currentProject.freelancerInfo.email,
          title: currentProject.freelancerInfo.title,
          profilePicture: currentProject.freelancerInfo.image
        } : null
      },
      timestamp: new Date()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error in getProjectProgressById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project progress',
      error: error.message
    });
  }
};



// exports.getProgressByIds = async (req, res) => {
//   try {
//     // Verify authentication
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     const { client_id, proposal_id } = req.params;

//     // Validate IDs
//     const validateId = (id, fieldName) => {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid ${fieldName} format`
//         });
//       }
//     };

//     validateId(client_id, 'client ID');
//     validateId(proposal_id, 'proposal ID');

//     // First, get the proposal to find the associated project
//     const proposal = await Proposal.findById(proposal_id);
    
//     if (!proposal) {
//       return res.status(404).json({
//         success: false,
//         message: 'Proposal not found'
//       });
//     }

//     // Find project using aggregation pipeline
//     const project = await Project.aggregate([
//       {
//         $match: {
//           client_id: new mongoose.Types.ObjectId(client_id),
//           proposal_id: new mongoose.Types.ObjectId(proposal_id)
//         }
//       },
//       {
//         $lookup: {
//           from: 'projectupdates',
//           localField: '_id',
//           foreignField: 'project_id',
//           pipeline: [
//             { $sort: { createdAt: -1 } },
//             { $limit: 1 }
//           ],
//           as: 'latestUpdate'
//         }
//       },
//       {
//         $lookup: {
//           from: 'proposals',
//           localField: 'proposal_id',
//           foreignField: '_id',
//           as: 'proposalDetails'
//         }
//       },
//       {
//         $lookup: {
//           from: 'freelancerprofiles',
//           localField: 'freelancer_id',
//           foreignField: '_id',
//           as: 'freelancerInfo'
//         }
//       }
//     ]).exec();

//     if (!project || project.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found'
//       });
//     }

//     const currentProject = project[0];

//     // Calculate time-based metrics
//     const now = new Date();
//     const startDate = new Date(currentProject.createdAt);
//     const dueDate = new Date(currentProject.due_date);
    
//     const timeMetrics = {
//       totalDays: Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24)),
//       daysElapsed: Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)),
//       daysRemaining: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)),
//       isOverdue: now > dueDate,
//       lastUpdated: currentProject.latestUpdate[0]?.createdAt || currentProject.updatedAt
//     };

//     // Calculate milestone statistics
//     const milestoneStats = {
//       total: currentProject.milestones?.length || 0,
//       completed: currentProject.milestones?.filter(m => m.status === 'Completed').length || 0,
//       inProgress: currentProject.milestones?.filter(m => m.status === 'In Progress').length || 0,
//       pending: currentProject.milestones?.filter(m => m.status === 'Pending').length || 0
//     };

//     // Format milestone details
//     const formattedMilestones = currentProject.milestones?.map(milestone => ({
//       name: milestone.name,
//       status: milestone.status,
//       amount: milestone.amount,
//       due_date: milestone.due_date,
//       progress: milestone.status === 'Completed' ? 100 : 
//                milestone.status === 'In Progress' ? 50 : 0,
//       isOverdue: now > new Date(milestone.due_date),
//       daysRemaining: Math.ceil((new Date(milestone.due_date) - now) / (1000 * 60 * 60 * 24))
//     })) || [];

//     const response = {
//       success: true,
//       data: {
//         projectDetails: {
//           projectId: currentProject._id,
//           projectName: currentProject.projectName,
//           description: currentProject.description,
//           status: currentProject.status,
//           overallProgress: currentProject.progress,
//           projectType: currentProject.projectType,
//           budget: currentProject.budget,
//           clientApproved: currentProject.clientApproved,
//           startDate: currentProject.createdAt,
//           dueDate: currentProject.due_date
//         },
//         timeMetrics,
//         progressDetails: {
//           milestoneStats,
//           milestones: formattedMilestones
//         },
//         freelancerInfo: currentProject.freelancerInfo[0] ? {
//           name: `${currentProject.freelancerInfo[0].first_name} ${currentProject.freelancerInfo[0].last_name}`,
//           email: currentProject.freelancerInfo[0].email,
//           title: currentProject.freelancerInfo[0].title,
//           profilePicture: currentProject.freelancerInfo[0].image
//         } : null,
//         proposalDetails: currentProject.proposalDetails[0] || null,
//         latestUpdate: currentProject.latestUpdate[0] || null,
//         timestamp: new Date()
//       }
//     };

//     res.status(200).json(response);

//   } catch (error) {
//     console.error('Error in getProgressByIds:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching project progress',
//       error: error.message
//     });
//   }
// };



// exports.getProgressByIds = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     const { client_id, proposal_id } = req.params;

//     // Validate IDs
//     const validateId = (id, fieldName) => {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid ${fieldName} format`
//         });
//       }
//     };

//     validateId(client_id, 'client ID');
//     validateId(proposal_id, 'proposal ID');

//     // Find project using aggregation pipeline
//     const project = await Project.aggregate([
//       {
//         $match: {
//           client_id: new mongoose.Types.ObjectId(client_id),
//           proposal_id: new mongoose.Types.ObjectId(proposal_id)
//         }
//       },
//       {
//         $lookup: {
//           from: 'freelancerprofiles',
//           localField: 'freelancer_profile_id',
//           foreignField: '_id',
//           as: 'freelancerInfo'
//         }
//       },
//       {
//         $lookup: {
//           from: 'proposals',
//           localField: 'proposal_id',
//           foreignField: '_id',
//           as: 'proposalDetails'
//         }
//       }
//     ]).exec();

//     if (!project || project.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found'
//       });
//     }

//     const currentProject = project[0];

//     // Calculate time-based metrics
//     const now = new Date();
//     const startDate = new Date(currentProject.createdAt);
//     const dueDate = new Date(currentProject.due_date);
    
//     const timeMetrics = {
//       totalDays: Math.max(0, Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24))),
//       daysElapsed: Math.max(0, Math.ceil((now - startDate) / (1000 * 60 * 60 * 24))),
//       daysRemaining: Math.max(0, Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))),
//       isOverdue: now > dueDate
//     };

//     // Calculate milestone statistics and progress
//     const milestones = currentProject.milestones || [];
//     const totalMilestones = milestones.length;
//     const completedMilestones = milestones.filter(m => m.status === 'Completed').length;

//     // Calculate overall progress based on completed milestones
//     const overallProgress = totalMilestones > 0 
//       ? Math.round((completedMilestones / totalMilestones) * 100)
//       : 0;

//     // Update project progress in database
//     await Project.findByIdAndUpdate(currentProject._id, {
//       progress: overallProgress
//     });

//     const milestoneStats = {
//       total: totalMilestones,
//       completed: completedMilestones,
//       inProgress: milestones.filter(m => m.status === 'In Progress').length,
//       pending: milestones.filter(m => m.status === 'Not Started').length
//     };

//     // Format milestone details with progress calculation
//     const formattedMilestones = milestones.map(milestone => ({
//       name: milestone.name,
//       status: milestone.status,
//       amount: milestone.amount,
//       due_date: milestone.due_date,
//       progress: milestone.status === 'Completed' ? 100 : 
//                milestone.status === 'In Progress' ? 50 : 0,
//       isOverdue: now > new Date(milestone.due_date),
//       daysRemaining: Math.max(0, Math.ceil((new Date(milestone.due_date) - now) / (1000 * 60 * 60 * 24)))
//     }));

//     const response = {
//       success: true,
//       data: {
//         projectDetails: {
//           projectId: currentProject._id,
//           projectName: currentProject.projectName,
//           description: currentProject.description,
//           status: currentProject.status,
//           overallProgress: overallProgress,
//           projectType: currentProject.projectType,
//           budget: currentProject.budget,
//           clientApproved: currentProject.clientApproved,
//           startDate: currentProject.createdAt,
//           dueDate: currentProject.due_date
//         },
//         timeMetrics,
//         progressDetails: {
//           milestoneStats,
//           milestones: formattedMilestones
//         },
//         freelancerInfo: currentProject.freelancerInfo[0] || null,
//         proposalDetails: currentProject.proposalDetails[0] || null,
//         timestamp: new Date()
//       }
//     };

//     res.status(200).json(response);

//   } catch (error) {
//     console.error('Error in getProgressByIds:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching project progress',
//       error: error.message
//     });
//   }
// };

// exports.updateProjectProgress = async (req, res) => {
//   try {
//     const { project_id } = req.params;
//     const { progress, message, milestones } = req.body;

//     // Find the project
//     const project = await Project.findById(project_id);
//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found'
//       });
//     }

//     // Create progress history entry
//     const progressEntry = {
//       progress: progress,
//       updatedBy: "test-user-id", // Hardcoded for testing
//       updateMessage: message || '',
//       milestones: project.milestones.map(m => ({
//         milestone_id: m._id,
//         name: m.name,
//         status: m.status,
//         amount: m.amount,
//         due_date: m.due_date
//       })),
//       timestamp: new Date()
//     };

//     // Update project fields
//     project.progress = progress;
//     project.progressHistory.push(progressEntry);

//     // Update milestone statuses if provided
//     if (milestones && Array.isArray(milestones)) {
//       milestones.forEach(updatedMilestone => {
//         const milestone = project.milestones.id(updatedMilestone.milestone_id);
//         if (milestone) {
//           milestone.status = updatedMilestone.status;
//         }
//       });
//     }

//     // Save the updated project
//     await project.save();

//     res.status(200).json({
//       success: true,
//       data: project,
//       message: 'Progress updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating progress:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating progress',
//       error: error.message
//     });
//   }
// };



exports.getOfferProgress = async (req, res) => {
  try {
    const { client_id, projectName } = req.query;
    console.log('Fetching offer progress for:', { client_id, projectName });

    if (!client_id || !projectName) {
      return res.status(400).json({
        success: false,
        message: 'Client ID and project name are required'
      });
    }

    // Find the latest progress entry for the given client and project name
    const projectData = await Project.findOne({
      client_id: client_id,
      projectName: projectName,
      proposal_id: null // To ensure it's an offer progress
    })
    .populate('freelancer_profile_id', 'first_name last_name profile_image country_name')
    .sort({ createdAt: -1 });

    if (!projectData) {
      return res.status(404).json({
        success: false,
        message: 'No progress data found for this offer'
      });
    }

    // Calculate time metrics
    const now = new Date();
    const startDate = projectData.createdAt;
    const dueDate = projectData.due_date;
    
    const totalDays = Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    const isOverdue = now > dueDate;

    // Format milestones data
    const formattedMilestones = projectData.milestones.map(milestone => ({
      name: milestone.name,
      status: milestone.status,
      amount: milestone.amount,
      due_date: milestone.due_date,
      progress: milestone.status === "Completed" ? 100 : 
               milestone.status === "In Progress" ? 50 : 0
    }));

    // Calculate overall progress based on milestones
    const overallProgress = projectData.progress;

    // Format the response to match your existing structure
    const response = {
      success: true,
      data: {
        projectDetails: {
          projectId: projectData._id,
          projectName: projectData.projectName,
          description: projectData.description,
          status: projectData.status,
          budget: projectData.budget,
          paymentStatus: projectData.paymentStatus,
          clientApproved: projectData.clientApproved,
          paymentDetails: projectData.paymentDetails,
          freelancer: projectData.freelancer_profile_id ? {
            name: `${projectData.freelancer_profile_id.first_name} ${projectData.freelancer_profile_id.last_name}`,
            image: projectData.freelancer_profile_id.profile_image,
            country: projectData.freelancer_profile_id.country_name
          } : null
        },
        progressData: {
          type: projectData.projectType,
          overallProgress: overallProgress,
          lastUpdated: projectData.updatedAt,
          milestones: formattedMilestones,
          completedMilestones: formattedMilestones.filter(m => m.status === "Completed").length,
          totalMilestones: formattedMilestones.length
        },
        timeMetrics: {
          startDate,
          dueDate,
          totalDays,
          daysElapsed,
          daysRemaining,
          isOverdue,
          lastUpdated: projectData.updatedAt
        }
      }
    };

    console.log('Sending offer progress response:', response);
    res.status(200).json(response);

  } catch (error) {
    console.error('Error in getOfferProgress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offer progress',
      error: error.message
    });
  }
};