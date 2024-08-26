const Review = require('../models/review.model');


exports.createReview = async (req, res) => {
  try {
    const { freelancer_id, job_id, message, stars } = req.body;
    const client_id = req.user._id; 

    const newReview = new Review({
      client_id,
      freelancer_id,
      job_id,
      message,
      stars,
      status: "Pending", 
    });

    await newReview.save();
    res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getClientReviews = async (req, res) => {
  try {
    const client_id = req.user._id; 

    const reviews = await Review.find({ client_id }).populate('freelancer_id job_id');

    res.status(200).json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { message, stars, status } = req.body;
    const client_id = req.user._id; 

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, client_id },
      { message, stars, status, updated_at: Date.now() },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const client_id = req.user._id; 

    const review = await Review.findOneAndDelete({ _id: reviewId, client_id });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
