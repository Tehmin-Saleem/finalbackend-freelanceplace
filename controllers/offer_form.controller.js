const Offer_Form = require('../models/offer_form.model');
const { body, validationResult } = require('express-validator');

exports.createoffer = (sendNotification) => ({
  createoffer: [
    // Input validation
    body('job_title').notEmpty().withMessage('Job title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('budget_type').isIn(['hourly', 'fixed']).withMessage('Invalid budget type'),
    body('hourly_rate').if(body('budget_type').equals('hourly')).isObject().withMessage('Hourly rate must be an object'),
    body('fixed_price').if(body('budget_type').equals('fixed')).isNumeric().withMessage('Fixed price must be a number'),
    body('preferred_skills').isArray().withMessage('Preferred skills must be an array'),
    async (req, res) => {
      
        console.log("Received offer creation request");
        console.log("Request body:", req.body);
        console.log("File:", req.file);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }


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
          // Check file size (e.g., limit to 5MB)
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
          preferred_skills: preferred_skills ? preferred_skills.split(',').map(skill => skill.trim()) : [],
          status
        });

        const savedOffer = await newOffer.save();

        if (sendNotification && typeof sendNotification === 'function') {
          sendNotification(freelancer_id, {
            type: 'new_offer',
            message: `You have received a new offer for "${job_title}"`,
            offerId: savedOffer._id
          });
        }

      
        res.status(201).json(savedOffer);
      } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({ message: 'Error creating offer', error: error.message });
      }
    }
  ],

  getOffers: async (req, res) => {
    try {
      const offers = await Offer_Form.find()
        .populate('client_id', 'name email') // Adjust fields as needed
        .populate('freelancer_id', 'name email') // Adjust fields as needed
        .sort({ createdAt: -1 });
      res.status(200).json(offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      res.status(500).json({ message: 'Error fetching offers', error: error.message });
    }
  },


});

