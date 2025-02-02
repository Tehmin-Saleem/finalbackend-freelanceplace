const Client_Profile = require('../models/client_profile.model');
const { cloudinary } = require('../config/cloudinary.config');
exports.createProfile = async (req, res) => {
    try {
      console.log('Received file:', req.file);
  
      const clientId = req.user && (req.user.userId || req.user);
      let languages;
      try {
        languages = JSON.parse(req.body.languages);
      } catch (error) {
        throw new Error('Invalid format for languages. Expected a JSON array.');
      }
      const profileData = {
        client_id: clientId,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        about: req.body.about,
        gender: req.body.gender,
        DOB: req.body.DOB,
        email: req.body.email,
        languages: languages,
        country: req.body.country
      };
  
      // Handle image upload
      if (req.file) {
        console.log('File uploaded to Cloudinary:', req.file);
        
        // Cloudinary automatically uploads the file and returns the URL
        profileData.image = req.file.path;
        console.log('Stored image URL:', profileData.image);
      }
  
      let profile = await Client_Profile.findOne({ client_id: profileData.client_id });
  
      if (profile) {
        profile = await Client_Profile.findOneAndUpdate(
          { client_id: profileData.client_id },
          profileData,
          { new: true }
        );
      } else {
        profile = new Client_Profile(profileData);
        await profile.save();
      }
  
      return res.status(profile ? 200 : 201).json({ success: true, data: profile });
    } catch (err) {
      console.error('Error in createOrUpdateProfile:', err);
      res.status(400).json({ success: false, error: err.message });
    }
  };






  exports.getProfile = async (req, res) => {
    console.log('getProfile function called');
    try {
      const clientId = req.user.userId || req.user;
      console.log('Client ID:', clientId);
  
      const profile = await Client_Profile.findOne({ client_id: clientId });
      console.log('Found profile:', profile);
      
      if (!profile) {
        console.log('Profile not found for client ID:', clientId);
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
  
      const formattedProfile = {
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        client_id: profile.client_id,
        country: profile.country,
        image: profile.image,
        about: profile.about,
        email: profile.email,
        gender: profile.gender,
        DOB: profile.DOB,
        languages: profile.languages
      };
      console.log('Formatted profile:', formattedProfile);
  
      res.status(200).json({ success: true, data: formattedProfile });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  exports.updateProfile = async (req, res) => {
    try {
      const clientId = req.user && (req.user.userId || req.user);
      let languages;
      
      try {
        languages = JSON.parse(req.body.languages);
      } catch (error) {
        languages = req.body.languages; // In case it's already an array
      }
  
      const updateData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        about: req.body.about,
        gender: req.body.gender,
        DOB: req.body.DOB,
        email: req.body.email,
        languages: languages,
        country: req.body.country
      };
  
      // Handle image upload if there's a new image
      if (req.file) {
        updateData.image = req.file.path;
      }
  
      const updatedProfile = await Client_Profile.findOneAndUpdate(
        { client_id: clientId },
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!updatedProfile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
  
      res.status(200).json({ success: true, data: updatedProfile });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  };




exports.profileExists = async (req, res) => {
  try {
      const clientId = req.params.id;
      const profile = await Client_Profile.findOne({ client_id: clientId });
      res.status(200).json({ exists: !!profile });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};

// In your backend controller
exports.checkClientProfile = async (req, res) => {
  try {
    const clientId = req.params.userId;
    const profile = await Client_Profile.findOne({ client_id: clientId });
    
    console.log("Checking profile for client:", clientId);
    console.log("Profile found:", !!profile);

    res.status(200).json({
      success: true,
      exists: !!profile // Use a consistent property name
    });
  } catch (error) {
    console.error("Error in checkClientProfile:", error);
    res.status(500).json({
      success: false,
      message: 'Error checking client profile',
      error: error.message
    });
  }
};