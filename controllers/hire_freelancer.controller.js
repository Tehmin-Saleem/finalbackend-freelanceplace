const HireFreelancer = require('../models/hire_freelancer.model');
const notificationController = require('../controllers/notifications.controller');
const Notification = require('../models/notifications.model');
const Proposal = require('../models/proposal.model');
const Job= require('../models/post_job.model')
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Freelancer_Profile = require('../models/freelancer_profile.model')


// Get hire request status by proposal ID
exports.getHireRequestById = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const clientId = req.user.userId;
   
    console.log('Received request for proposalId:', proposalId);
    console.log('Client ID:', clientId);


    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      console.log('Invalid proposalId format:', proposalId);
      return res.status(400).json({
        message: 'Invalid proposal ID format',
        receivedId: proposalId
      });
    }

    // Check existing hire request with proper population and logging
    const hireRequest = await HireFreelancer.findOne({ 
      proposalId: proposalId,
      clientId: clientId 
    }).populate({
      path: 'freelancerId',
      select: 'name email profile_image',
      options: { strictPopulate: false }
    }).populate({
      path: 'job',
      select: 'title description job_title',
      options: { strictPopulate: false }
    });

    console.log('Found hire request:', hireRequest);

  
    if (!hireRequest) {
      console.log('No hire request found, checking proposal');
      const proposal = await Proposal.findById(proposalId);
      
      if (!proposal) {
        console.log('Proposal not found for ID:', proposalId);
        return res.status(404).json({
          message: 'Proposal not found',
          proposalId: proposalId
        });
      }

      console.log('Found proposal:', proposal);
      return res.status(200).json({ 
        status: proposal.status,
        proposalId: proposalId,
        proposal: {
          id: proposal._id,
          status: proposal.status,
          freelancer_id: proposal.freelancer_id,
          job_id: proposal.job_id
        }
      });
    }

   
    const response = {
      status: hireRequest.status,
      hireRequest: {
        id: hireRequest._id,
        status: hireRequest.status,
        hiredAt: hireRequest.hiredAt,
        freelancerId: hireRequest.freelancerId?._id || hireRequest.freelancerId,
        freelancerName: hireRequest.freelancerId?.name,
        freelancerImage: hireRequest.freelancerId?.profile_image,
        jobId: hireRequest.jobId?._id || hireRequest.jobId,
        jobTitle: hireRequest.jobId?.job_title || hireRequest.jobId?.title,
        terms: hireRequest.terms
      },
      proposalId: proposalId
    };

    console.log('Sending response:', response);
    res.status(200).json(response);

  } catch (err) {
    console.error('Error fetching hire request:', err);
    console.error('Stack trace:', err.stack);
    
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid ID format',
        error: err.message,
        details: {
          kind: err.kind,
          value: err.value,
          path: err.path
        }
      });
    }

  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: err.message,
        details: Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message;
          return acc;
        }, {})
      });
    }

    res.status(500).json({ 
      message: 'Failed to fetch hire request status',
      error: err.message,
      proposalId: req.params.proposalId
    });
  }
};

// Create hire request
exports.hireFreelancer = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const clientId = req.user.userId;

    // Find and validate proposal
    const proposal = await Proposal.findById(proposalId)
      .populate('job_id')
      .populate('freelancer_id');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Check if already hired
    const existingHireRequest = await HireFreelancer.findOne({
      proposalId: proposalId,
      clientId: clientId
    });

    if (existingHireRequest) {
      return res.status(400).json({
        message: 'Freelancer is already hired for this proposal',
        status: existingHireRequest.status
      });
    }

    // Create new hire request
    const hireRequest = new HireFreelancer({
      proposalId: proposalId,
      clientId: clientId,
      freelancerId: proposal.freelancer_id._id,
      jobId: proposal.job_id._id,
      status: 'hired',
      hiredAt: new Date(),
      terms: {
        rate: proposal.hourly_rate,
        projectDuration: proposal.estimated_duration,
        startDate: new Date()
      }
    });

    // Save hire request
    await hireRequest.save();

    // Update proposal status
    proposal.status = 'hired';
    await proposal.save();


    // Update job status
    await Job.findByIdAndUpdate(proposal.job_id._id, {
      $set: {
        jobstatus: 'ongoing',
        hired_freelancer: proposal.freelancer_id._id
      }
    });

    // Create notification
    const notificationData = {
      freelancer_id: proposal.freelancer_id._id,
      client_id: clientId,
      job_id: proposal.job_id._id,
      message: `Congratulations! You've been hired for "${proposal.job_id.job_title}"`,
      type: 'hired'
    };

    const notification = await notificationController.createNotification(notificationData);

    res.status(200).json({
      message: 'Freelancer hired successfully',
      status: 'hired',
      hireRequest: {
        id: hireRequest._id,
        status: hireRequest.status,
        hiredAt: hireRequest.hiredAt
      }
    });

  } catch (error) {
    console.error('Error in hireFreelancer:', error);
    res.status(500).json({ 
      message: 'Failed to hire freelancer', 
      error: error.message 
    });
  }
};

exports.getAllHireData = async (req, res) => {
  try {
   
    const hireRequests = await HireFreelancer.find()
      .populate('proposalId', '_id')
      .populate('clientId', '_id name email') 
      .populate('freelancerId', '_id name email')
      .populate('jobId', '_id job_title') 
      .select('proposalId clientId freelancerId jobId status') 
      .sort({ _id: -1 });
console.log('hire request', hireRequests)
  
    const formattedResponse = hireRequests.map(hire => ({
      hireId: hire._id,
      proposalId: hire.proposalId?._id,
      clientId: hire.clientId ? {
        id: hire.clientId._id,
        name: hire.clientId.name,
        email: hire.clientId.email
      } : null,
      freelancerId: hire.freelancerId ? {
        id: hire.freelancerId._id,
        name: hire.freelancerId.name,
        email: hire.freelancerId.email
      } : null,
      jobId: hire.jobId ? {
        id: hire.jobId._id,
        title: hire.jobId.job_title
      } : null,
      status: hire.status
    }));

    res.status(200).json({
      success: true,
      count: formattedResponse.length,
      data: formattedResponse
    });

  } catch (error) {
    console.error('Error in getAllHireData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hire data',
      error: error.message
    });
  }
};


// Get all hire requests for a specific client
exports.getClientHireRequests = async (req, res) => {
  try {
    const clientId = req.user._id; // Assuming clientId is available in req.user

    const hireRequests = await HireFreelancer.find({ clientId }).populate('freelancerId jobId');

    res.status(200).json({ hireRequests });
  } catch (err) {
    console.error('Error fetching client hire requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single hire request by its ID
// exports.getHireRequestById = async (req, res) => {
//   try {
//     const { hireRequestId } = req.params;
//     const clientId = req.user._id;

//     const hireRequest = await HireFreelancer.findOne({ _id: hireRequestId, clientId }).populate('freelancerId jobId');

//     if (!hireRequest) {
//       return res.status(404).json({ message: 'Hire request not found or unauthorized' });
//     }

//     res.status(200).json({ hireRequest });
//   } catch (err) {
//     console.error('Error fetching hire request:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// Update a hire request
exports.updateHireRequest = async (req, res) => {
  try {
    const { hireRequestId } = req.params;
    const clientId = req.user._id;
    const updateData = req.body;

    const updatedHireRequest = await HireFreelancer.findOneAndUpdate(
      { _id: hireRequestId, clientId },
      updateData,
      { new: true }
    );

    if (!updatedHireRequest) {
      return res.status(404).json({ message: 'Hire request not found or unauthorized' });
    }

    res.status(200).json({ message: 'Hire request updated successfully', hireRequest: updatedHireRequest });
  } catch (err) {
    console.error('Error updating hire request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a hire request
exports.deleteHireRequest = async (req, res) => {
  try {
    const { hireRequestId } = req.params;
    const clientId = req.user._id;

    const deletedHireRequest = await HireFreelancer.findOneAndDelete({ _id: hireRequestId, clientId });

    if (!deletedHireRequest) {
      return res.status(404).json({ message: 'Hire request not found or unauthorized' });
    }

    res.status(200).json({ message: 'Hire request deleted successfully' });
  } catch (err) {
    console.error('Error deleting hire request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};






// exports.getFilteredJobs = async (req, res) => {
//   try {
//     const clientId = req.user.userId;
//     const { filter } = req.query;

//     console.log('Fetching jobs for clientId:', clientId);
//     console.log('Applied filter:', filter);

//     // Base query to find all jobs posted by this client
//     let query = { client_id: clientId }; // Changed from posted_by to client_id

//     console.log('Initial query:', query);

//     // First, let's check if we can find any jobs at all
//     const jobCount = await Job.countDocuments(query); // Changed from Job to Job_Post
//     console.log('Total jobs found:', jobCount);

//     // Fetch all jobs with detailed population
//     let jobs = await Job.find(query) // Changed from Job to Job_Post
//       .populate({
//         path: 'freelancer_id',
//         select: 'name email profile_image'
//       })
//       .populate({
//         path: 'client_id',
//         select: 'name email'
//       });

//     console.log('Jobs found:', jobs.length);

//     // Get hire requests
//     const hireRequests = await HireFreelancer.find({ clientId })
//       .populate('jobId')
//       .populate('proposalId');

//     console.log('Hire requests found:', hireRequests.length);

//     // Create a map of job IDs to their status
//     const jobStatusMap = new Map();
//     hireRequests.forEach(hire => {
//       if (hire.jobId) {
//         jobStatusMap.set(hire.jobId._id.toString(), hire.status);
//       }
//     });

//     // Map jobs with additional information
//     jobs = jobs.map(job => {
//       const jobData = job.toObject();
//       const hireStatus = jobStatusMap.get(job._id.toString());
      
//       // Use the jobstatus field from your model
//       let status = job.jobstatus || 'pending';
//       const hasHiredProposal = !!job.hired_freelancer;

//       return {
//         ...jobData,
//         status,
//         hasHiredProposal,
//         budget: job.budget_type === 'hourly' 
//           ? `${job.hourly_rate.from}-${job.hourly_rate.to}/hr`
//           : `${job.fixed_price}/fixed`,
//         duration: job.project_duration?.duration_of_work || 'Not specified',
//         experience: job.project_duration?.experience_level || 'Not specified',
//         skills: job.preferred_skills || []
//       };
//     });

//     // Apply filter if specified
//     if (filter && filter !== 'all') {
//       const filteredJobs = jobs.filter(job => {
//         switch (filter.toLowerCase()) {
//           case 'ongoing':
//             return job.jobstatus === 'ongoing' || !!job.hired_freelancer;
//           case 'completed':
//             return job.jobstatus === 'completed';
//           case 'pending':
//             return job.jobstatus === 'pending' && !job.hired_freelancer;
//           default:
//             return true;
//         }
//       });
//       console.log(`Jobs after ${filter} filter:`, filteredJobs.length);
//       jobs = filteredJobs;
//     }

//     // Log the final response
//     console.log('Sending response with jobs count:', jobs.length);

//     res.status(200).json({
//       success: true,
//       count: jobs.length,
//       data: jobs
//     });

//   } catch (error) {
//     console.error('Error in getFilteredJobs:', error);
//     console.error('Stack trace:', error.stack);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch filtered jobs',
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };



exports.getFilteredJobs = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const { filter } = req.query;
    const currentDate = new Date();

    console.log('Fetching jobs for clientId:', clientId);
    console.log('Applied filter:', filter);

    // Base query to find all jobs posted by this client
    let query = { client_id: clientId };

    // Fetch all jobs
    let jobs = await Job.find(query)
      .populate({
        path: 'client_id',
        select: 'name email profile_image'
      })
      .populate('hired_freelancer', 'name email profile_image')
      .lean();

    console.log('Found jobs:', jobs.length);

    // Get all proposals for these jobs
    const jobIds = jobs.map(job => job._id);
    const proposals = await Proposal.find({
      job_id: { $in: jobIds }
    })
    .populate({
      path: 'freelancer_id',
      select: 'name email profile_image'
    })
    .lean();

    // Get hire requests to check which jobs have hired freelancers
    const hireRequests = await HireFreelancer.find({
      jobId: { $in: jobIds },
      status: 'hired' // Only get successful hires
    }).lean();

    // Create a map of hired jobs
    const hiredJobsMap = new Map(
      hireRequests.map(hire => [hire.jobId.toString(), true])
    );

    // Enhance jobs with proposal and hire information
    jobs = jobs.map(job => {
      const jobId = job._id.toString();
      const jobProposals = proposals.filter(p => p.job_id.toString() === jobId);
      const isHired = hiredJobsMap.get(jobId) || !!job.hired_freelancer;
      
      // Calculate due date based on project duration
      let dueDate = null;
      if (job.createdAt && job.project_duration?.duration_of_work) {
        dueDate = new Date(job.createdAt);
        switch (job.project_duration.duration_of_work) {
          case 'Less than 1 month':
            dueDate.setMonth(dueDate.getMonth() + 1);
            break;
          case '1 to 3 months':
            dueDate.setMonth(dueDate.getMonth() + 3);
            break;
          case '3 to 6 months':
            dueDate.setMonth(dueDate.getMonth() + 6);
            break;
          default:
            dueDate.setMonth(dueDate.getMonth() + 1); // Default to 1 month
        }
      }

      // Determine job status based on hire status and due date
      let jobStatus;
      if (isHired) {
        jobStatus = 'ongoing';
      } else if (dueDate && currentDate > dueDate) {
        jobStatus = 'pending';
      } else {
        jobStatus = 'active';
      }

      return {
        ...job,
        status: jobStatus,
        isHired,
        dueDate,
        isPastDue: dueDate ? currentDate > dueDate : false,
        proposalCount: jobProposals.length,
        proposals: jobProposals.map(proposal => ({
          id: proposal._id,
          freelancer: {
            id: proposal.freelancer_id?._id,
            name: proposal.freelancer_id?.name,
            image: proposal.freelancer_id?.profile_image
          },
          coverLetter: proposal.cover_letter,
          projectDuration: proposal.project_duration,
          budget: proposal.add_requirements?.by_project?.bid_amount || 
                 proposal.add_requirements?.by_milestones?.reduce((sum, m) => sum + (m.amount || 0), 0),
          proposalType: proposal.add_requirements?.by_milestones ? 'Milestone' : 'Project'
        }))
      };
    });

    // Apply filter
    if (filter && filter !== 'all') {
      const filteredJobs = jobs.filter(job => {
        switch (filter.toLowerCase()) {
          case 'ongoing':
            // Show jobs where a freelancer has been hired
            return job.isHired;
          case 'pending':
            // Show jobs past their due date without a hired freelancer
            return !job.isHired && job.isPastDue;
          case 'active':
            // Show jobs that are neither hired nor past due
            return !job.isHired && !job.isPastDue;
          default:
            return true;
        }
      });
      console.log(`Jobs after ${filter} filter:`, filteredJobs.length);
      jobs = filteredJobs;
    }

    // Debug logging
    jobs.forEach(job => {
      console.log(`Job ${job._id}:`, {
        title: job.job_title,
        status: job.status,
        isHired: job.isHired,
        dueDate: job.dueDate,
        isPastDue: job.isPastDue,
        proposalCount: job.proposalCount
      });
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs.map(job => ({
        ...job,
        proposals: job.proposals.map(proposal => ({
          ...proposal,
          coverLetter: proposal.coverLetter?.substring(0, 100) + '...' // Truncate cover letter
        }))
      }))
    });

  } catch (error) {
    console.error('Error in getFilteredJobs:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered jobs',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};






// exports.getClientOngoingProjects = async (req, res) => {
//   try {
//     const clientId = req.user.userId;

//     // Validate client exists
//     const client = await User.findById(clientId);
//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: 'Client not found'
//       });
//     }

//     // Find all ongoing projects for this client
//     const ongoingProjects = await HireFreelancer.find({
//       clientId: clientId,
//       status: 'hired'
//     })
//     .populate({
//       path: 'freelancerId',
//       select: 'first_name last_name email country_name image'
//     })
//     .populate({
//       path: 'jobId',
//       select: 'job_title description budget_type hourly_rate fixed_price project_duration preferred_skills'
//     })
//     .populate({
//       path: 'proposalId',
//       select: 'cover_letter project_duration add_requirements'
//     })
//     .lean();

//     // Transform the data to match frontend requirements
//     const formattedProjects = ongoingProjects.map(project => {
//       // Calculate progress based on milestones if they exist
//       const milestones = project.proposalId.add_requirements?.by_milestones || [];
//       const progress = calculateProgress(milestones);
      
//       // Format budget display
//       const budget = formatBudget(project.jobId);
      
//       return {
//         projectId: project._id,
//         projectName: project.jobId.job_title,
//         description: project.jobId.description,
//         preferred_skills: project.jobId.preferred_skills, // Add this line
//         freelancer: {
//           id: project.freelancerId._id,
//           name: `${project.freelancerId.first_name} ${project.freelancerId.last_name}`,
//           email: project.freelancerId.email,
//           image : project.freelancerId.image,
//           location: {
//             country: project.freelancerId.country_name
//           }
//         },
//         budget,
//         progress,
//         startDate: project.hiredAt,
//         deadline: project.proposalId.add_requirements?.by_project?.due_date,
//         milestones: formatMilestones(project.proposalId.add_requirements?.by_milestones),
//         proposalDetails: {
//           coverLetter: project.proposalId.cover_letter,
//           estimatedDuration: project.proposalId.project_duration,
//           proposedRate: project.proposalId.add_requirements?.by_project?.bid_amount,
//           status: project.status
//         },
//         terms: project.terms || {}
//       };
//     });

//     res.status(200).json({
//       success: true,
//       count: formattedProjects.length,
//       data: formattedProjects
//     });

//   } catch (error) {
//     console.error('Error in getClientOngoingProjects:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch ongoing projects',
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

// // Helper functions
// const calculateProgress = (milestones) => {
//   if (!milestones || milestones.length === 0) return 0;
  
//   const totalMilestones = milestones.length;
//   const completedMilestones = milestones.filter(m => 
//     new Date(m.due_date) < new Date()
//   ).length;

//   return Math.round((completedMilestones / totalMilestones) * 100);
// };

// const formatBudget = (job) => {
//   if (job.budget_type === 'hourly') {
//     return `${job.hourly_rate?.from || 0}-${job.hourly_rate?.to || 0}/hr`;
//   }
//   return `${job.fixed_price || 0} USD`;
// };

// const formatMilestones = (milestones) => {
//   if (!milestones) return [];
  
//   return milestones.map(milestone => ({
//     id: milestone._id,
//     name: milestone.description,
//     amount: milestone.amount,
//     dueDate: milestone.due_date,
//     status: new Date(milestone.due_date) < new Date() ? 'completed' : 'pending'
//   }));
// };


exports.getClientOngoingProjects = async (req, res) => {
  try {
    const clientId = req.user.userId;

    // Validate client exists
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Find all ongoing projects for this client
    const ongoingProjects = await HireFreelancer.find({
      clientId: clientId,
      status: 'hired'
    })
    .populate({
      path: 'freelancerId',
      select: 'first_name last_name email country_name image'
    })
    .populate({
      path: 'jobId',
      select: 'job_title description budget_type hourly_rate fixed_price project_duration preferred_skills'
    })
    .populate({
      path: 'proposalId',
      select: 'cover_letter project_duration add_requirements'
    })

    // Get freelancer profiles for all freelancers
    const freelancerIds = ongoingProjects.map(project => project.freelancerId._id);
    const freelancerProfiles = await Freelancer_Profile.find({
      freelancer_id: { $in: freelancerIds }  })
    .lean();



    // Create a map of freelancer profiles
    const freelancerProfileMap = freelancerProfiles.reduce((map, profile) => {
      map[profile.freelancer_id.toString()] = profile;
      return map;
    }, {});


    // Transform the data to match frontend requirements
    const formattedProjects = ongoingProjects.map(project => {
      const freelancerProfile = freelancerProfileMap[project.freelancerId._id.toString()];
      return {
        budget_type: project.jobId.budget_type,
        hourly_rate: {
          from: project.jobId.hourly_rate?.from || 0,
          to: project.jobId.hourly_rate?.to || 0
        },
        fixed_price: project.jobId.fixed_price,
        project_duration: {
          duration: project.jobId.project_duration || 'Not specified',
          experience_level: project.jobId.experience_level || 'Not specified'
        },
        projectId: project._id,
        projectName: project.jobId.job_title,
        job_title: project.jobId.job_title,
        description: project.jobId.description,
        preferred_skills: project.jobId.preferred_skills || [],
        freelancer: {
          id: project.freelancerId._id,
          name: `${project.freelancerId.first_name} ${project.freelancerId.last_name}`,
          email: project.freelancerId.email,
          image: freelancerProfile?.image || null, // Get image from freelancer 
          location: {
            country: project.freelancerId.country_name || 'Not specified'
          }
        },
        budget_type: project.jobId.budget_type,
        budget: formatBudget(project.jobId),
        progress: 0, // Set a default value or calculate based on your logic
        startDate: project.hiredAt || new Date(),
        deadline: project.proposalId?.add_requirements?.by_project?.due_date || null,
        project_duration: {
          duration_of_work: project.jobId.project_duration || 'Not specified',
          experience_level: 'Not specified'
        },
        milestones: formatMilestones(project.proposalId?.add_requirements?.by_milestones || []),
        proposalDetails: {
          coverLetter: project.proposalId?.cover_letter || '',
          estimatedDuration: project.proposalId?.project_duration || '',
          proposedRate: project.proposalId?.add_requirements?.by_project?.bid_amount || 0,
          status: project.status || 'pending'
        }
      };
    });

    res.status(200).json({
      success: true,
      count: formattedProjects.length,
      data: formattedProjects
    });

  } catch (error) {
    console.error('Error in getClientOngoingProjects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ongoing projects',
      error: error.message
    });
  }
};

// Helper Functions
function formatBudget(job) {
  if (!job) return { amount: 0, type: 'fixed' };

  if (job.budget_type === 'hourly') {
    return {
      type: 'hourly',
      hourly_rate: {
        from: job.hourly_rate?.from || 0,
        to: job.hourly_rate?.to || 0
      }
    };
  }
  
  return {
    type: 'fixed',
    amount: job.fixed_price || 0
  };
}

function formatMilestones(milestones) {
  if (!Array.isArray(milestones)) return [];
  
  return milestones.map(milestone => ({
    id: milestone._id || String(Math.random()),
    name: milestone.description || 'Untitled Milestone',
    amount: milestone.amount || 0,
    dueDate: milestone.due_date || new Date(),
    status: milestone.status || 'pending'
  }));
}