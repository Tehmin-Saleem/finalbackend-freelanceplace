const HireFreelancer = require('../models/hire_freelancer.model');

const Notification = require('../models/notifications.model')
const Proposal = require('../models/proposal.model');


exports.hireFreelancer = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const clientId = req.user.userId;

    console.log('Hiring freelancer for proposal:', proposalId);
    console.log('Client ID:', clientId);

    const proposal = await Proposal.findById(proposalId).populate('job_id');
    if (!proposal) {
      console.log('Proposal not found:', proposalId);
      return res.status(404).json({ message: 'Proposal not found' });
    }

    console.log('Found proposal:', proposal);

    // Update proposal status to 'hired'
    proposal.status = 'Hired';
    await proposal.save();
    console.log('Updated proposal status to Hired');

    // Create a notification for the freelancer
    const notificationData = {
      freelancer_id: proposal.freelancer_id,
      client_id: clientId,
      job_id: proposal.job_id._id,
      message: `You have been hired for the job: ${proposal.job_id.job_title}`,
      type: 'hired'
    };

    console.log('Creating hired notification:', notificationData);
    const newNotification = await notificationController.createNotification(notificationData);
    console.log('Created hired notification:', newNotification);

    res.status(200).json({ message: 'Freelancer hired successfully', notification: newNotification });
  } catch (err) {
    console.error('Error hiring freelancer:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
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
exports.getHireRequestById = async (req, res) => {
  try {
    const { hireRequestId } = req.params;
    const clientId = req.user._id;

    const hireRequest = await HireFreelancer.findOne({ _id: hireRequestId, clientId }).populate('freelancerId jobId');

    if (!hireRequest) {
      return res.status(404).json({ message: 'Hire request not found or unauthorized' });
    }

    res.status(200).json({ hireRequest });
  } catch (err) {
    console.error('Error fetching hire request:', err);
    res.status(500).json({ message: 'Internal server error' });
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
