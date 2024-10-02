
const Freelancer_Profile = require('../models/freelancer_profile.model');


exports.createOrUpdateProfile = async (req, res) => {
  try {
    console.log('Received data:', req.body);
    console.log('Received files:', req.files);
    console.log('User ID from middleware:', req.user);
    const freelancerId = req.user && (req.user.userId || req.user);
    const profileData = {
      freelancer_id: freelancerId, // Use the ID from the middleware
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      title: req.body.title,
      profile_overview: req.body.profile_overview,
      experience: JSON.parse(req.body.experience),
      availability: JSON.parse(req.body.availability),
      languages: JSON.parse(req.body.languages),
      skills: JSON.parse(req.body.skills),
    };

    // Handle image upload
    if (req.files && req.files.image) {
      profileData.image = req.files.image[0].filename;
    }

    // Handle portfolios
    if (req.body.portfolios) {
      profileData.portfolios = JSON.parse(req.body.portfolios);
      
      // Handle portfolio attachments
      if (req.files && req.files.portfolios) {
        req.files.portfolios.forEach((file, index) => {
          if (profileData.portfolios[index]) {
            profileData.portfolios[index].attachment = file.filename;
          }
        });
      }
    }

    // Check if a profile with the given freelancer_id already exists
    let profile = await Freelancer_Profile.findOne({ freelancer_id: profileData.freelancer_id });

    if (profile) {
      // If profile exists, update it
      profile = await Freelancer_Profile.findOneAndUpdate(
        { freelancer_id: profileData.freelancer_id },
        profileData,
        { new: true }
      );
      return res.status(200).json({ success: true, data: profile });
    } else {
      // If no profile exists, create a new one
      profile = new Freelancer_Profile(profileData);
      await profile.save();
      return res.status(201).json({ success: true, data: profile });
    }
  } catch (err) {
    console.error('Error in createOrUpdateProfile:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getAuthenticatedProfile = async (req, res) => {
  try {
    // Fetch all profiles from the database
    const profiles = await Freelancer_Profile.find()
      .select('-__v -createdAt -updatedAt'); // Exclude unnecessary fields

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ success: false, message: 'No profiles found' });
    }

    // Format the response data for each profile
    const formattedProfiles = profiles.map(profile => ({
      freelancer_id: profile.freelancer_id,
      name: `${profile.first_name} ${profile.last_name}`.trim() || 'No Name',
      location: profile.location || 'Not specified',
      jobSuccess: calculateJobSuccess(profile), // Implement this function based on your logic
      rate: profile.availability?.hourly_rate || 'Not specified',
      skills: profile.skills || [],
      totalJobs: profile.experience?.completed_projects || 0,
      totalHours: profile.total_hours || 0,
      experience: {
        title: profile.title || '',
        description: profile.profile_overview || '',
      },
      availability: {
        full_time: profile.availability?.full_time || false,
        part_time: profile.availability?.part_time || false,
        hourly_rate: profile.availability?.hourly_rate || 'Not specified',
      },
      languages: profile.languages || [],
      portfolios: profile.portfolios || [],
      image: profile.image ? `/api/freelancer/profile/image/${profile.image.split('\\').pop()}` : null,
    }));

    // console.log('Formatted profiles data:', formattedProfiles);

    res.status(200).json({ success: true, data: formattedProfiles });
  } catch (err) {
    console.error('Error in getAllProfiles:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};
// Helper function to calculate job success rate
function calculateJobSuccess(profile) {
  // Implement your logic here. For now, returning a random number between 80 and 100
  return Math.floor(Math.random() * (100 - 80 + 1)) + 80;
}

exports.getProfileByUserId = async (req, res) => {
  console.log('Starting getProfileByUserId function');
  try {
    const userId = req.user.userId || req.user;
    console.log('Fetching profile for user ID:', userId);
    
    const profile = await Freelancer_Profile.findOne({ freelancer_id: userId })
      .select('-__v -createdAt -updatedAt');

    console.log('Found profile:', profile);

    if (!profile) {
      console.log('No profile found for user ID:', userId);
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Constructing the formatted profile
    const formattedProfile = {
      freelancer_id: profile.freelancer_id,
      name: `${profile.first_name} ${profile.last_name}`.trim() || 'No Name',
      location: profile.location || 'Not specified',
      jobSuccess: calculateJobSuccess(profile),
      rate: profile.hourly_rate || 'Not specified',
      skills: profile.skills || [],
      totalJobs: profile.completed_projects || 0,
      totalHours: profile.total_hours || 0,
      title: profile.title || '',
      experience: {
        description: profile.profile_overview || 'No description available',
        title: profile.title || '',
      },
      availability: profile.availability || {},
      languages: profile.languages || [],
      portfolios: profile.portfolios || [],
      image: profile.image ? `/api/freelancer/profile/image/${profile.image}` : null,
    };

    console.log('Formatted profile data:', formattedProfile);

    res.status(200).json({ success: true, data: formattedProfile });
  } catch (err) {
    console.error('Error in getProfileByUserId:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

function calculateJobSuccess(profile) {
  return profile.completed_projects > 0 ? Math.floor(Math.random() * (100 - 80 + 1)) + 80 : 0;
}
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




// exports.getProfileByFreelancerId = async (req, res) => {
//   try {
//     // Extract the freelancer_id from the request parameters
//     const { freelancer_id } = req.params;
    
//     // Fetch the profile that matches the freelancer_id from the database
//     const profile = await Freelancer_Profile.findOne({ freelancer_id })
//     .select('-__v -createdAt -updatedAt'); // Exclude unnecessary fields
//     console.log('Fetching profile for user ID:', freelancer_id);
    
//     if (!profile) {
//       return res.status(404).json({ success: false, message: 'Profile not found' });
//     }

//     // Format the response data for the profile
//     const formattedProfile = {
//       freelancer_id: profile.freelancer_id,
//       name: `${profile.first_name} ${profile.last_name}`.trim() || 'No Name',
//       location: profile.location || 'Not specified',
//       jobSuccess: calculateJobSuccess(profile), // Implement this function based on your logic
//       rate: profile.availability?.hourly_rate || 'Not specified',
//       skills: profile.skills || [],
//       totalJobs: profile.experience?.completed_projects || 0,
//       totalHours: profile.total_hours || 0,
//       experience: {
//         title: profile.title || '',
//         description: profile.profile_overview || '',
//       },
//       availability: {
//         full_time: profile.availability?.full_time || false,
//         part_time: profile.availability?.part_time || false,
//         hourly_rate: profile.availability?.hourly_rate || 'Not specified',
//       },
//       languages: profile.languages || [],
//       portfolios: profile.portfolios || [],
//       image: profile.image ? `/api/freelancer/profile/image/${profile.image.split('\\').pop()}` : null,
//     };

//     res.status(200).json({ success: true, data: formattedProfile });
//   } catch (err) {
//     console.error('Error in getProfileByFreelancerId:', err);
//     res.status(400).json({ success: false, error: err.message });
//   }
// };





// ===============

exports.getProfileByFreelancerId = async (req, res) => {
  try {
    // Extract the freelancer_id from the request parameters
    const { freelancer_id } = req.params;

    // Log freelancer_id to check if it's correct
    console.log('Requested freelancer_id:', freelancer_id);

    // Fetch the profile that matches the freelancer_id from the database
    const profile = await Freelancer_Profile.findOne({ freelancer_id })
      .select('-__v -createdAt -updatedAt'); // Exclude unnecessary fields

    // Log the fetched profile
    console.log('Fetched profile:', profile);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Format the response data for the profile
    const formattedProfile = {
      freelancer_id: profile.freelancer_id,
      name: `${profile.first_name} ${profile.last_name}`.trim() || 'No Name',
      location: profile.location || 'Not specified',
      jobSuccess: calculateJobSuccess(profile),
      rate: profile.availability?.hourly_rate || 'Not specified',
      skills: profile.skills || [],
      totalJobs: profile.experience?.completed_projects || 0,
      totalHours: profile.total_hours || 0,
      experience: {
        title: profile.title || '',
        description: profile.profile_overview || '',
      },
      availability: {
        full_time: profile.availability?.full_time || false,
        part_time: profile.availability?.part_time || false,
        hourly_rate: profile.availability?.hourly_rate || 'Not specified',
      },
      languages: profile.languages || [],
      portfolios: profile.portfolios || [],
      image: profile.image ? `/api/freelancer/profile/image/${profile.image.split('\\').pop()}` : null,
    };

    res.status(200).json({ success: true, data: formattedProfile });
  } catch (err) {
    console.error('Error in getProfileByFreelancerId:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};
