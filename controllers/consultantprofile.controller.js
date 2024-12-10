const ConsultantProfile = require('../models/consultantprofile');
const Project = require('../models/manageProject.model')
const User = require('../models/consultantprofile'); // Adjust the path as needed
const Client_Profile = require('../models/client_profile.model'); // Adjust the path as needed
const HireFreelancer = require('../models/hire_freelancer.model'); // Adjust the path as needed
const ConsultantOffer = require('../models/hire_consultant.model'); // Adjust the path as needed
const Review= require('../models/review.model')
const { createNotification } = require('../controllers/notifications.controller');

exports.createProfile = async (req, res) => {
  try {
    const profileData = req.body;

    // Ensure skills is always a string, joining them if it's an array
    if (profileData.skills && Array.isArray(profileData.skills)) {
      profileData.skills = profileData.skills.join(', ');
    }

    // Assign userId to the profile from the authenticated user
    profileData.userId = req.user.id; // Assuming req.user contains the authenticated user's info

    // Assign first name and last name explicitly
    if (req.body.firstname) profileData.firstname = req.body.firstname;
    if (req.body.lastname) profileData.lastname = req.body.lastname;

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

    res.status(201).json({ 
      message: 'Profile created successfully', 
      profiles: sortedProfiles 
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ 
      message: 'Error creating profile', 
      error 
    });
  }
};

  
  
  

exports.sendOfferToConsultant = async (req, res) => {
  try {
    // Log incoming request
    console.log("Incoming request:", req.body, req.params);

    // Extract data from request
    const { consultant_id } = req.params;
    const { projectName, projectDescription } = req.body;
    const clientId = req.user.userId;

    // Find the project by name
    const project = await Project.findOne({ projectName: projectName });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        details: {
          searchedProjectName: projectName
        }
      });
    }

    // Find the client's profile
    const clientProfile = await Client_Profile.findOne({ client_id: clientId })
      .populate('client_id', 'first_name last_name email');
    
    if (!clientProfile) {
      return res.status(404).json({
        success: false,
        message: 'Client profile not found',
      });
    }

    // Find the consultant's profile
    const consultantProfile = await ConsultantProfile.findById(consultant_id)
      .populate('userId', 'first_name last_name email experience linkedIn education bio skills');
      console.log("consultantprofiledata",consultantProfile);

    if (!consultantProfile) {
      return res.status(404).json({
        success: false,
        message: 'Consultant profile not found',
      });
    }

    // Fetch client reviews
    const clientReviews = await Review.find({ 
      client_id: clientId, 
      status: 'Completed' 
    }).populate('freelancer_id', 'first_name last_name');

    // Calculate client review statistics
    const reviewStats = {
      totalReviews: clientReviews.length,
      averageRating: clientReviews.length > 0 
        ? clientReviews.reduce((sum, review) => sum + review.stars, 0) / clientReviews.length 
        : null,
      reviews: clientReviews.map(review => ({
        freelancerName: `${review.freelancer_id.first_name} ${review.freelancer_id.last_name}`,
        stars: review.stars,
        message: review.message,
        date: review.createdAt
      }))
    };

    // Prepare offer details
    const offerDetails = {
      client: {
        id: clientProfile.client_id._id,
        name: `${clientProfile.client_id.first_name} ${clientProfile.client_id.last_name}`,
        email: clientProfile.client_id.email,
        rating: clientProfile.rating || null,
        reviews: reviewStats
      },
      project: {
        id: project._id,
        name: projectName,
        description: projectDescription
      },
      consultant: {
        id: consultantProfile._id,
        name: `${consultantProfile.firstname || 'N/A'} ${consultantProfile.lastname || 'N/A'}`,
        email: consultantProfile.email || 'N/A',
        experience: consultantProfile.experience || [],
        linkedIn: consultantProfile.linkedIn || 'N/A',
        education: consultantProfile.education || [],
        bio: consultantProfile.bio || 'N/A',
        skills: consultantProfile.skills || 'N/A',
      },
    };

    // Create the offer
    const newOffer = await ConsultantOffer.create({
      consultant_id: consultant_id,
      client_id: clientId,
      project_id: project._id,
      project_name: projectName,
      offerDetails,
      status: 'pending',
    });

    // Create notification
    // await createNotification({
    //   client_id: clientId,
    //   freelancer_id: consultant_id,
    //   project_id: project._id,
    //   project_name: projectName,
    //   message: `You have a new offer for the project "${projectName}"`,
    //   type: 'offer',
    // });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Offer sent successfully',
      offerDetails,
      offerId: newOffer._id
    });
  } catch (error) {
    console.error('Error in sendOfferToConsultant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send offer to consultant',
      error: error.message,
    });
  }
};






// Helper function to calculate client ratings
async function calculateClientRatings(clientId) {
  // This is a placeholder. You'll need to implement actual rating calculation
  // based on your specific ratings model or logic
  try {
    // Example of a simple rating calculation
    const completedProjects = await HireFreelancer.find({
      clientId: clientId,
      status: 'completed'
    });

    // If you have a separate ratings model, you'd fetch and calculate ratings from there
    const ratings = completedProjects.map(project => project.clientRating || 0);
    
    const averageRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : 0;

    return {
      averageRating: averageRating.toFixed(1),
      totalProjects: completedProjects.length
    };
  } catch (error) {
    console.error('Error calculating client ratings:', error);
    return {
      averageRating: '0.0',
      totalProjects: 0
    };
  }
}

// Add this to your routes file
// router.get('/send-offer-to-consultant/:consultantId', authMiddleware, sendOfferToConsultant);


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
        return res.status(500).json({ message: 'Error fetching consultant profile', error });
    }
};








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

  exports.getOffersByClientId = async (req, res) => {
    try {
      // Extract client ID from the request (assuming it's passed in the request params)
      const clientId = req.params.clientId;
  
      // Fetch all offers where client_id matches the given clientId
      const offers = await ConsultantOffer.find({ client_id: clientId })
        .populate('consultant_id', 'first_name last_name email experience linkedIn education bio skills') // Populate consultant details
        .populate('project_id', 'projectName projectDescription'); // Populate project details
        // .sort({ createdAt: -1 }); // Sort by most recent offers
  
      // Check if any offers are found
      if (!offers || offers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No offers found for this client',
        });
      }
  
      // Return the offers in the response
      res.status(200).json({
        success: true,
        message: 'Offers fetched successfully',
        offers: offers,
      });
    } catch (error) {
      console.error('Error fetching offers by client ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch offers',
        error: error.message,
      });
    }
  };
  
  // const ConsultantOffer = require('../models/hire_consultant.model'); // Adjust path as necessary

  exports.getOffersByConsultantId = async (req, res) => {
    try {
      const consultantId = req.params.consultantId;
      console.log("Consultant ID:", consultantId);
  
      const offers = await ConsultantOffer.find({ consultant_id: consultantId })
        .populate('client_id', 'first_name last_name email ')
        .populate('project_id', 'projectName projectDescription');
        // .sort({ createdAt: -1 });
  
      console.log("Offers fetched:", offers);
  
      if (!offers || offers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No offers found for this consultant',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Offers fetched successfully',
        offers,
      });
    } catch (error) {
      console.error('Error fetching offers by consultant ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch offers',
        error: error.message,
      });
    }
  };

  exports.updateOfferStatus = async (req, res) => {
    try {
      const offerId = req.params.offerId;
      const { status } = req.body;
  
      const updatedOffer = await ConsultantOffer.findByIdAndUpdate(
        offerId,
        { status },
        { new: true }
      );
  
      if (!updatedOffer) {
        return res.status(404).json({
          success: false,
          message: 'Offer not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Offer status updated successfully',
        offer: updatedOffer,
      });
    } catch (error) {
      console.error('Error updating offer status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update offer status',
        error: error.message,
      });
    }
  };
  
  
  

  




