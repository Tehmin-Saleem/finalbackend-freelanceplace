const Freelancer_Profile = require('../models/freelancer_profile.model');
const { cloudinary } = require('../config/cloudinary.config');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    
    console.log('Received files:', req.files);

    const freelancerId = req.user && (req.user.userId || req.user);
    const profileData = {
      freelancer_id: freelancerId,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,  // Ensure email is included
      title: req.body.title,
      profile_overview: req.body.profile_overview,
      experience: JSON.parse(req.body.experience),
      availability: JSON.parse(req.body.availability),
      languages: JSON.parse(req.body.languages),
      skills: JSON.parse(req.body.skills),
    };

    // Handle image upload
    if (req.files && req.files.image) {
      const file = req.files.image[0];
      console.log('Uploading file to Cloudinary:', file);

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'image',
        access_mode: 'public',
        folder: 'uploads'
      });

      // Store the full Cloudinary URL
      profileData.image = result.secure_url;
      console.log('Stored image URL:', profileData.image);
    }
    if (req.body.portfolios) {
      profileData.portfolios = JSON.parse(req.body.portfolios);
      
      if (req.files && req.files.portfolios) {
        for (let i = 0; i < req.files.portfolios.length; i++) {
          const file = req.files.portfolios[i];
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: file.mimetype.startsWith('image') ? 'image' : 'raw',
            public_id: `portfolio_uploads/${file.originalname}`,
            format: file.mimetype.startsWith('image') ? null : 'pdf'
          });
          
          // The correct URL should now be in result.secure_url
          console.log("Uploaded PDF URL:", result.secure_url);
          
          if (profileData.portfolios[i]) {
            profileData.portfolios[i].attachment = result.secure_url; // Store the full Cloudinary URL
          }
        }
      }
    }

    // Rest of the function remains the same...

    let profile = await Freelancer_Profile.findOne({ freelancer_id: profileData.freelancer_id });

    if (profile) {
      profile = await Freelancer_Profile.findOneAndUpdate(
        { freelancer_id: profileData.freelancer_id },
        profileData,
        { new: true }
      );
    } else {
      profile = new Freelancer_Profile(profileData);
      await profile.save();
    }

    return res.status(profile ? 200 : 201).json({ success: true, data: profile });
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
      image: profile.image || null, 
    }));

    console.log('Formatted profiles data:', formattedProfiles);

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
    // console.log('Fetching profile for user ID:', userId);
    
    const profile = await Freelancer_Profile.findOne({ freelancer_id: userId })
      .select('-__v -createdAt -updatedAt');

    // console.log('Found profile:', profile);

    if (!profile) {
      console.log('No profile found for user ID:', userId);
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Constructing the formatcdted profile
    const formattedProfile = {
      freelancer_id: profile.freelancer_id,
      name: `${profile.first_name} ${profile.last_name}`.trim() || 'No Name',
      jobSuccess: calculateJobSuccess(profile),
      rate: profile.availability?.hourly_rate || 'Not specified',
      skills: profile.skills || [],
      totalJobs: profile.experience?.completed_projects || 0,
      totalHours: profile.total_hours || 0,
      title: profile.title || '',
      experience: {
        description: profile.profile_overview || 'No description available',
        title: profile.title || '',
      },
      availability: profile.availability || {},
      languages: profile.languages || [],
      portfolios: profile.portfolios?.map(portfolio => ({
        ...portfolio.toObject(),
        attachment: portfolio.attachment.startsWith('http') 
          ? portfolio.attachment 
          : `https://res.cloudinary.com/dwqcs228h/raw/upload/v1728108804/uploads/${portfolio.attachment}`
      })) || [],
    
      image: profile.image || null
    }

    console.log('profile image:', formattedProfile.image);
    console.log('Formatted profile data:', formattedProfile);

    res.status(200).json({ success: true, data: formattedProfile });
  } catch (err) {
    console.error('Error in getProfileByUserId:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};





exports.getProfileByFreelancerId = async (req, res) => {
  try {
    // Extract the freelancer_id from the request parameters
    const { freelancer_id } = req.params;

    // Log freelancer_id to check if it's correct
    // console.log('Requested freelancer_id:', freelancer_id);

    // Fetch the profile that matches the freelancer_id from the database
    const profile = await Freelancer_Profile.findOne({ freelancer_id })
      .select('-__v -createdAt -updatedAt'); // Exclude unnecessary fields

    // Log the fetched profile
    // console.log('Fetched profile:', profile);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Format the response data for the profile
    // Constructing the formatted profile
    const formattedProfile = {
      freelancer_id: profile.freelancer_id,
      name: `${profile.first_name} ${profile.last_name}`.trim() || 'No Name',
      jobSuccess: calculateJobSuccess(profile),
      rate: profile.availability?.hourly_rate || 'Not specified',
      skills: profile.skills || [],
      totalJobs: profile.experience?.completed_projects || 0,
      totalHours: profile.total_hours || 0,
      title: profile.title || '',
      experience: {
        description: profile.profile_overview || 'No description available',
        title: profile.title || '',
      },
      availability: profile.availability || {},
      languages: profile.languages || [],
      portfolios: profile.portfolios?.map(portfolio => ({
        ...portfolio.toObject(),
        attachment: portfolio.attachment.startsWith('http') 
          ? portfolio.attachment 
          : `https://res.cloudinary.com/dwqcs228h/raw/upload/v1728108804/uploads/${portfolio.attachment}`
      })) || [],
    
      image: profile.image || null
    }

    // console.log('profile image:', formattedProfile.image);
    // console.log('Formatted profile data:', formattedProfile);

    res.status(200).json({ success: true, data: formattedProfile });
  } catch (err) {
    console.error('Error in getProfileByFreelancerId:', err);
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


// Controller: freelancerController.js
exports.freelancerProfileExists = async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const profile = await Freelancer_Profile.findOne({ freelancer_id: freelancerId });
    res.status(200).json({ exists: !!profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
