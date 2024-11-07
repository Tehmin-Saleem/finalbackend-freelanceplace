const ConsultantProfile = require('../models/consultantprofile');

exports.createProfile = async (req, res) => {
  try {
    const profileData = req.body;

    // If there is a file, store its path
    if (req.file) {
      profileData.profilePicture = req.file.path;
    }

    const newProfile = new ConsultantProfile(profileData);
    await newProfile.save();
    res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error creating profile', error });
  }
};
exports.getProfile = async (req, res) => {
    try {
      // Assuming `req.user.id` is the authenticated user's ID
      const profile = await ConsultantProfile.findOne({ userId: req.user.id }); // Ensure userId exists in ConsultantProfile model
  
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.json(profile);
    } catch (error) {
      console.error('Error fetching consultant profile:', error); // Log the error for debugging
      res.status(500).json({ message: 'Server error', error });
    }
  };