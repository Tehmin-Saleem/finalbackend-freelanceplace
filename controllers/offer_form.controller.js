const Offer_Form = require('../models/offer_form.model');
const { createNotification } = require('./notifications.controller');

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

    // Create a notification
    const notificationData = {
      client_id: client_id,
      freelancer_id: freelancer_id,
      job_id: savedOffer._id,
      message: `You have received a new offer for "${job_title}"`
    };

    await createNotification(notificationData);

    res.status(201).json(savedOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Error creating offer', error: error.message });
  }
};

exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer_Form.find()
      .populate('client_id', 'name email')
      .populate('freelancer_id', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Error fetching offers', error: error.message });
  }
};