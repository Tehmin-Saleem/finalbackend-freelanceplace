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

    // Ensure skills is always a string, joining them if it's an array
    if (profileData.skills && Array.isArray(profileData.skills)) {
      // Convert array to comma-separated string
      profileData.skills = profileData.skills.join(', ');
    }

    // Assign userId to the profile from the authenticated user
    profileData.userId = req.user.id; // Assuming req.user contains the authenticated user's info

    // If profile picture is uploaded, store the file path
    if (req.file) {
      profileData.profilePicture = req.file.path;
    }

    // Save the new profile
    const newProfile = new ConsultantProfile(profileData);
    await newProfile.save();

    // Fetch and sort all profiles for this user by `createdAt` in descending order
    const sortedProfiles = await ConsultantProfile.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(201).json({ message: 'Profile created successfully', profiles: sortedProfiles });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error creating profile', error });
  }
};

  
  
  



  exports.getProfileByUserId = async (req, res) => {
    try {
        const profile = await ConsultantProfile.findOne({ userId: req.params.userId })
            .sort({ createdAt: -1 }); // Fetch the most recent profile if there are multiple profiles for the user.
            if (profile.skills && typeof profile.skills === 'string') {
              profile.skills = profile.skills.split(', ');  // Split the string into an array
            }
        if (!profile) {
            return res.status(404).json({ message: 'Consultant profile not found' });
        }

        res.status(200).json({ profile }); // Return a single profile object
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultant profile', error });
    }
};




// Optional: Get all profiles (for admin purposes)
// exports.getAllProfiles = async (req, res) => {
//     try {
//         const profiles = await ConsultantProfile.find({})
//             .select('-__v')
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             success: true,
//             count: profiles.length,
//             data: profiles
//         });

//     } catch (error) {
//         console.error('Error fetching all profiles:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error fetching profiles',
//             error: error.message
//         });
//     }
// };



// Fetch all consultant profiles
exports.getConsultantProfiles = async (req, res) => {
    try {
      const consultants = await ConsultantProfile.find().sort({ createdAt: -1 }); // Sort by most recent
      res.json(consultants); // Return data as JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  




