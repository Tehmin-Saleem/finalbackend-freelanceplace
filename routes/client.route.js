const express = require('express');

const { signup, login } = require('../controllers/user.controller');
const ReviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');
const jobPostController = require('../controllers/post_job.controller');
const reviewRequestController = require("../controllers/review_request.controller");
const paymentMethodController = require('../controllers/payment_method.controller');
const proposalController = require("../controllers/proposal.controller")
const path = require('path');
const usercontroller=require ('../controllers/user.controller')
const { upload } = require('../config/cloudinary.config');// const { forgotPassword, resetPassword } = require('../controllers/user.controller');
const ClientProfile= require('../controllers/client_profile.controller')
const Notification= require ('../controllers/notifications.controller')
const consultantProfileController=require ('../controllers/consultantprofile.controller')
const manageProject = require('../controllers/Manageproj.controller')
const { addRemark, getRemarks, getRemarksByProjectAndClient } = require('../controllers/Remark.controller');



const queryController = require('../controllers/query.controller');

// Import Chat controller
const chatController = require('../controllers/chat.controller'); // Add this
const offerController = require ('../controllers/offer_form.controller')

const hireFreelancerController = require('../controllers/hire_freelancer.controller');

const Proposal = require('../models/proposal.model');
const { getFreelancerDetailsByProposal, getProposalById } = require('../controllers/proposal.controller');
const router = express.Router();

// Assume io is defined in your server.js file
const socketIo = require('socket.io'); // Import socket.io
const io = socketIo(); // Create an io instance




router.post('/signup', signup);
router.get('/users/:userId', usercontroller.getUserById);
router.get('/users', usercontroller.getAllUsers);
router.post('/login', login);
// router.use(authMiddleware);

router.post('/ForgotPass', usercontroller.forgotPassword);
router.post('/ChangePass/:id/:token',usercontroller.ChangePass);


router.use(authMiddleware);

router.get('/validate-token', authMiddleware, usercontroller.validateToken);

router.post('/uploads', upload.single('File'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    res.status(200).send({ fileName: file.filename });
  } catch (error) {
    res.status(500).send('Server error');
  }
});
router.get('/jobpost/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, '../uploads', fileName); 
  res.sendFile(filePath);
});
router.post('/clientprofile', authMiddleware, upload.single('image'), ClientProfile.createProfile);
router.get('/profile', authMiddleware, ClientProfile.getProfile);
router.put('/profile/update', upload.single('image'), ClientProfile.updateProfile);
router.get('/client-profile-exists/:id', authMiddleware, ClientProfile.profileExists);


// In your routes file
router.get('/profile/:userId', authMiddleware, ClientProfile.checkClientProfile);

router.get('/notifications', authMiddleware, Notification.getNotifications);
router.post('/notifications', authMiddleware, Notification.createNotification);
router.put('/notifications/:notificationId/read', authMiddleware, Notification.updateNotification);
router.get('/notifications/unread-count', authMiddleware, Notification.getUnreadNotificationsCount);

router.post('/reviews', ReviewController.createReview);


router.get('/reviews', ReviewController.getClientReviews);


router.put('/reviews/:reviewId', ReviewController.updateReview);


router.delete('/reviews/:reviewId', ReviewController.deleteReview);


router.post('/review-requests', reviewRequestController.createReviewRequest);


router.get('/review-requests', reviewRequestController.getClientReviewRequests);


router.post('/jobpost', upload.single('attachment'), jobPostController.createJobPost);

// router.get('/offerform', reviewRequestController.getClientReviewRequests);


router.post('/offerform', authMiddleware, upload.single('attachment'), offerController.createoffer);

router.get('/job-posts', jobPostController.getAllJobPosts);
router.get('/jobposts', jobPostController.getClientJobPosts);

router.get('/job-posts/:jobPostId', jobPostController.getJobPostById);


router.put('/job-posts/:jobPostId', jobPostController.updateJobPost);


router.delete('/job-posts/:jobPostId', jobPostController.deleteJobPost);


router.post('/payment-methods', paymentMethodController.createPaymentMethod);


router.get('/payment-methods', paymentMethodController.getClientPaymentMethods);


router.get('/payment-methods/:paymentMethodId', paymentMethodController.getPaymentMethodById);


router.put('/payment-methods/:paymentMethodId', paymentMethodController.updatePaymentMethod);


router.delete('/payment-methods/:paymentMethodId', paymentMethodController.deletePaymentMethod);




router.post('/create-paypal-order', paymentMethodController.createPayPalOrder);
router.post('/capture-paypal-payment', paymentMethodController.capturePayPalPayment);


// Route to fetch freelancer payment details  
router.get('/payment-method/:freelancerId', paymentMethodController.getFreelancerPaymentDetails);



// routes/paymentRoutes.js
// router.patch('/update-payment-status/:proposal_id', authMiddleware,  paymentMethodController.updatePaymentStatus);





// Route to process payment for a freelancer  
router.post('/process-payment',paymentMethodController.processPaymentForFreelancer);  

router.post('/mark-milestone-paid', paymentMethodController.markMilestoneAsPaid);


router.get('/milestone/:milestoneId', paymentMethodController.getMilestoneDetails); 

router.get('/project/:projectId/milestones', paymentMethodController.getProjectMilestones);





router.post('/hire/:proposalId', authMiddleware, hireFreelancerController.hireFreelancer);
router.put('/hire/:hireRequestId', hireFreelancerController.updateHireRequest);


router.delete('/hire/:hireRequestId', hireFreelancerController.deleteHireRequest);
router.put(
  '/update-profile',
  authMiddleware,
  upload.single('profilePicture'), // If you're handling file uploads
  consultantProfileController.updateProfile
);

// route for getting freelancer details for specific proposal id
router.get("/proposal/:proposalId", proposalController.getProposalById);








router.get('/hire/:proposalId', hireFreelancerController.getHireRequestById);
router.get('/hire', hireFreelancerController.getAllHireData);



// router.get("/SearchAllUsers", authMiddleware, usercontroller.SearchallUsers);
router.get("/SearchFreelancers", authMiddleware, usercontroller.searchFreelancers);




// Chat-related routes



router.post('/accesschats',authMiddleware, chatController.accessChat);
router.get('/fetchchats', authMiddleware, chatController.fetchChats);
router.delete('/deletechat/:chatId',authMiddleware, chatController.deleteChat);
router.delete('/Message/:id',authMiddleware, chatController.deleteMessage);




// message-related routes


router.get("/allMessages/:chatId", authMiddleware, chatController.allMessages);
router.post("/sendMessage", authMiddleware, chatController.sendMessage);


// router.get('/api/queries', async (req, res) => {
//   try {
//       const queries = await Query.find(); // Adjust according to your database
//       res.json(queries);
//   } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//   }
// });
router.post('/query',authMiddleware, queryController.createQuery);

// Route to get all queries (optional, for admin or dashboard)
router.get('/queries', queryController.getAllQueries);


router.get('/users' ,authMiddleware,queryController.getUser);


router.get('/count',usercontroller.getAllClient);

router.get('/clientslist',usercontroller.getallclientlist);

router.get('/queries/:id', authMiddleware, queryController.getQueryById);

router.patch('/queries/:id', authMiddleware, queryController.updatequery);
router.patch('/softban/:id',authMiddleware,usercontroller.clientsoftban);
router.delete('/ban/:id',authMiddleware,usercontroller.clientban);
router.patch('/unban/:id', authMiddleware,usercontroller.ClientUnban);



// const upload = multer({ dest: 'uploads/' });

router.post('/Constprofile', upload.single('profilePicture'),authMiddleware, consultantProfileController.createProfile);
router.get('/Constprofile/:consultantId', authMiddleware, consultantProfileController.getProfileByUserId);
router.get('/ConsultantsProfiles', authMiddleware,consultantProfileController.getConsultantProfiles);
// In your routes file
router.get('/filtered-jobs', authMiddleware, hireFreelancerController.getFilteredJobs);
router.get('/count-job-posts/:clientId',authMiddleware, jobPostController.countJobPostsByClientId);





// In your routes file
router.get('/ongoing-projects', authMiddleware, hireFreelancerController.getClientOngoingProjects);
router.get('/accepted-offers', authMiddleware, offerController.getClientAcceptedOffers);
router.get('/dashboard-stats/:userId', authMiddleware, offerController.getClientAllJobAndOffersCounts);

router.post('/send-offer-to-consultant/:consultant_id', authMiddleware, consultantProfileController.sendOfferToConsultant);

router.get('/hired-freelancers-count/:clientId', hireFreelancerController.getHiredFreelancersCountByClientId);

router.get('/freelancers-engaged-count/:clientId', hireFreelancerController.getFreelancersEngagedCountByClientId);


// Get all projects progress for a client
router.get(
  '/client/:client_id/projects/progress', 
  authMiddleware, 
  manageProject.getClientJobsProgress
);

// Get specific project progress
// router.get(
//   '/:client_id/project/:project_id/progress', 
//   authMiddleware, 
//   manageProject.getSpecificJobProgress
// );



router.get('/project-progress/:proposal_id', authMiddleware, manageProject.getProjectProgress);



router.get('/offer-progress', authMiddleware, manageProject.getOfferProgress);


router.post(
  '/complete-project/:projectId',
  authMiddleware,
  hireFreelancerController.markProjectAsCompleted
);


// routes/clientRoutes.js

router.post('/complete-offer/:projectId',authMiddleware, hireFreelancerController.markOfferAsCompleted);

router.get('/job-status/:jobId',authMiddleware, jobPostController.getJobStatus);
router.patch('/proposals/:proposalId/status', authMiddleware, jobPostController.updateProposalStatus);
router.get('/completed-jobs-count/:clientId', authMiddleware, hireFreelancerController.getClientCompletedJobsCount);




router.get('/completed-jobs/:freelancerId', authMiddleware, hireFreelancerController.getFreelancerCompletedJobs);

///Consulatnts Routes/////
router.get('/consultantoffers/:clientId', authMiddleware, consultantProfileController.getOffersByClientId);
router.get('/offer/:consultantId',authMiddleware, consultantProfileController.getOffersByConsultantId);
router.put('/offer/:offerId', authMiddleware, consultantProfileController.updateOfferStatus);

router.post('/sendProjectDetails/:consultantId', authMiddleware, consultantProfileController.sendProjectDetailsToConsultant);

router.get('/project-details/:offerId',authMiddleware, consultantProfileController.getProjectDetailsByOfferId);

router.post('/add',authMiddleware, addRemark);

// GET: Fetch all remarks for a specific offer and consultant
router.get('/:offerId/:consultantId', authMiddleware, getRemarks);
router.get('/offers/count/:consultantId',consultantProfileController.getOfferCountsByConsultantId);
router.get('/getRemarksByProjectAndClient/:job_title/:clientId', getRemarksByProjectAndClient);

module.exports = router;



