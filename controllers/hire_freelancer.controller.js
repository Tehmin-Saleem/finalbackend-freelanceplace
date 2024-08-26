const HireFreelancer = require('../models/hire_freelancer.model');

// Create a new hire request
exports.createHireRequest = async (req, res) => {
  try {
    const { freelancerId, clientId, jobId } = req.body;

    // Create a new hire request
    const newHireRequest = new HireFreelancer({
      freelancerId,
      clientId,
      jobId,
    });

    await newHireRequest.save();

    res.status(201).json({ message: 'Hire request created successfully', hireRequest: newHireRequest });
  } catch (err) {
    console.error('Error creating hire request:', err);
    res.status(500).json({ message: 'Internal server error' });
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
