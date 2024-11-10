const ConsultantProfile = require('../models/consultantprofile');

// exports.createProfile = async (req, res) => {
//   try {
//     const profileData = req.body;

//     // If there is a file, store its path
//     if (req.file) {
//       profileData.profilePicture = req.file.path;
//     }

//     const newProfile = new ConsultantProfile(profileData);
//     await newProfile.save();
//     res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating profile', error });
//   }
// };// Controller: createProfile
// Controller: createProfile
exports.createProfile = async (req, res) => {
    try {
      const profileData = req.body;
  
      // Assign userId to the profile from the authenticated user (you should have authentication set up)
      profileData.userId = req.user.id;  // Assuming req.user contains the authenticated user's info
  
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
  



exports.getProfileByUserId = async (req, res) => {
    try {
      const profile = await ConsultantProfile.findOne({ userId: req.params.userId });
  
      if (!profile) {
        return res.status(404).json({ message: 'Consultant profile not found' });
      }
  
      res.status(200).json({ profile });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching consultant profile', error });
    }
  };


// Optional: Get all profiles (for admin purposes)
exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await ConsultantProfile.find({})
            .select('-__v')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: profiles.length,
            data: profiles
        });

    } catch (error) {
        console.error('Error fetching all profiles:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching profiles',
            error: error.message
        });
    }
};

