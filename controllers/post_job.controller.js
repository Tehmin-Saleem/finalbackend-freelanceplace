const Job_Post = require('../models/post_job.model');
const Proposal = require('../models/proposal.model');
const Payment_Method = require('../models/payment_method.model');

exports.createJobPost = async (req, res) => {
  try {
    const {
      budget_type,
      hourly_rate_from,
      hourly_rate_to,
      fixed_price,
      description,
      job_title,
      project_duration,
      preferred_skills,
      status,
    } = req.body;
    
    let hourly_rate = null;
    if (budget_type === 'hourly') {
      hourly_rate = {
        from: hourly_rate_from || null,
        to: hourly_rate_to || null
      };
    }
    console.log('Received data:', { 
      budget_type, hourly_rate, fixed_price, description, job_title, 
      project_duration, preferred_skills, status 
    });

    let attachmentData = null;
    if (req.file) {
      attachmentData = {
        fileName: req.file.filename,
        path: req.file.path,
        description: req.body.attachmentDescription || ''
      };
    }

    const newJobPost = new Job_Post({
      client_id: req.user.userId, 
      attachment: attachmentData,
      budget_type,
      hourly_rate,
      fixed_price,
      description,
      job_title,
      project_duration,
      preferred_skills,
      status: status,
    });

    await newJobPost.save();
    res.status(201).json({ message: 'Job post created successfully', jobPost: newJobPost });
  } catch (err) {
    console.error('Error creating job post:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
exports.getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await Job_Post.find()
    .populate('client_id', 'email')
    .sort({ createdAt: -1 })  // Sort by createdAt, descending order (newest first)
    .lean();

    const jobPostsWithDetails = await Promise.all(jobPosts.map(async (job) => {
      const proposalCount = await Proposal.countDocuments({ job_id: job._id });

      // Check if the client has a payment method
      const hasPaymentMethod = await Payment_Method.exists({ client_id: job.client_id });

      return {
        ...job,
        proposalCount,
        paymentMethodStatus: hasPaymentMethod ? "Payment method verified" : "Payment method unverified"
      };
    }));

    res.status(200).json({ jobPosts: jobPostsWithDetails });
  } catch (err) {
    console.error('Error fetching job posts:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
// exports.getClientJobPosts = async (req, res) => {
//   try {
//     // Get the logged-in user's ID from the request object
//     const loggedInUserId = req.user.userId || req.user;

//     // Find job posts for the logged-in user
//     const jobPosts = await Job_Post.find({ client_id: loggedInUserId })
//       .populate('client_id', 'email')
//       .lean();
    
//     const jobPostsWithDetails = await Promise.all(jobPosts.map(async (job) => {
//       const proposalCount = await Proposal.countDocuments({ job_id: job._id });
      
//       // Check if the client has a payment method
//       const hasPaymentMethod = await Payment_Method.exists({ client_id: job.client_id });
      
//       return {
//         ...job,
//         proposalCount,
//         paymentMethodStatus: hasPaymentMethod ? "Payment method verified" : "Payment method unverified"
//       };
//     }));
    
//     res.status(200).json({ jobPosts: jobPostsWithDetails });
//   } catch (err) {
//     console.error('Error fetching job posts:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };





exports.getClientJobPosts = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId || req.user;

    const jobPosts = await Job_Post.find({ client_id: loggedInUserId })
      .populate('client_id', 'email')
      .sort({ createdAt: -1 }) // Sort jobs by newest first
      .lean();
    
    const jobPostsWithDetails = await Promise.all(jobPosts.map(async (job) => {
      const proposalCount = await Proposal.countDocuments({ job_id: job._id });
      const hasPaymentMethod = await Payment_Method.exists({ client_id: job.client_id });

      // Check if any proposal has the status "hired"
      const hasHiredProposal = await Proposal.exists({ job_id: job._id, status: 'hired' });

      return {
        ...job,
        proposalCount,
        paymentMethodStatus: hasPaymentMethod ? "Payment method verified" : "Payment method unverified",
        hasHiredProposal // Add this field to indicate if there's a hired proposal
      };
    }));

    res.status(200).json({ jobPosts: jobPostsWithDetails });
  } catch (err) {
    console.error('Error fetching job posts:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


// Backend API controller
exports.getJobPostById = async (req, res) => {
  try {
    const { jobPostId } = req.params; 
    const jobPost = await Job_Post.findById(jobPostId);

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    res.status(200).json({ jobPost });
  } catch (err) {
    console.error('Error fetching job post:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.updateJobPost = async (req, res) => {
  try {
    const { jobPostId } = req.params;
    const client_id = req.user._id;
    const updateData = req.body;

    const updatedJobPost = await Job_Post.findOneAndUpdate(
      { _id: jobPostId, client_id },
      updateData,
      { new: true }
    );

    if (!updatedJobPost) {
      return res.status(404).json({ message: 'Job post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Job post updated successfully', jobPost: updatedJobPost });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteJobPost = async (req, res) => {
  try {
    const { jobPostId } = req.params;
    const client_id = req.user._id;

    const deletedJobPost = await Job_Post.findOneAndDelete({ _id: jobPostId, client_id });

    if (!deletedJobPost) {
      return res.status(404).json({ message: 'Job post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Job post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Controller: count job posts by client ID
exports.countJobPostsByClientId = async (req, res) => {
  try {
    // Get clientId from request params
    const { clientId } = req.params;

    // Count the number of job posts for this specific client
    const jobPostCount = await Job_Post.countDocuments({ client_id: clientId });

console.log("Client ID:", clientId);
console.log("Job Post Count:", jobPostCount);
    // Return the result
    res.status(200).json({ totalJobPosts: jobPostCount });
  } catch (err) {
    console.error('Error counting job posts:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

