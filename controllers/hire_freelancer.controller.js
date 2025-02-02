const HireFreelancer = require("../models/hire_freelancer.model");
const notificationController = require("../controllers/notifications.controller");
const Notification = require("../models/notifications.model");
const Proposal = require("../models/proposal.model");
const Job = require("../models/post_job.model");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Freelancer_Profile = require("../models/freelancer_profile.model");
const Review = require("../models/review.model");
const consultantprofile = require("../models/consultantprofile");
const Client_Profile = require("../models/client_profile.model");
const Project = require("../models/manageProject.model");
const Offer_Form = require("../models/offer_form.model");

// Get hire request status by proposal ID
exports.getHireRequestById = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const clientId = req.user.userId;

    console.log("Received request for proposalId:", proposalId);
    console.log("Client ID:", clientId);

    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      console.log("Invalid proposalId format:", proposalId);
      return res.status(400).json({
        message: "Invalid proposal ID format",
        receivedId: proposalId,
      });
    }

    // Check existing hire request with proper population and logging
    const hireRequest = await HireFreelancer.findOne({
      proposalId: proposalId,
      clientId: clientId,
    })
      .populate({
        path: "freelancerId",
        select: "name email profile_image",
        options: { strictPopulate: false },
      })
      .populate({
        path: "job",
        select: "title description job_title",
        options: { strictPopulate: false },
      });

    console.log("Found hire request:", hireRequest);

    if (!hireRequest) {
      console.log("No hire request found, checking proposal");
      const proposal = await Proposal.findById(proposalId);

      if (!proposal) {
        console.log("Proposal not found for ID:", proposalId);
        return res.status(404).json({
          message: "Proposal not found",
          proposalId: proposalId,
        });
      }

      console.log("Found proposal:", proposal);
      return res.status(200).json({
        status: proposal.status,
        proposalId: proposalId,
        proposal: {
          id: proposal._id,
          status: proposal.status,
          freelancer_id: proposal.freelancer_id,
          job_id: proposal.job_id,
        },
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
        terms: hireRequest.terms,
      },
      proposalId: proposalId,
    };

    console.log("Sending response:", response);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching hire request:", err);
    console.error("Stack trace:", err.stack);

    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        error: err.message,
        details: {
          kind: err.kind,
          value: err.value,
          path: err.path,
        },
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: err.message,
        details: Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message;
          return acc;
        }, {}),
      });
    }

    res.status(500).json({
      message: "Failed to fetch hire request status",
      error: err.message,
      proposalId: req.params.proposalId,
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
      .populate("job_id")
      .populate("freelancer_id");

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Check if already hired
    const existingHireRequest = await HireFreelancer.findOne({
      proposalId: proposalId,
      clientId: clientId,
    });

    if (existingHireRequest) {
      return res.status(400).json({
        message: "Freelancer is already hired for this proposal",
        status: existingHireRequest.status,
      });
    }

    // Create new hire request
    const hireRequest = new HireFreelancer({
      proposalId: proposalId,
      clientId: clientId,
      freelancerId: proposal.freelancer_id._id,
      jobId: proposal.job_id._id,
      status: "hired",
      hiredAt: new Date(),
      terms: {
        rate: proposal.hourly_rate,
        projectDuration: proposal.estimated_duration,
        startDate: new Date(),
      },
    });

    // Save hire request
    await hireRequest.save();

    // Update proposal status
    proposal.status = "hired";
    await proposal.save();

    // Update job status
    await Job.findByIdAndUpdate(proposal.job_id._id, {
      $set: {
        jobstatus: "ongoing",
        hired_freelancer: proposal.freelancer_id._id,
      },
    });

    // Create notification
    const notificationData = {
      freelancer_id: proposal.freelancer_id._id,
      client_id: clientId,
      sender_id: clientId,
      receiver_id: proposal.freelancer_id._id,
      job_id: proposal.job_id._id,
      message: `Congratulations! You've been hired for "${proposal.job_id.job_title}"`,
      type: "hired",
    };

    const notification =
      await notificationController.createNotification(notificationData);

    res.status(200).json({
      message: "Freelancer hired successfully",
      status: "hired",
      hireRequest: {
        id: hireRequest._id,
        status: hireRequest.status,
        hiredAt: hireRequest.hiredAt,
      },
    });
  } catch (error) {
    console.error("Error in hireFreelancer:", error);
    res.status(500).json({
      message: "Failed to hire freelancer",
      error: error.message,
    });
  }
};

exports.getAllHireData = async (req, res) => {
  try {
    const hireRequests = await HireFreelancer.find()
      .populate("proposalId", "_id")
      .populate("clientId", "_id name email")
      .populate("freelancerId", "_id name email")
      .populate("jobId", "_id job_title")
      .select("proposalId clientId freelancerId jobId status")
      .sort({ _id: -1 });
    console.log("hire request", hireRequests);

    const formattedResponse = hireRequests.map((hire) => ({
      hireId: hire._id,
      proposalId: hire.proposalId?._id,
      clientId: hire.clientId
        ? {
            id: hire.clientId._id,
            name: hire.clientId.name,
            email: hire.clientId.email,
          }
        : null,
      freelancerId: hire.freelancerId
        ? {
            id: hire.freelancerId._id,
            name: hire.freelancerId.name,
            email: hire.freelancerId.email,
          }
        : null,
      jobId: hire.jobId
        ? {
            id: hire.jobId._id,
            title: hire.jobId.job_title,
          }
        : null,
      status: hire.status,
    }));

    res.status(200).json({
      success: true,
      count: formattedResponse.length,
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Error in getAllHireData:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hire data",
      error: error.message,
    });
  }
};

// Get all hire requests for a specific client
exports.getClientHireRequests = async (req, res) => {
  try {
    const clientId = req.user._id; // Assuming clientId is available in req.user

    const hireRequests = await HireFreelancer.find({ clientId }).populate(
      "freelancerId jobId"
    );

    res.status(200).json({ hireRequests });
  } catch (err) {
    console.error("Error fetching client hire requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
      return res
        .status(404)
        .json({ message: "Hire request not found or unauthorized" });
    }

    res.status(200).json({
      message: "Hire request updated successfully",
      hireRequest: updatedHireRequest,
    });
  } catch (err) {
    console.error("Error updating hire request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a hire request
exports.deleteHireRequest = async (req, res) => {
  try {
    const { hireRequestId } = req.params;
    const clientId = req.user._id;

    const deletedHireRequest = await HireFreelancer.findOneAndDelete({
      _id: hireRequestId,
      clientId,
    });

    if (!deletedHireRequest) {
      return res
        .status(404)
        .json({ message: "Hire request not found or unauthorized" });
    }

    res.status(200).json({ message: "Hire request deleted successfully" });
  } catch (err) {
    console.error("Error deleting hire request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFilteredJobs = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const { filter } = req.query;
    const currentDate = new Date();

    console.log("Fetching jobs for clientId:", clientId);
    console.log("Applied filter:", filter);

    // Base query to find all jobs posted by this client
    let query = { client_id: clientId };

    // Fetch all jobs
    let jobs = await Job.find(query)

      .sort({ createdAt: -1 })
      .populate({
        path: "client_id",
        select: "name email profile_image",
      })
      .populate("hired_freelancer", "name email profile_image")
      .lean();

    console.log("Found jobs:", jobs.length);

    // Get all proposals for these jobs
    const jobIds = jobs.map((job) => job._id);
    const proposals = await Proposal.find({
      job_id: { $in: jobIds },
    })
      .populate({
        path: "freelancer_id",
        select: "name email profile_image",
      })
      .lean();

    // Get hire requests to check which jobs have hired freelancers
    const hireRequests = await HireFreelancer.find({
      jobId: { $in: jobIds },
      status: "hired", // Only get successful hires
    }).lean();

    // Create a map of hired jobs
    const hiredJobsMap = new Map(
      hireRequests.map((hire) => [hire.jobId.toString(), true])
    );

    // Enhance jobs with proposal and hire information
    jobs = jobs.map((job) => {
      const jobId = job._id.toString();
      const jobProposals = proposals.filter(
        (p) => p.job_id.toString() === jobId
      );
      const isHired = hiredJobsMap.get(jobId) || !!job.hired_freelancer;

      // Calculate due date based on project duration
      let dueDate = null;
      if (job.createdAt && job.project_duration?.duration_of_work) {
        dueDate = new Date(job.createdAt);
        switch (job.project_duration.duration_of_work) {
          case "Less than 1 month":
            dueDate.setMonth(dueDate.getMonth() + 1);
            break;
          case "1 to 3 months":
            dueDate.setMonth(dueDate.getMonth() + 3);
            break;
          case "3 to 6 months":
            dueDate.setMonth(dueDate.getMonth() + 6);
            break;
          default:
            dueDate.setMonth(dueDate.getMonth() + 1); // Default to 1 month
        }
      }

      // Determine job status based on hire status and due date
      let jobStatus;
      if (isHired) {
        jobStatus = "ongoing";
      } else if (dueDate && currentDate > dueDate) {
        jobStatus = "pending";
      } else {
        jobStatus = "active";
      }

      return {
        ...job,
        status: jobStatus,
        isHired,
        dueDate,
        isPastDue: dueDate ? currentDate > dueDate : false,
        proposalCount: jobProposals.length,
        proposals: jobProposals.map((proposal) => ({
          id: proposal._id,
          freelancer: {
            id: proposal.freelancer_id?._id,
            name: proposal.freelancer_id?.name,
            image: proposal.freelancer_id?.profile_image,
          },
          coverLetter: proposal.cover_letter,
          projectDuration: proposal.project_duration,
          budget:
            proposal.add_requirements?.by_project?.bid_amount ||
            proposal.add_requirements?.by_milestones?.reduce(
              (sum, m) => sum + (m.amount || 0),
              0
            ),
          proposalType: proposal.add_requirements?.by_milestones
            ? "Milestone"
            : "Project",
        })),
      };
    });

    // Apply filter
    if (filter && filter !== "all") {
      const filteredJobs = jobs.filter((job) => {
        switch (filter.toLowerCase()) {
          case "ongoing":
            // Show jobs where a freelancer has been hired
            return job.isHired;
          case "pending":
            // Show jobs past their due date without a hired freelancer
            return !job.isHired && job.isPastDue;
          case "active":
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
    jobs.forEach((job) => {
      console.log(`Job ${job._id}:`, {
        title: job.job_title,
        status: job.status,
        isHired: job.isHired,
        dueDate: job.dueDate,
        isPastDue: job.isPastDue,
        proposalCount: job.proposalCount,
      });
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs.map((job) => ({
        ...job,
        proposals: job.proposals.map((proposal) => ({
          ...proposal,
          coverLetter: proposal.coverLetter?.substring(0, 100) + "...", // Truncate cover letter
        })),
      })),
    });
  } catch (error) {
    console.error("Error in getFilteredJobs:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filtered jobs",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

exports.getClientOngoingProjects = async (req, res) => {
  try {
    const clientId = req.user.userId;

    // Validate client exists
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Find all ongoing projects for this client
    const ongoingProjects = await HireFreelancer.find({
      clientId: clientId,
      status: "hired",
    })
      .populate({
        path: "freelancerId",
        select: "first_name last_name email country_name image",
      })
      .populate({
        path: "jobId",
        select:
          "job_title description budget_type hourly_rate fixed_price project_duration preferred_skills",
      })
      .populate({
        path: "proposalId",
        select: "Proposal_id cover_letter project_duration add_requirements",
      });

    // Get freelancer profiles for all freelancers
    const freelancerIds = ongoingProjects.map(
      (project) => project.freelancerId._id
    );
    const freelancerProfiles = await Freelancer_Profile.find({
      freelancer_id: { $in: freelancerIds },
    }).lean();

    // Create a map of freelancer profiles
    const freelancerProfileMap = freelancerProfiles.reduce((map, profile) => {
      map[profile.freelancer_id.toString()] = profile;
      return map;
    }, {});

    // Transform the data to match frontend requirements
    const formattedProjects = ongoingProjects.map((project) => {
      const freelancerProfile =
        freelancerProfileMap[project.freelancerId._id.toString()];
      const jobId = project.jobId;

      return {
        budget_type: jobId ? jobId.budget_type : "unknown",
        hourly_rate: {
          from: jobId?.hourly_rate?.from || 0,
          to: jobId?.hourly_rate?.to || 0,
        },
        fixed_price: jobId ? jobId.fixed_price : 0,
        project_duration: {
          duration: jobId ? jobId.project_duration : "Not specified",
          experience_level: jobId ? jobId.experience_level : "Not specified",
        },
        projectId: project._id,
        projectName: jobId ? jobId.job_title : "Unknown Project",
        job_title: jobId ? jobId.job_title : "Unknown Job",
        description: jobId ? jobId.description : "No description",
        preferred_skills: jobId ? jobId.preferred_skills : [],
        freelancer: {
          id: project.freelancerId._id,
          name: `${project.freelancerId.first_name} ${project.freelancerId.last_name}`,
          email: project.freelancerId.email,
          image: freelancerProfile?.image || null, // Get image from freelancer
          location: {
            country: project.freelancerId.country_name || "Not specified",
          },
        },
        budget_type: jobId ? jobId.budget_type : "unknown",
        budget: formatBudget(jobId),
        progress: 0, // Set a default value or calculate based on your logic
        startDate: project.hiredAt || new Date(),
        deadline:
          project.proposalId?.add_requirements?.by_project?.due_date || null,
        project_duration: {
          duration_of_work: jobId ? jobId.project_duration : "Not specified",
          experience_level: "Not specified",
        },
        milestones: formatMilestones(
          project.proposalId?.add_requirements?.by_milestones || []
        ),
        proposalDetails: {
          Proposal_id: project.proposalId || "",
          coverLetter: project.proposalId?.cover_letter || "",
          estimatedDuration: project.proposalId?.project_duration || "",
          proposedRate:
            project.proposalId?.add_requirements?.by_project?.bid_amount || 0,
          status: project.status || "pending",
        },
      };
    });
    console.log("formatted projects", formattedProjects);
    res.status(200).json({
      success: true,
      count: formattedProjects.length,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("Error in getClientOngoingProjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ongoing projects",
      error: error.message,
    });
  }
};

// Helper Functions
function formatBudget(job) {
  if (!job) return { amount: 0, type: "fixed" };

  if (job.budget_type === "hourly") {
    return {
      type: "hourly",
      hourly_rate: {
        from: job.hourly_rate?.from || 0,
        to: job.hourly_rate?.to || 0,
      },
    };
  }

  return {
    type: "fixed",
    amount: job.fixed_price || 0,
  };
}

function formatMilestones(milestones) {
  if (!Array.isArray(milestones)) return [];

  return milestones.map((milestone) => ({
    id: milestone._id || String(Math.random()),
    name: milestone.description || "Untitled Milestone",
    amount: milestone.amount || 0,
    dueDate: milestone.due_date || new Date(),
    status: milestone.status || "pending",
  }));
}

exports.getHiredFreelancersCountByClientId = async (req, res) => {
  try {
    // Extract clientId from the request parameters or query
    const { clientId } = req.params;

    // Find the count of hire requests where freelancers have been hired by the specified clientId
    // Assuming that there is a field in HireRequest model to indicate hiring status, e.g., 'status': 'hired'
    const hiredFreelancersCount = await HireFreelancer.countDocuments({
      clientId: clientId,
      status: "hired", // Adjust the status field value as per your data schema
    });

    // Send the count as a response
    res.status(200).json({ hiredFreelancersCount });
  } catch (error) {
    console.error("Error fetching hired freelancers count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFreelancersEngagedCountByClientId = async (req, res) => {
  try {
    // Extract clientId from the request parameters
    const { clientId } = req.params;

    // Find the count of hire requests where freelancers are engaged by the specified clientId
    // Assuming that there is a field in HireFreelancer model to indicate engagement status, e.g., 'status': 'engaged'
    const freelancersEngagedCount = await HireFreelancer.countDocuments({
      clientId: clientId,
      status: "hired", // Adjust the status field value as per your data schema
    });

    // Send the count as a response
    res.status(200).json({ freelancersEngagedCount });
  } catch (error) {
    console.error("Error fetching engaged freelancers count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFreelancerHiredJobs = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const hiredJobs = await HireFreelancer.find({
      freelancerId: freelancerId,
      status: "hired",
    })

      .populate(
        "jobId",
        "_id job_title description budget deadline category skills"
      ) // Note: _id is already included
      .populate("clientId", "_id name email company")
      .populate("proposalId", "_id proposal_description bid_amount")
      .populate("freelancerId", "_id name email")
      .select("proposalId clientId freelancerId jobId status")
      .sort({ _id: -1 });

    const formattedResponse = hiredJobs.map((hire) => ({
      hireId: hire._id,
      job: hire.jobId
        ? {
            id: hire.jobId._id, // Already included job ID
            jobId: hire.jobId._id, // Adding explicit jobId field
            title: hire.jobId.job_title,
            description: hire.jobId.description,
            budget: hire.jobId.budget,
            deadline: hire.jobId.deadline,
            category: hire.jobId.category,
            skills: hire.jobId.skills,
          }
        : null,
      client: hire.clientId
        ? {
            id: hire.clientId._id,
            name: hire.clientId.name,
            email: hire.clientId.email,
            company: hire.clientId.company,
          }
        : null,
      proposal: hire.proposalId
        ? {
            id: hire.proposalId._id,
            description: hire.proposalId.proposal_description,
            bidAmount: hire.proposalId.bid_amount,
          }
        : null,
      status: hire.status,
      hiredDate: hire._id.getTimestamp(),
    }));

    res.status(200).json({
      success: true,
      count: formattedResponse.length,
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Error in getFreelancerHiredJobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancer's hired jobs",
      error: error.message,
    });
  }
};

exports.getAllHireData = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    // if (!freelancerId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Freelancer ID is required'
    //   });
    // }

    // Fetch and count hire requests where the status is "hired" for the specified freelancer
    const hiredJobCount = await HireFreelancer.countDocuments({
      freelancerId: freelancerId,
      status: "hired",
    });

    const hireRequests = await HireFreelancer.find()
      .populate("proposalId", "_id")
      .populate("clientId", "_id name email")
      .populate("freelancerId", "_id name email")
      .populate("jobId", "_id job_title")
      .select("proposalId clientId freelancerId jobId status")
      .sort({ _id: -1 });
    console.log("hire request", hireRequests);

    const formattedResponse = hireRequests.map((hire) => ({
      hireId: hire._id,
      proposalId: hire.proposalId?._id,
      clientId: hire.clientId
        ? {
            id: hire.clientId._id,
            name: hire.clientId.name,
            email: hire.clientId.email,
          }
        : null,
      freelancerId: hire.freelancerId
        ? {
            id: hire.freelancerId._id,
            name: hire.freelancerId.name,
            email: hire.freelancerId.email,
          }
        : null,
      jobId: hire.jobId
        ? {
            id: hire.jobId._id,
            title: hire.jobId.job_title,
          }
        : null,
      status: hire.status,
    }));

    res.status(200).json({
      success: true,
      count: formattedResponse.length,
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Error in getAllHireData:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hire data",
      error: error.message,
    });
  }
};

exports.getFreelancerHiredJobs = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    if (!freelancerId) {
      return res.status(400).json({
        success: false,
        message: "Freelancer ID is required",
      });
    }

    // Calculate the count of distinct hired jobs for the freelancer
    const hiredJobsCount = await HireFreelancer.countDocuments({
      freelancerId: freelancerId,
      status: "hired",
    });
    console.log("gired count freelancer", hiredJobsCount);

    // Fetch details of the hired jobs
    const hiredJobs = await HireFreelancer.find({
      freelancerId: freelancerId,
      status: "hired",
    })
      .populate(
        "jobId",
        "_id job_title description budget deadline category skills"
      )
      .populate("clientId", "_id name email company")
      .populate({
        path: "proposalId",
        select:
          "_id add_requirements cover_letter project_duration portfolio_link attachment",
      })
      .sort({ _id: -1 });

    console.log("hired jobs", hiredJobs);

    const formattedResponse = hiredJobs.map((hire) => ({
      hireId: hire._id,
      job: hire.jobId
        ? {
            id: hire.jobId._id,
            jobId: hire.jobId._id,
            title: hire.jobId.job_title,
            description: hire.jobId.description,
            budget: hire.jobId.budget,
            deadline: hire.jobId.deadline,
            category: hire.jobId.category,
            skills: hire.jobId.skills,
          }
        : null,
      client: hire.clientId
        ? {
            id: hire.clientId._id,
            name: hire.clientId.name,
            email: hire.clientId.email,
            company: hire.clientId.company,
          }
        : null,
      proposal: hire.proposalId
        ? {
            id: hire.proposalId._id,
            proposalId: hire.proposalId._id,
            coverLetter: hire.proposalId.cover_letter,
            projectDuration: hire.proposalId.project_duration,
            portfolioLink: hire.proposalId.portfolio_link,
            attachment: hire.proposalId.attachment,
            milestones:
              hire.proposalId.add_requirements?.by_milestones?.map(
                (milestone) => ({
                  amount: milestone.amount,
                  description: milestone.description,
                  dueDate: milestone.due_date,
                })
              ) || [],
            projectBid: hire.proposalId.add_requirements?.by_project
              ? {
                  bidAmount:
                    hire.proposalId.add_requirements.by_project.bid_amount,
                  dueDate: hire.proposalId.add_requirements.by_project.due_date,
                }
              : null,
          }
        : null,
      status: hire.status,
      hiredDate: hire._id.getTimestamp(),
    }));

    res.status(200).json({
      success: true,
      count: hiredJobsCount,
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Error in getFreelancerHiredJobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancer's hired jobs",
      error: error.message,
    });
  }
};

// mark as completed controller

// In hire_freelancer.controller.js
// In hire_freelancer.controller.js

exports.markProjectAsCompleted = async (req, res) => {
  try {
    const { projectId } = req.params;
    const clientId = req.user.userId;
    const { stars, message } = req.body;

    console.log("project id", projectId)
    console.log("client id", clientId)

    // Validate required fields
    if (!stars || !message) {
      return res.status(400).json({
        success: false,
        message: 'Rating (stars) and review message are required'
      });
    }

    // Validate stars range
    if (stars < 1 || stars > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5 stars'
      });
    }

    // _id: projectId,
    // Find the hire request
    const hireRequest = await HireFreelancer.findOne({
      clientId: clientId,
      status: 'hired' // Only allow completing projects that are currently hired
    }).populate('jobId freelancerId');

    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized'
      });
    }

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update hire request status
      hireRequest.status = 'completed';
      hireRequest.completedAt = new Date();
      await hireRequest.save({ session });

      // Update job status
      await Job.findByIdAndUpdate(
        hireRequest.jobId._id,
        {
          $set: {
            jobstatus: 'completed',
            completion_date: new Date()
          }
        },
        { session }
      );

      // Create review document using your Review model
      const reviewData = new Review({
        client_id: clientId,
        freelancer_id: hireRequest.freelancerId._id,
        job_id: hireRequest.jobId._id,
        message: message,
        stars: stars,
        status: 'Completed',
        createdAt: new Date(),
        updated_at: new Date()
      });

      await reviewData.save({ session });

     
      await Freelancer_Profile.findOneAndUpdate(
        { freelancer_id: hireRequest.freelancerId._id },
        {
          $inc: {
            completed_jobs: 1,
            total_earnings: hireRequest.terms?.rate || 0,
            total_reviews: 1,
            total_ratings: stars
          }
        },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: 'Project marked as completed and review submitted successfully',
        data: {
          projectId: projectId,
          status: 'completed',
          completedAt: hireRequest.completedAt,
          review: {
            stars: stars,
            message: message,
            status: 'Completed'
          }
        }
      });

    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Error in markProjectAsCompleted:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark project as completed',
      error: error.message
    });
  }
};






exports.markOfferAsCompleted = async (req, res) => {
  try {
    const { projectId } = req.params;
    const clientId = req.user.userId;
    const { stars, message } = req.body; // Only require these fields from request body

    console.log("Offer completion request:", {
      projectId,
      clientId,
      stars,
      message
    });

    // Validate required fields - match the same validation as normal jobs
    if (!stars || !message) {
      return res.status(400).json({
        success: false,
        message: 'Rating (stars) and review message are required'
      });
    }

    // Validate stars range
    if (stars < 1 || stars > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5 stars'
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the offer and populate necessary fields
      const offer = await Offer_Form.findOne({
        _id: projectId,
        client_id: clientId,
        status: { $in: ['accepted', 'ongoing'] }
      }).session(session);

      if (!offer) {
        throw new Error('Offer not found or unauthorized');
      }

      // Create review document using the offer data
      const reviewData = new Review({
        client_id: clientId,
        freelancer_id: offer.freelancer_id, // Use freelancer_id from offer
        job_id: offer.job_id, // Use job_id from offer
        message: message,
        stars: stars,
        status: 'Completed',
        createdAt: new Date(),
        updated_at: new Date()
      });

      await reviewData.save({ session });

      // Update offer status
      offer.status = 'completed';
      offer.completedAt = new Date();
      await offer.save({ session });

      // Update freelancer profile
      await Freelancer_Profile.findOneAndUpdate(
        { freelancer_id: offer.freelancer_id },
        {
          $inc: {
            completed_jobs: 1,
            total_reviews: 1,
            total_ratings: stars
          }
        },
        { session }
      );

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: 'Offer marked as completed and review submitted successfully',
        data: {
          projectId: projectId,
          status: 'completed',
          completedAt: offer.completedAt,
          review: {
            stars: stars,
            message: message,
            status: 'Completed'
          }
        }
      });

    } catch (error) {
      console.error('Transaction error:', error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Error in markOfferAsCompleted:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark offer as completed',
      error: error.message
    });
  }
};


// reviewController.js

exports.getFreelancerReviews = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    console.log("Received freelancerId:", freelancerId); // Debug log

    // Validate the provided freelancer ID
    if (!freelancerId) {
      return res.status(400).json({
        success: false,
        message: "Freelancer ID is required",
      });
    }

    // Find all reviews for the freelancer
    const reviews = await Review.find({ freelancer_id: freelancerId })
      .populate("client_id", "first_name last_name email") // Add relevant client fields
      .populate("job_id", "title description budget status completion_date") // Add relevant job fields
      .populate("freelancer_id", "first_name last_name email")
      .select("client_id freelancer_id job_id message stars status createdAt")
      .sort({ createdAt: -1 }); // Sort by newest first

    console.log("Found reviews:", reviews.length); // Debug log

    // Instead of returning 404, return success with empty array
    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          total_reviews: 0,
          average_rating: 0,
          reviews: [],
        },
      });
    }

    // Get all client IDs from reviews
    const clientIds = reviews
    .filter(review => review.client_id) // Filter out null client_ids
    .map((review) => review.client_id._id);

    // Fetch client profiles for all clients in one query
    const clientProfiles = await Client_Profile.find({
      client_id: { $in: clientIds },
    }).lean();

    // Create a map of client profiles for easy lookup
    const clientProfileMap = clientProfiles.reduce((acc, profile) => {
      acc[profile.client_id.toString()] = profile;
      return acc;
    }, {});

    // Format the response with client profile information
    const formattedReviews = reviews
    .filter(review => review.client_id && review.freelancer_id && review.job_id) // Filter out reviews with null references
    .map((review) => {
      const clientProfile =
        clientProfileMap[review.client_id._id.toString()] || {};

      return {
        review_id: review._id,
        client: {
          id: review.client_id._id,
          first_name: clientProfile.first_name || review.client_id.first_name || 'Unknown',
          last_name: clientProfile.last_name || review.client_id.last_name || 'User',
          email: clientProfile.email || review.client_id.email || '',
          profile_picture: clientProfile.image || null,
          about: clientProfile.about || null,
          country: clientProfile.country || null,
          languages: clientProfile.languages || [],
        },
        freelancer: {
          id: review.freelancer_id._id,
          first_name: review.freelancer_id.first_name|| 'Unknown',
          last_name: review.freelancer_id.last_name || 'Freelancer',
          email: review.freelancer_id.email || '',
        },
        job: {
          id: review.job_id._id,
          title: review.job_id.title || 'Untitled Job',
          description: review.job_id.description|| '',
          budget: review.job_id.budget || 0,
          status: review.job_id.status || 'unknown',
          completion_date: review.job_id.completion_date || null,
        },
        rating: review.stars || 0,
        review_message: review.message || '',
        status: review.status || 'pending',
        posted_date: review.createdAt,
      };
    });

    // Calculate average rating
    const validReviews = formattedReviews.filter(review => review.rating > 0);
    const averageRating =
    validReviews.length > 0
    ? validReviews.reduce((acc, review) => acc + review.rating, 0) / validReviews.length
    : 0;
    res.status(200).json({
      success: true,
      data: {
        total_reviews: formattedReviews.length,
        average_rating: parseFloat(averageRating.toFixed(1)),
        reviews: formattedReviews,
      },
    });
  } catch (error) {
    console.error("Error in getFreelancerReviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancer reviews",
      error: error.message,
    });
  }
};

exports.getFreelancerCompletedJobs = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    if (!freelancerId) {
      return res.status(400).json({
        success: false,
        message: "Freelancer ID is required",
      });
    }

    // Find all completed hire requests for the freelancer
    const completedJobs = await HireFreelancer.find({
      freelancerId: freelancerId,
      status: "completed",
    })
      .populate({
        path: "jobId",
        select:
          "_id job_title description budget deadline category skills completion_date",
      })
      .populate({
        path: "clientId",
        select: "_id name email company profile_image",
      })
      .populate({
        path: "proposalId",
        select:
          "_id add_requirements cover_letter project_duration portfolio_link attachment",
      })
      .sort({ completedAt: -1 }); // Sort by completion date

    // Get reviews for these jobs
    const jobIds = completedJobs.map((job) => job.jobId?._id);
    const reviews = await Review.find({
      freelancer_id: freelancerId,
      job_id: { $in: jobIds },
    }).lean();

    // Create a map of reviews by job ID
    const reviewsByJob = reviews.reduce((acc, review) => {
      acc[review.job_id.toString()] = review;
      return acc;
    }, {});

    const formattedResponse = completedJobs
      .map((job) => {
        const jobId = job.jobId?._id;
        const clientId = job.clientId?._id;
        const proposalId = job.proposalId?._id;

        return {
          hireId: job._id,
          job: jobId
            ? {
                id: jobId,
                title: job.jobId.job_title,
                description: job.jobId.description,
                budget: job.jobId.budget,
                deadline: job.jobId.deadline,
                category: job.jobId.category,
                skills: job.jobId.skills,
                completionDate: job.jobId.completion_date,
              }
            : null,
          client: clientId
            ? {
                id: clientId,
                name: job.clientId.name,
                email: job.clientId.email,
                company: job.clientId.company,
                profileImage: job.clientId.profile_image,
              }
            : null,
          proposal: proposalId
            ? {
                id: proposalId,
                coverLetter: job.proposalId.cover_letter,
                projectDuration: job.proposalId.project_duration,
                portfolioLink: job.proposalId.portfolio_link,
                attachment: job.proposalId.attachment,
                milestones:
                  job.proposalId.add_requirements?.by_milestones?.map(
                    (milestone) => ({
                      amount: milestone.amount,
                      description: milestone.description,
                      dueDate: milestone.due_date,
                    })
                  ) || [],
                projectBid: job.proposalId.add_requirements?.by_project
                  ? {
                      bidAmount:
                        job.proposalId.add_requirements.by_project.bid_amount,
                      dueDate:
                        job.proposalId.add_requirements.by_project.due_date,
                    }
                  : null,
              }
            : null,
          review: reviewsByJob[jobId?.toString()]
            ? {
                rating: reviewsByJob[jobId.toString()].stars,
                message: reviewsByJob[jobId.toString()].message,
                reviewDate: reviewsByJob[jobId.toString()].createdAt,
              }
            : null,
          completedAt: job.completedAt,
          earnings: job.terms?.rate || 0,
        };
      })
      .filter((job) => job.job !== null); // Filter out jobs with null jobId

    // Calculate statistics
    const totalEarnings = formattedResponse.reduce(
      (sum, job) => sum + job.earnings,
      0
    );
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.stars, 0) /
          reviews.length
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCompletedJobs: formattedResponse.length,
        totalEarnings: totalEarnings,
        averageRating: parseFloat(averageRating.toFixed(1)),
        completedJobs: formattedResponse,
      },
    });
  } catch (error) {
    console.error("Error in getFreelancerCompletedJobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch completed jobs",
      error: error.message,
    });
  }
};

// exports.getFreelancerHiredJobsCount = async (req, res) => {
//   try {
//     const { freelancerId } = req.params;

//     if (!freelancerId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Freelancer ID is required'
//       });
//     }

//     // Calculate the count of jobs where the freelancer is hired
//     const hiredJobsCount = await HireFreelancer.countDocuments({
//       freelancerId: freelancerId,
//       status: 'hired'
//     });

//     return res.status(200).json({
//       success: true,
//       count: hiredJobsCount
//     });

//   } catch (error) {
//     console.error('Error in getFreelancerHiredJobsCount:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch hired jobs count',
//       error: error.message
//     });
//   }
// };

exports.getClientCompletedJobsCount = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Validate client ID
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // Validate if client ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID format",
      });
    }

    // Count completed jobs for the client
    const completedJobsCount = await HireFreelancer.countDocuments({
      clientId: clientId,
      status: "completed",
    });

    console.log("complaeted jobs client", completedJobsCount);

    // Get total amount spent on completed jobs (optional)
    const completedJobs = await HireFreelancer.find({
      clientId: clientId,
      status: "completed",
    }).populate("jobId", "budget_type fixed_price hourly_rate");

    // Calculate total spent
    const totalSpent = completedJobs.reduce((total, job) => {
      if (job.jobId) {
        if (job.jobId.budget_type === "fixed") {
          return total + (job.jobId.fixed_price || 0);
        } else if (job.jobId.budget_type === "hourly") {
          // For hourly jobs, you might want to calculate based on actual hours worked
          // This is a simplified calculation using the average of hourly rate range
          const averageRate =
            (job.jobId.hourly_rate?.from + job.jobId.hourly_rate?.to) / 2 || 0;
          return total + averageRate;
        }
      }
      return total;
    }, 0);

    return res.status(200).json({
      success: true,
      data: {
        clientId: clientId,
        completedJobsCount: completedJobsCount,
        totalAmountSpent: parseFloat(totalSpent.toFixed(2)),
        averageJobCost:
          completedJobsCount > 0
            ? parseFloat((totalSpent / completedJobsCount).toFixed(2))
            : 0,
      },
    });
  } catch (error) {
    console.error("Error in getClientCompletedJobsCount:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch completed jobs count",
      error: error.message,
    });
  }
};

exports.getJobReview = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { source } = req.query; // Add source parameter to distinguish offers

    // Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
      });
    }

    console.log("Fetching review for:", { jobId, source }); // Debug log

    let review;
    let jobDetails;


    if (source === 'offer') {
      // First find the offer to get its job_id
      const offer = await Offer_Form.findOne({ job_id: jobId }).lean();
      
      console.log("Searching for offer with job_id:", jobId);
      console.log("Found offer:", offer);

      if (!offer) {
        return res.status(404).json({
          success: false,
          message: "Offer not found"
        });
      }
      // Find review using the job_id from the offer
      review = await Review.findOne({
        job_id: jobId, // Use jobId directly since it's the job_id we're looking for
        client_id: offer.client_id,
        freelancer_id: offer.freelancer_id
      }).populate([
        {
          path: "client_id",
          select: "name email profile_image"
        },
        {
          path: "freelancer_id",
          select: "name email profile_image"
        }
      ]);

      
      // Set job details from offer
      jobDetails = {
        _id: offer.job_id,
        job_title: offer.job_title || offer.title,
        description: offer.description
      };

     
    } else {

    // Find the hire request for this job
    const hireRequest = await HireFreelancer.findOne({
      jobId: jobId,
    }).populate("clientId freelancerId");

    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: "No hire request found for this job",
      });
    }


    review = await Review.findOne({
      job_id: jobId,
      freelancer_id: hireRequest.freelancerId._id,
      client_id: hireRequest.clientId._id,
    }).populate([
      {
        path: "client_id",
        select: "name email profile_image",
      },
      {
        path: "freelancer_id",
        select: "name email profile_image",
      },
      {
        path: "job_id",
        select: "job_title description",
      },
    ]);
    jobDetails = review?.job_id;

    }

 

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "No review found for this job",
      });
    }

    // Get client profile for additional information
    const clientProfile = await Client_Profile.findOne({
      client_id: review.client_id._id,
    });

    // Format the response
    const formattedResponse = {
      review_id: review._id,
      job_id: source === 'offer' ? jobDetails._id : review.job_id._id,
      offer_id: source === 'offer' ? jobId : null,
      job_title: review.job_id.job_title,
      rating: review.stars,
      review_message: review.message,
      review_date: review.createdAt,
      status: review.status,
      client: {
        id: review.client_id._id,
        name: review.client_id.name,
        email: review.client_id.email,
        profile_image: review.client_id.profile_image,
        company: clientProfile?.company || null,
        country: clientProfile?.country || null,
      },
      freelancer: {
        id: review.freelancer_id._id,
        name: review.freelancer_id.name,
        email: review.freelancer_id.email,
        profile_image: review.freelancer_id.profile_image,
      },
    };

    console.log("Sending review response:", formattedResponse); // Debug log

    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Error in getJobReview:", error);

    // Detailed error handling
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        error: error.message,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch job review",
      error: error.message,
    });
  }
};