const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Import controllers and middleware
const usercontroller = require('../controllers/user.controller');
const proposalController = require('../controllers/proposal.controller');
const authMiddleware = require('../middleware/auth.middleware');
const freelancerProfileController = require('../controllers/freelancer_profile.controller');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Use an absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images and PDFs Only!');
    }
  }
});
router.get('/profile/image/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', fileName);
  
  
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', filePath);
      return res.status(404).sendFile(path.join(__dirname, '..', 'public', 'default-profile.jpg'));
    }
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(err.status).end();
      }
    });
  });
});

router.get('/profile/portfolios/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', fileName);
  console.log('Attempting to serve portfolio file:', filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status).end();
    }
  });
});


// Routes
router.post('/signup', usercontroller.signup);
router.post('/login', usercontroller.login);

router.use(authMiddleware);

// Proposal routes
router.post('/proposal/:jobPostId', upload.single('attachment'), proposalController.createProposal);
router.get('/getproposals', proposalController.getFreelancerProposals);
router.get('/proposals/:proposalId', proposalController.getProposalById);
router.put('/proposals/:proposalId', proposalController.updateProposal);
router.delete('/proposals/:proposalId', proposalController.deleteProposal);

// Freelancer profile routes
router.post('/profile', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'portfolios', maxCount: 5 } // Adjust maxCount as needed
]), freelancerProfileController.createOrUpdateProfile);

router.get('/profile', authMiddleware, freelancerProfileController.getAuthenticatedProfile);
router.put('/profile/:freelancerId', freelancerProfileController.updateProfile);
router.delete('/profile/:freelancerId', freelancerProfileController.deleteProfile);
router.get('/profile/:profileId', authMiddleware, freelancerProfileController.getProfileByUserId);
module.exports = router;
