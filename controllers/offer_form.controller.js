const Offer_Form = require('../models/offer_form.model');
const Notification=require("../controllers/notifications.controller")
const mongoose = require('mongoose');
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
      offerId,
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
      offerId,
      preferred_skills: preferred_skills ? JSON.parse(preferred_skills) : [],
      status
    });

    console.log('New Offer to be saved:', newOffer);

    const savedOffer = await newOffer.save();

    // Create a notification
    const notificationData = {
      client_id: client_id,
      freelancer_id: freelancer_id,
      job_id: savedOffer._id,
      type: 'new_offer',
      message: `You have received a new offer for "${job_title}"`
    };

    console.log('Creating new offer notification:', notificationData);
    await Notification.createNotification(notificationData);

    res.status(201).json(savedOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Error creating offer', error: error.message });
  }
};




exports.getOfferById = async (req, res) => {
  try {
    // Assuming `offerId` is provided in the frontend URL as a query parameter
    const offerId = req.query.offerId; 

    if (!offerId) {
      return res.status(400).json({ message: 'Offer ID is required' });
    }

    // Fetch the offer using `offerId`
    const offer = await Offer_Form.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Get client profile details based on `offer.client_id`
    const clientProfile = await Client_Profile.findOne({ client_id: offer.client_id });
    const clientDetails = clientProfile
      ? {
          name: `${clientProfile.first_name} ${clientProfile.last_name}`.trim(),
          country: clientProfile.country,
          image: clientProfile.image,
          email: clientProfile.email,
          languages: clientProfile.languages,
          about: clientProfile.about,
          gender: clientProfile.gender,
          DOB: clientProfile.DOB,
        }
      : null;

    // Get freelancer details based on `offer.freelancer_id`
    const freelancerDetails = await User.findById(offer.freelancer_id).select(
      'name email location ratings totalProjects earnings skills'
    );

    // Combine all details into a single response
    const completeOffer = {
      ...offer.toObject(),
      client_details: clientDetails,
      freelancer_details: freelancerDetails,
    };

    res.status(200).json(completeOffer);
  } catch (error) {
    console.error('Error fetching offer details:', error);
    res.status(500).json({ message: 'Error fetching offer details', error: error.message });
  }
};



