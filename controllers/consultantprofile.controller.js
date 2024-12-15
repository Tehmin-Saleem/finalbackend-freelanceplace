const ConsultantProfile = require('../models/consultantprofile');
const Project = require('../models/manageProject.model')
const User = require('../models/consultantprofile'); // Adjust the path as needed
const Client_Profile = require('../models/client_profile.model'); // Adjust the path as needed
const HireFreelancer = require('../models/hire_freelancer.model'); // Adjust the path as needed
const ConsultantOffer = require('../models/hire_consultant.model'); // Adjust the path as needed
const Review= require('../models/review.model')
const { createNotification } = require('../controllers/notifications.controller')
const mongoose = require('mongoose');

exports.createProfile = async (req, res) => {
  try {
    console.log('Received profile data:', req.body);
    console.log('Authenticated user:', req.user);

    const consultant_id = req.user && (req.user.userId || req.user.id); // Extract consultant_id
    const profileData = req.body;

    // Ensure `skills` is always a string
    // if (profileData.skills && Array.isArray(profileData.skills)) {
    //   profileData.skills = profileData.skills.join(', ');
    // }
    const skills = Array.isArray(req.body.skills)
    ? req.body.skills
    : JSON.parse(req.body.skills || "[]");

if (!Array.isArray(skills)) {
    throw new Error("Invalid skills format. Expected an array.");
}

    // Assign `consultant_id` and `userId`
    profileData.consultant_id = consultant_id;
    profileData.userId = req.user.id;

    console.log('Processed profile data:', profileData);

    // Handle profile picture upload
    if (req.file) {
      profileData.profilePicture = req.file.path;
      console.log('Profile picture uploaded:', req.file.path);
    }

    // Check if a profile already exists for this `consultant_id`
    let profile = await ConsultantProfile.findOne({ consultant_id });

    if (profile) {
      // Update the existing profile
      profile = await ConsultantProfile.findOneAndUpdate(
        { consultant_id },
        profileData,
        { new: true, runValidators: true } // Return the updated profile
      );
      console.log('Profile updated successfully:', profile);

      res.status(200).json({
        message: 'Profile updated successfully',
        profile,
        toast: {
          type: 'success',
          message: 'Your profile has been updated successfully!',
        },
      });
    } else {
      // Create a new profile
      const newProfile = new ConsultantProfile(profileData);
      await newProfile.save();

      console.log('New profile created successfully:', newProfile);

      res.status(201).json({
        message: 'Profile created successfully',
        profile: newProfile,
        toast: {
          type: 'success',
          message: 'Your profile has been created successfully!',
        },
      });
    }
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    res.status(500).json({
      message: 'Error processing profile',
      error: error.message,
      toast: {
        type: 'error',
        message: 'Failed to process profile. Please try again.',
      },
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
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(consultant_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultant ID format',
      });
    }

    const consultantId = new mongoose.Types.ObjectId(consultant_id);

    // Find the consultant's profile
  // Find the consultant's profile
console.log("Finding consultant profile with ID:", consultant_id);
const consultantProfile = await ConsultantProfile.findOne({ 
  consultant_id: consultant_id 
}).populate('userId', 'first_name last_name email experience linkedIn education bio skills');
console.log("Consultant Profile Found:", consultantProfile);
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
        description: projectDescription,
        

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

    const clientName = `${clientProfile.client_id.first_name} ${clientProfile.client_id.last_name}`;

    // Create the offer
    const newOffer = await ConsultantOffer.create({
      consultant_id: consultant_id,
      client_id: clientId,
      project_id: project._id,
      project_name: projectName,
      offerDetails: {
        client: {
          id: clientProfile.client_id._id,
          name: clientName,
          email: clientProfile.client_id.email
        },
        project: {
          id: project._id,
          name: projectName,
          description: projectDescription
        }
      },
      status: 'pending',
    });

    // Create notification
    const notificationData = {
      client_id: clientId,
      consultant_id: consultant_id,
      job_id: project._id,
      message: `${clientName} has sent you an offer for his job ${projectName}`,
      type: 'new_offer',
      senderId: clientId,
     
      
    };
    await createNotification(notificationData);
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
    const consultantId = req.params.consultantId; // Use consultantId from route params
    if (!consultantId) {
      return res.status(400).json({ message: 'Consultant ID is required' });
    }

    const profile = await ConsultantProfile.findOne({ consultant_id: consultantId }) // Find profile by consultant_id
      .sort({ createdAt: -1 }); // Get the most recent profile

    if (!profile) {
      return res.status(404).json({ message: 'Consultant profile not found' });
    }

    // Ensure skills are returned as an array
    if (profile.skills && typeof profile.skills === 'string') {
      profile.skills = profile.skills.split(', ');
    }

    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultant profile', error });
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
      console.log("Consultant ID received:", consultantId);
  
      const offers = await ConsultantOffer.find({ consultant_id: consultantId })
        .populate('client_id', 'first_name last_name email')
        .populate('project_id', 'projectName projectDescription')
        .lean(); // Ensure the response is a plain object
  
      // Map and ensure the nested structure is preserved
      const formattedOffers = offers.map((offer) => ({
        ...offer,
        offerDetails: {
          project: {
            name: offer.project_id?.projectName || "N/A",
            description: offer.project_id?.projectDescription || "N/A",
            status: offer.status || "pending", // Include status here
          },
          client: {
            name: `${offer.client_id?.first_name || "N/A"} ${offer.client_id?.last_name || ""}`.trim(),
          },
        },
      }));
  
      console.log("Formatted Offers:", formattedOffers);
  
      if (!formattedOffers.length) {
        return res.status(404).json({
          success: false,
          message: "No offers found for this consultant",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Offers fetched successfully",
        offers: formattedOffers,
      });
    } catch (error) {
      console.error("Error fetching offers by consultant ID:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch offers",
        error: error.message,
      });
    }
  };
  
  


  exports.updateOfferStatus = async (req, res) => {
    try {
      const { offerId } = req.params;
      const { status } = req.body;
  
      // Validate the status
      if (!['Accepted', 'Declined'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
  
      // Update the offer in the database
      const updatedOffer = await ConsultantOffer.findByIdAndUpdate(
        offerId,
        { status },
        { new: true } // Return the updated document
      );
  
      if (!updatedOffer) {
        return res.status(404).json({ message: 'Offer not found.' });
      }
  
      res.status(200).json({
        message: 'Offer status updated successfully.',
        offer: updatedOffer,
      });
    } catch (error) {
      console.error('Error updating offer status:', error);
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
  };
  
  

// Endpoint to send project details
exports.sendProjectDetailsToConsultant= async (req, res) => {
  const { consultantId } = req.params;
  const { projectTitle, projectDescription, deadline, githubUrl, additionalNotes } = req.body;

  try {
    // Validate consultant offer exists
    const offer = await ConsultantOffer.findOne({
      consultantId,
      status: 'Accepted',
    });

    if (!offer) {
      return res.status(404).json({ message: 'Accepted offer not found for this consultant.' });
    }

    // Save project details to the offer
    offer.projectDetails = {
      projectTitle,
      projectDescription,
      deadline,
      githubUrl,
      additionalNotes,
    };

    await offer.save();

    res.status(200).json({ message: 'Project details sent successfully!', offer });
  } catch (error) {
    console.error('Error sending project details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  

  




