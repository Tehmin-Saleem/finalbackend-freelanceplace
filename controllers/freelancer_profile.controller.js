const Freelancer_Profile = require('../models/freelancer_profile.model');

// Create or update freelancer profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    // Check if a profile already exists for the freelancer
    let profile = await Freelancer_Profile.findOne({ freelancer_id: req.body.freelancer_id });

    if (profile) {
      // Update existing profile
      profile = await Freelancer_Profile.findOneAndUpdate(
        { freelancer_id: req.body.freelancer_id },
        req.body,
        { new: true }
      );
    } else {
      // Create a new profile
      profile = new Freelancer_Profile(req.body);
      await profile.save();
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get freelancer profile by freelancer ID
exports.getProfileByFreelancerId = async (req, res) => {
  try {
    const profile = await Freelancer_Profile.findOne({ freelancer_id: req.params.freelancerId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update freelancer profile by freelancer ID
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Freelancer_Profile.findOneAndUpdate(
      { freelancer_id: req.params.freelancerId },
      req.body,
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete freelancer profile by freelancer ID
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Freelancer_Profile.findOneAndDelete({ freelancer_id: req.params.freelancerId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
