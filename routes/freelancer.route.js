const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const proposalController = require('../controllers/proposal.controller');
const authMiddleware = require('../middleware/auth.middleware');

const freelancerProfileController = require('../controllers/freelancer_profile.controller');

router.post('/signup', usercontroller.signup);


router.post('/login', usercontroller.login);
router.use(authMiddleware);
router.post('/proposal', authMiddleware, proposalController.createProposal);


router.get('/getproposals', authMiddleware, proposalController.getFreelancerProposals);


router.get('/proposals/:proposalId', authMiddleware, proposalController.getProposalById);


router.put('/proposals/:proposalId', authMiddleware, proposalController.updateProposal);


router.delete('/proposals/:proposalId', authMiddleware, proposalController.deleteProposal);





router.post('/profile', authMiddleware, freelancerProfileController.createOrUpdateProfile);


router.get('/profile/:freelancerId', authMiddleware, freelancerProfileController.getProfileByFreelancerId);


router.put('/profile/:freelancerId', authMiddleware, freelancerProfileController.updateProfile);


router.delete('/profile/:freelancerId', authMiddleware, freelancerProfileController.deleteProfile);
module.exports = router;
