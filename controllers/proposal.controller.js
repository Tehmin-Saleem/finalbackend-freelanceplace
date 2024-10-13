const Proposal = require('../models/proposal.model');
const Freelancer_Profile = require('../models/freelancer_profile.model');
const Job = require('../models/post_job.model'); // Import the Job model
const Notification = require('../controllers/notifications.controller');
exports.createProposal = async (req, res) => {
  try {
    const {
      cover_letter,
      job_id,
      project_duration,
      portfolio_link,
    } = req.body;

    console.log('req.user:', req.user);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated or user ID not found' });
    }

    const freelancer_id = req.user.userId;
   
    const add_requirements = req.body.add_requirements ? JSON.parse(req.body.add_requirements) : null;

    // Fetch the job details to get the job title and client_id
    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const client_id = job.client_id; // Use the client_id from the job details

    let proposalData = {
      add_requirements,
      attachment: req.file ? req.file.filename : null,
      client_id,
      cover_letter,
      freelancer_id,
      job_id,
      project_duration,
      portfolio_link,
    };

    console.log('Proposal Data:', proposalData);

    const newProposal = new Proposal(proposalData);
    await newProposal.save();

    console.log('Saved Proposal:', newProposal);

    const notificationData = {
      client_id: client_id,
      freelancer_id: freelancer_id,
      job_id: job_id,
      message: `You have received a new proposal for your job: ${job.job_title}`,
      type: 'new_proposal'
    };

    console.log('Creating new proposal notification:', notificationData);
    await Notification.createNotification(notificationData);

    res.status(201).json({ message: 'Proposal created successfully', proposal: newProposal });
  } catch (err) {
    console.error('Error creating proposal:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.getFreelancerProposals = async (req, res) => {
  try {
    const jobId = req.query.jobId;
    const authenticatedUserId = req.user.userId; // Use userId instead of _id

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const proposals = await Proposal.find({ 'job_id': jobId })
      .populate('freelancer_id')
      .populate({
        path: 'job_id',
        select: 'job_title client_location'
      })
      .lean();

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ message: 'No proposals found for this job' });
    }

    const formattedProposals = await Promise.all(proposals.map(async (proposal) => {
      const job = proposal.job_id || {};
      const freelancerId = proposal.freelancer_id?._id;

      console.log('Searching for profile with freelancer_id:', freelancerId);
      const profile = await Freelancer_Profile.findOne({ freelancer_id: freelancerId }).lean();
      console.log('Found profile:', profile);

      return {
        id: proposal._id,
        coverLetter: proposal.cover_letter || 'No cover letter',
        timeline: proposal.project_duration || 'Not specified',
        rate : proposal.add_requirements?.by_project
  ? `By Project: ${proposal.add_requirements.by_project.bid_amount || 'Not specified'}`
  : proposal.add_requirements?.by_milestones
    ? `By Milestone: ${proposal.add_requirements.by_milestones.amount || 'Not specified'}`
    : 'Not specified',
        jobTitle: job.job_title || 'Job title not available',
        clientLocation: job.client_location || 'Not specified',
        // proposalStatus: proposal.status || 'Not specified',
        // isAuthenticatedUser: freelancerId.toString() === authenticatedUserId.toString(),
        freelancerProfile: profile ? {
          id: profile._id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'No Name',
          image: profile.image || null,
          title: profile.title || '',
          skills: profile.skills || [],
          availability: profile.availability || {},
          languages: profile.languages || [],
          portfolios: profile.portfolios || [],
          location: profile.location ,
          totalHours: profile.experience?.total_hours || 0,
          totalJobs: profile.experience?.completed_projects || 0,
          experience: {
            title: profile.title || '',
            description: profile.profile_overview || '',
          },
        } : null,
      };
    }));
console.log("proposals",formattedProposals)
    res.status(200).json({ proposals: formattedProposals });
  } catch (err) {
    console.error('Error in getFreelancerProposals:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.getProposalById = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const freelancer_id = req.user._id;

    const proposal = await Proposal.findOne({ _id: proposalId, freelancer_id }).populate('client_id job_id');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found or unauthorized' });
    }

    res.status(200).json({ proposal });
} catch (err) {
    console.error('Error getting proposal:', err); 
    res.status(500).json({ message: 'Internal server error', error: err.message });
}
};


exports.updateProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const freelancer_id = req.user._id;
    const updateData = req.body;

    const updatedProposal = await Proposal.findOneAndUpdate(
      { _id: proposalId, freelancer_id },
      updateData,
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: 'Proposal not found or unauthorized' });
    }

    res.status(200).json({ message: 'Proposal updated successfully', proposal: updatedProposal });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const freelancer_id = req.user._id;

    const deletedProposal = await Proposal.findOneAndDelete({ _id: proposalId, freelancer_id });

    if (!deletedProposal) {
      return res.status(404).json({ message: 'Proposal not found or unauthorized' });
    }

    res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


// ======================
// here i am adding new controller for getting freelancer details for specific proposal


exports.getFreelancerDetailsByProposal = async (req, res) => {
  try {
    const { _id } = req.params;

    // Find the proposal by ID and populate freelancer details
    const proposal = await Proposal.findById(_id)
      .populate('freelancer_id', 'first_name', 'last_name', 'profilePic',' jobTitle')  // Assuming freelancer_id references the user
      .lean();

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const freelancerId = proposal.freelancer_id._id;

    // Find freelancer profile using the freelancer_id from the proposal
    const profile = await Freelancer_Profile.findOne({ freelancer_id: freelancerId }).lean();

    if (!profile) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    // Return freelancer details
    const freelancerDetails = {
      name: `${proposal.freelancer_id.first_name} ${proposal.freelancer_id.last_name}`.trim(),
      profilePic: proposal.freelancer_id.profilePic || null,
      jobTitle: proposal.freelancer_id.jobTitle || '',
      profileOverview: profile.profile_overview || '',
      experience: profile.experience || [],
      skills: profile.skills || [],
      location: profile.location || '',
    };

    res.status(200).json(freelancerDetails);
  } catch (err) {
    console.error('Error fetching freelancer details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



