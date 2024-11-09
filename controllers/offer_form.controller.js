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
      hourly_rate,
      fixed_price,
      description,
      detailed_description,
      freelancer_id,
      job_title,
      preferred_skills,
      status
    } = req.body;

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
      budget_type,
      hourly_rate: budget_type === 'hourly' ? JSON.parse(hourly_rate) : undefined,
      fixed_price: budget_type === 'fixed' ? fixed_price : undefined,
      client_id,
      description,
      detailed_description,
      freelancer_id,
      job_title,
      preferred_skills: preferred_skills ? JSON.parse(preferred_skills) : [],
      status
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

// Update the getOfferById to look for both _id and job_id
exports.getOfferById = async (req, res) => {
  console.log('getOfferById called with params:', req.params);

  try {
    const { notificationId } = req.params;
    console.log('Extracted notificationId:', notificationId);

    // Validate that notificationId is present
    if (!notificationId) {
      console.log('No notificationId provided in request');
      return res.status(400).json({ message: 'Notification ID is required' });
    }

    // Validate that notificationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      console.log('Invalid ObjectId format:', notificationId);
      return res.status(400).json({ message: 'Invalid Notification ID format' });
    }

    // Find the notification first using the NotificationModel
    const notification = await NotificationModel.findById(notificationId);
    
    if (!notification) {
      console.log('No notification found for ID:', notificationId);
      return res.status(404).json({ message: 'Notification not found' });
    }

    console.log('Found notification:', notification);

    // Use the job_id from notification to find the offer
    const offer = await Offer_Form.findById(notification.job_id);
    console.log('Database query result:', offer);

    // If no offer is found, return 404
    if (!offer) {
      console.log('No offer found for job_id:', notification.job_id);
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Structure the response with the relevant offer details
    const formattedOffer = {
      _id: offer._id,
      job_title: offer.job_title,
      description: offer.description,
      detailed_description: offer.detailed_description,
      budget_type: offer.budget_type,
      hourly_rate: offer.hourly_rate || null,
      fixed_price: offer.fixed_price || null,
      client_id: offer.client_id,
      freelancer_id: offer.freelancer_id,
      preferred_skills: offer.preferred_skills,
      status: offer.status,
      attachment: offer.attachment,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt
    };

    console.log('Sending formatted response:', formattedOffer);
    res.status(200).json(formattedOffer);

  } catch (error) {
    console.error('Error in getOfferById:', {
      message: error.message,
      stack: error.stack,
      notificationId: req.params.notificationId
    });
    res.status(500).json({ 
      message: 'Error fetching offer details', 
      error: error.message 
    });
  }
};