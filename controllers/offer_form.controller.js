const Offer_Form = require('../models/offer_form.model');
const Notification = require("../controllers/notifications.controller");
const mongoose = require('mongoose');
const NotificationModel = require('../models/notifications.model');
exports.createoffer = async (req, res) => {
  console.log('Offer Controller: createoffer hit');
  console.log('Request body:', req.body);
  console.log('Attached file:', req.file);

  try {
    const {
      budget_type,
      hourly_rate_from,
      hourly_rate_to,
      fixed_price,
      description,
      detailed_description,
      freelancer_id,
      job_title,
      preferred_skills,
    
    } = req.body;
    console.log('Budget type:', budget_type);
    console.log('Hourly rates (raw):', { from: hourly_rate_from, to: hourly_rate_to });
    console.log('Fixed price (raw):', fixed_price);
    let budget = {
      budget_type: budget_type
    };

    if (budget_type === 'hourly') {
      // Convert and validate hourly rates
      const from = hourly_rate_from ? parseFloat(hourly_rate_from) : null;
      const to = hourly_rate_to ? parseFloat(hourly_rate_to) : null;
      
      console.log('Parsed hourly rates:', { from, to });

      if (from === null || to === null) {
        console.log('Hourly rate validation failed');
        return res.status(400).json({ message: 'Hourly rate values are required for hourly budget type' });
      }

      if (from > to) {
        console.log('Invalid rate range: minimum exceeds maximum');
        return res.status(400).json({ message: 'Minimum hourly rate cannot exceed maximum rate' });
      }

      budget.hourly_rate = {
        from: from,
        to: to
      };
    } else if (budget_type === 'fixed') {
      // Convert and validate fixed price
      const price = fixed_price ? parseFloat(fixed_price) : null;
      console.log('Parsed fixed price:', price);

      if (price === null) {
        console.log('Fixed price validation failed');
        return res.status(400).json({ message: 'Fixed price is required for fixed budget type' });
      }

      budget.fixed_price = price;
    }

    const client_id = req.user.userId || req.user.id;
    if (!client_id) {
      return res.status(400).json({ message: 'Client ID not found in the request' });
    }

    let attachment = null;
    if (req.file) {
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'File size exceeds limit (5MB)' });
      }
      attachment = {
        fileName: req.file.originalname,
        path: req.file.path,
        description: req.body.attachmentDescription
      };
    }

    // Create the new offer first
    const newOffer = new Offer_Form({
      attachment,
      ...budget,
      client_id,
      description,
      detailed_description,
      freelancer_id,
      job_title,
      preferred_skills: preferred_skills ? JSON.parse(preferred_skills) : [],
      status: 'pending', // Initial status
    
    });

    console.log('New Offer to be saved:', newOffer);

    const savedOffer = await newOffer.save();
    console.log('Saved offer:', savedOffer);

    // Create a notification using the correct offer ID (_id from saved offer)
    const notificationData = {
      client_id: client_id,
      freelancer_id: freelancer_id,
      job_id: savedOffer._id, // This is the correct offer ID
      type: 'new_offer',
      message: `You have received a new offer for "${job_title}"`
    };

    console.log('Creating new offer notification with correct offer ID:', notificationData);
    await Notification.createNotification(notificationData);

    // Return the saved offer with its ID
    res.status(201).json({
      ...savedOffer.toObject(),
      offerId: savedOffer._id // Include the offer ID explicitly in the response
    });

  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Error creating offer', error: error.message });
  }
};

exports.getOfferById = async (req, res) => {
  try {
      const { notificationId } = req.params;
      const { status } = req.body;
      console.log('Getting offer details - notificationId:', notificationId);

      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
          return res.status(400).json({ message: 'Invalid Offer ID format' });
      }

      let offer = await Offer_Form.findById(notificationId).populate('client_id', 'first_name last_name country_name');
      console.log('Found offer in database:', offer);

      if (!offer) {
          return res.status(404).json({ message: 'Offer not found' });
      }

      // If status is provided in query params, update the offer status
      if (status && ['accepted', 'declined'].includes(status)) {
          console.log('Updating offer status to:', status);
          offer.status = status;
          await offer.save();
          console.log('Offer status updated in database');

          // Create notification for the client
          const notificationMessage = status === 'accepted'
              ? `Your offer for "${offer.job_title}" has been accepted`
              : `Your offer for "${offer.job_title}" has been declined`;

          const notificationData = {
              client_id: offer.client_id._id,
              freelancer_id: offer.freelancer_id,
              job_id: notificationId,  // Using the same ID
              type: `offer_${status}`,
              message: notificationMessage
          };

          console.log('Creating notification with data:', notificationData);
          await Notification.createNotification(notificationData);
      }

      let budgetDetails;
      if (offer.budget_type === 'hourly' && offer.hourly_rate) {
          budgetDetails = {
              budget_type: 'hourly',
              hourly_rate: {
                  from: offer.hourly_rate.from,
                  to: offer.hourly_rate.to
              }
          };
      } else if (offer.budget_type === 'fixed' && offer.fixed_price) {
          budgetDetails = {
              budget_type: 'fixed',
              fixed_price: offer.fixed_price
          };
      } else {
          budgetDetails = {
              budget_type: 'unknown',
              message: 'Budget details are not available'
          };
      }

      const formattedOffer = {
          _id: offer._id,
          status: offer.status,
          clientFirstName: offer.client_id.first_name,
          clientLastName: offer.client_id.last_name,
          clientCountry: offer.client_id.country_name,
          location: offer.location,
          job_title: offer.job_title,
          ...budgetDetails,
          description: offer.description,
          detailed_description: offer.detailed_description,
          preferred_skills: offer.preferred_skills,
          attachment: offer.attachment ? {
              fileName: offer.attachment.fileName,
              path: offer.attachment.path
          } : null 
      };

      console.log('Sending formatted offer:', formattedOffer);
      res.status(200).json(formattedOffer);
  } catch (error) {
    console.error('Error in getOfferById:', error);
    res.status(500).json({ 
      message: 'Error fetching offer details', 
      error: error.message 
    });
  }
};


exports.updateOfferStatus = async (req, res) => {
  try {
      const { notificationId } = req.params;  // Changed from offerId to notificationId
      const { status } = req.body;
      console.log('Updating offer status - ID:', notificationId, 'Status:', status);

      if (!['accepted', 'declined'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status' });
      }

      const offer = await Offer_Form.findById(notificationId);
      console.log('Found offer for status update:', offer);

      if (!offer) {
          return res.status(404).json({ message: 'Offer not found' });
      }

      // Update status
      offer.status = status;
      const updatedOffer = await offer.save();
      console.log('Offer status updated to:', updatedOffer.status);

      // Create notification for the client
      const notificationMessage = status === 'accepted'
          ? `Your offer for "${offer.job_title}" has been accepted`
          : `Your offer for "${offer.job_title}" has been declined`;

      const notificationData = {
          client_id: offer.client_id,
          freelancer_id: offer.freelancer_id,
          job_id: offer._id,
          type: `offer_${status}`,
          message: notificationMessage
      };

      console.log('Creating notification:', notificationData);
      await Notification.createNotification(notificationData);

      res.status(200).json({ 
          message: `Offer ${status} successfully`,
          offer: updatedOffer 
      });
  } catch (error) {
      console.error('Error updating offer status:', error);
      res.status(500).json({ message: 'Error updating offer status', error: error.message });
  }
};

// exports.createoffer = async (req, res) => {
//   console.log('Offer Controller: createoffer hit');
//   console.log('Request body:', req.body);
//   console.log('Attached file:', req.file);

//   try {
//     const {
//       budget_type,
//       hourly_rate_from,
//       hourly_rate_to,
//       fixed_price,
//       description,
//       detailed_description,
//       freelancer_id,
//       job_title,
//       preferred_skills,
//       notificationId 
//     } = req.body;
//     console.log('Budget type:', budget_type);
//     console.log('Hourly rates (raw):', { from: hourly_rate_from, to: hourly_rate_to });
//     console.log('Fixed price (raw):', fixed_price);
//     let budget = {
//       budget_type: budget_type
//     };

//     if (budget_type === 'hourly') {
//       // Convert and validate hourly rates
//       const from = hourly_rate_from ? parseFloat(hourly_rate_from) : null;
//       const to = hourly_rate_to ? parseFloat(hourly_rate_to) : null;
      
//       console.log('Parsed hourly rates:', { from, to });

//       if (from === null || to === null) {
//         console.log('Hourly rate validation failed');
//         return res.status(400).json({ message: 'Hourly rate values are required for hourly budget type' });
//       }

//       if (from > to) {
//         console.log('Invalid rate range: minimum exceeds maximum');
//         return res.status(400).json({ message: 'Minimum hourly rate cannot exceed maximum rate' });
//       }

//       budget.hourly_rate = {
//         from: from,
//         to: to
//       };
//     } else if (budget_type === 'fixed') {
//       // Convert and validate fixed price
//       const price = fixed_price ? parseFloat(fixed_price) : null;
//       console.log('Parsed fixed price:', price);

//       if (price === null) {
//         console.log('Fixed price validation failed');
//         return res.status(400).json({ message: 'Fixed price is required for fixed budget type' });
//       }

//       budget.fixed_price = price;
//     }

//     const client_id = req.user.userId || req.user.id;
//     if (!client_id) {
//       return res.status(400).json({ message: 'Client ID not found in the request' });
//     }

//     let attachment = null;
//     if (req.file) {
//       if (req.file.size > 5 * 1024 * 1024) {
//         return res.status(400).json({ message: 'File size exceeds limit (5MB)' });
//       }
//       attachment = {
//         fileName: req.file.originalname,
//         path: req.file.path,
//         description: req.body.attachmentDescription
//       };
//     }

//     // Create the new offer first
//     const newOffer = new Offer_Form({
//       attachment,
//       ...budget,
//       client_id,
//       description,
//       detailed_description,
//       freelancer_id,
//       job_title,
//       preferred_skills: preferred_skills ? JSON.parse(preferred_skills) : [],
//       status: 'pending',
//       job_id: notificationId
//     });

//     console.log('New Offer to be saved:', newOffer);

//     const savedOffer = await newOffer.save();
//     console.log('Saved offer:', savedOffer);

//     // Create a notification using the correct offer ID (_id from saved offer)
//     const notificationData = {
//       client_id: client_id,
//       freelancer_id: freelancer_id,
//       job_id: savedOffer._id, // This is the correct offer ID
//       type: 'new_offer',
//       message: `You have received a new offer for "${job_title}"`
//     };

//     console.log('Creating new offer notification with correct offer ID:', notificationData);
//     await Notification.createNotification(notificationData);

//     // Return the saved offer with its ID
//     res.status(201).json({
//       ...savedOffer.toObject(),
//       offerId: savedOffer._id // Include the offer ID explicitly in the response
//     });

//   } catch (error) {
//     console.error('Error creating offer:', error);
//     res.status(500).json({ message: 'Error creating offer', error: error.message });
//   }
// };
// exports.updateOfferStatus = async (req, res) => {
//   try {
//     const { notificationId } = req.params;
//     const { status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(notificationId)) {
//       return res.status(400).json({ message: 'Invalid offer ID format' });
//     }

//     // Find offer by job_id
//     const offer = await Offer_Form.findOne({ job_id: notificationId });
//     if (!offer) {
//       return res.status(404).json({ message: 'Offer not found' });
//     }

//     // Check if offer is already accepted or declined
//     if (offer.status !== 'pending') {
//       return res.status(400).json({ 
//         message: 'Cannot update offer status', 
//         currentStatus: offer.status 
//       });
//     }

//     // Update offer status
//     offer.status = status;
//     const updatedOffer = await offer.save();

//     // Create notification for client about offer status change
//     const notificationMessage = status === 'accepted' 
//       ? `Your offer for "${offer.job_title}" has been accepted`
//       : `Your offer for "${offer.job_title}" has been declined`;

//     const notificationData = {
//       client_id: offer.client_id,
//       freelancer_id: offer.freelancer_id,
//       job_id: notificationId,
//       type: `offer_${status}`,
//       message: notificationMessage
//     };
    
//     await Notification.createNotification(notificationData);

//     res.status(200).json(updatedOffer);
//   } catch (error) {
//     console.error('Error updating offer status:', error);
//     res.status(500).json({ message: 'Error updating offer status', error: error.message });
//   }
// };

// // Update getOfferById to find by job_id instead of _id
// exports.getOfferById = async (req, res) => {
//   try {
//     const { notificationId } = req.params;
//     console.log('notificationId', notificationId);

//     if (!mongoose.Types.ObjectId.isValid(notificationId)) {
//       return res.status(400).json({ message: 'Invalid Offer ID format' });
//     }
exports.getOffersByFreelancerId = async (req, res) => {
  console.log('getOffersByFreelancerId called with params:', req.params);

  try {
    const { freelancerId } = req.params;

    // Validate that freelancerId is provided
    if (!freelancerId) {
      return res.status(400).json({ message: 'Freelancer ID is required' });
    }

    // Validate that freelancerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
      return res.status(400).json({ message: 'Invalid Freelancer ID format' });
    }

    // Find all offers where freelancer_id matches the provided ID
    const offers = await Offer_Form.find({ freelancer_id: freelancerId }).populate('client_id', 'name'); // Populate client details if needed

    // Check if offers were found
    if (offers.length === 0) {
      return res.status(404).json({ message: 'No offers found for this freelancer' });
    }

    // Send the offers as the response
    res.status(200).json(offers);

  } catch (error) {
    console.error('Error fetching offers for freelancer:', error);
    res.status(500).json({ 
      message: 'Error fetching offers for freelancer', 
      error: error.message 
    });
  }
};
