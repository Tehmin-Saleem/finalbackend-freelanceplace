const express = require('express');

const { signup, login } = require('../controllers/user.controller');
const ReviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');
const jobPostController = require('../controllers/post_job.controller');
const reviewRequestController = require("../controllers/review_request.controller");
const paymentMethodController = require('../controllers/payment_method.controller');

const hireFreelancerController = require('../controllers/hire_freelancer.controller');
const upload = require('../config/multer'); 
const router = express.Router();


router.post('/signup', signup);


router.post('/login', login);


router.use(authMiddleware);


router.post('/upload', upload.single('File'), (req, res) => {
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


router.post('/reviews', ReviewController.createReview);


router.get('/reviews', ReviewController.getClientReviews);


router.put('/reviews/:reviewId', ReviewController.updateReview);


router.delete('/reviews/:reviewId', ReviewController.deleteReview);


router.post('/review-requests', reviewRequestController.createReviewRequest);


router.get('/review-requests', reviewRequestController.getClientReviewRequests);


router.post('/jobpost', upload.single('attachment'), jobPostController.createJobPost);


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

module.exports = router;
