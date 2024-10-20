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

const Notification= require ('../controllers/notifications.controller')

const queryController = require('../controllers/query.controller');

// Import Chat controller
const chatController = require('../controllers/chat.controller'); // Add this
const offerController = require ('../controllers/offer_form.controller')

const hireFreelancerController = require('../controllers/hire_freelancer.controller');

const Proposal = require('../models/proposal.model');
const { getFreelancerDetailsByProposal, getProposalById } = require('../controllers/proposal.controller');
const router = express.Router();



router.post('/signup', signup);
router.get('/users/:userId', usercontroller.getUserById);
router.get('/users', usercontroller.getAllUsers);
router.post('/login', login);

router.post('/ForgotPass', usercontroller.forgotPassword);
router.post('/ChangePass/:id/:token',usercontroller.ChangePass);


router.use(authMiddleware);


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





router.post('/hire', hireFreelancerController.createHireRequest);


router.get('/hire', hireFreelancerController.getClientHireRequests);


router.get('/hire/:hireRequestId', hireFreelancerController.getHireRequestById);


router.put('/hire/:hireRequestId', hireFreelancerController.updateHireRequest);


router.delete('/hire/:hireRequestId', hireFreelancerController.deleteHireRequest);


// route for getting freelancer details for specific proposal id
router.get("/proposal/:proposalId", proposalController.getProposalById);



router.get("/SearchAllUsers", authMiddleware, usercontroller.SearchallUsers);




// Chat-related routes



router.post('/accesschats',authMiddleware, chatController.accessChat);
router.get('/fetchchats', authMiddleware, chatController.fetchChats);
router.post('/group',authMiddleware, chatController.createGroupChat);
router.put("/rename",authMiddleware, chatController.renameGroup);
router.put("/groupremove" , authMiddleware, chatController.removeFromGroup);
router.put("/groupadd", authMiddleware, chatController.addToGroup);


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


module.exports = router;

