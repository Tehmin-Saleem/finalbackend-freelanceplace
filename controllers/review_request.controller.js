const ReviewRequest = require('../models/review_request.model');


exports.createReviewRequest = async (req, res) => {
  try {
    const { freelancer_id, job_id } = req.body;
    const client_id = req.user._id; 

    const newReviewRequest = new ReviewRequest({
      client_id,
      freelancer_id,
      job_id,
      status: "Pending", 
    });

    await newReviewRequest.save();
    res.status(201).json({ message: 'Review request created successfully', reviewRequest: newReviewRequest });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getClientReviewRequests = async (req, res) => {
  try {
    const client_id = req.user._id; 

    const reviewRequests = await ReviewRequest.find({ client_id }).populate('freelancer_id job_id');

    res.status(200).json({ reviewRequests });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getFreelancerReviewRequests = async (req, res) => {
  try {
    const freelancer_id = req.user._id; 

    const reviewRequests = await ReviewRequest.find({ freelancer_id }).populate('client_id job_id');

    res.status(200).json({ reviewRequests });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateReviewRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    
    const reviewRequest = await ReviewRequest.findOneAndUpdate(
      { _id: requestId, $or: [{ client_id: req.user._id }, { freelancer_id: req.user._id }] },
      { status },
      { new: true }
    );

    if (!reviewRequest) {
      return res.status(404).json({ message: 'Review request not found or unauthorized' });
    }

    res.status(200).json({ message: 'Review request status updated successfully', reviewRequest });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
