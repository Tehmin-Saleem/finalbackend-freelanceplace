const HireFreelancer = require('../models/hire_freelancer.model');
const notificationController = require('../controllers/notifications.controller');
const Notification = require('../models/notifications.model');
const Proposal = require('../models/proposal.model');
const Job= require('../models/post_job.model')
const mongoose = require('mongoose');

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
