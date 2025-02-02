const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jobPostController = require("../controllers/post_job.controller");
// Import controllers and middleware
const usercontroller = require("../controllers/user.controller");
const proposalController = require("../controllers/proposal.controller");
const authMiddleware = require("../middleware/auth.middleware");
const freelancerProfileController = require("../controllers/freelancer_profile.controller");
const { upload } = require("../config/cloudinary.config"); //import forgot and rest password
// const { forgotPassword, resetPassword } = require('../controllers/user.controller');
const Notification = require("../controllers/notifications.controller");
const queryController = require("../controllers/query.controller");
const manageProject = require("../controllers/Manageproj.controller");

const offerController = require("../controllers/offer_form.controller");
// Import Chat controller
const chatController = require("../controllers/chat.controller"); // Add this

const aiCoverLetter = require("../controllers/aiCoverLetter.controller");
const hireFreelancerController = require("../controllers/hire_freelancer.controller");
const ClientProfile = require("../controllers/client_profile.controller");
const paymentMethodController = require("../controllers/payment_method.controller");
// const offerController=require("../controllers/offer_form.controller");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Use an absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Images and PDFs Only!");
    }
  },
});
router.get("/profile/image/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist:", filePath);
      return res
        .status(404)
        .sendFile(path.join(__dirname, "..", "public", "default-profile.jpg"));
    }
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(err.status).end();
      }
    });
  });
});
router.get("/notifications", authMiddleware, Notification.getNotifications);
router.post("/notifications", authMiddleware, Notification.createNotification);
router.put(
  "/notifications/:notificationId/read",
  authMiddleware,
  Notification.updateNotification
);
router.get(
  "/notifications/unread-count",
  authMiddleware,
  Notification.getUnreadNotificationsCount
);
router.get("/jobs", authMiddleware, jobPostController.getAllJobPosts);
router.get("/profile/portfolios/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "..", "uploads", fileName);
  console.log("Attempting to serve portfolio file:", filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status).end();
    }
  });
});

// Routes
router.post("/signup", usercontroller.signup);
router.post("/login", usercontroller.login);
///sammar addedd///
// router.post('/ForgotPass', usercontroller.forgotPassword);

// // Reset password route (for resetting password with token)
// router.post('/ChangePassword', usercontroller.resetPassword);

router.use(authMiddleware);

router.post("/manageproj", authMiddleware, manageProject.createProject);
// Proposal routes

router.post(
  "/proposal/:jobPostId",
  upload.single("attachment"),
  proposalController.createProposal
);
router.get("/getproposals", proposalController.getFreelancerProposals);
router.get("/proposals/:proposalId", proposalController.getProposalById);
router.put("/proposals/:proposalId", proposalController.updateProposal);
router.delete("/proposals/:proposalId", proposalController.deleteProposal);

// In your routes file
router.post(
  "/profile",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "portfolio_attachments", maxCount: 10 }, // Changed from 'portfolios' to 'portfolio_attachments'
  ]),
  freelancerProfileController.createOrUpdateProfile
);
router.get(
  "/profile",
  authMiddleware,
  freelancerProfileController.getAuthenticatedProfile
);
// router.put('/profile/:freelancerId', freelancerProfileController.getProfileByUserId);
router.delete(
  "/profile/:freelancerId",
  freelancerProfileController.deleteProfile
);
// router.get('/profile', authMiddleware, freelancerProfileController.getProfileByUserId);
router.get(
  "/profile/:userId",
  authMiddleware,
  freelancerProfileController.getProfileByUserId
);
router.get(
  "/profilebyfreelancerid/:freelancer_id",
  authMiddleware,
  freelancerProfileController.getProfileByFreelancerId
);
router.get('/profile/:id', authMiddleware, freelancerProfileController.getFreelancerProfile);
router.get(
  "/freelancer-profile-exists/:id",
  freelancerProfileController.freelancerProfileExists
);
router.get("/offers/:offerId", offerController.getOfferById);
router.get("/offers/:notificationId", offerController.getOfferById);
router.get("/offers", offerController.getOffers);

router.post("/offers/:notificationId", offerController.getOfferById);
// Route to get all chats for a specific freelancer
// Chat-related routes
// In routes file (e.g., offerRoutes.js)
router.patch(
  "/offers/:notificationId",
  authMiddleware,
  offerController.updateOfferStatus
);

router.get("/searchClients", authMiddleware, usercontroller.searchClients);

// Route to check payment method
router.get(
  "/checkPaymentMethod",
  authMiddleware,
  paymentMethodController.checkPaymentMethod
);

router.post("/accesschats", authMiddleware, chatController.accessChat);
router.get("/fetchchats", authMiddleware, chatController.fetchChats);
router.delete("/deletechat/:chatId", authMiddleware, chatController.deleteChat);
router.delete("/Message/:id", authMiddleware, chatController.deleteMessage);

// message-related routes

router.get("/allMessages/:chatId", authMiddleware, chatController.allMessages);
// router.post("/sendMessage",
//   authMiddleware,
//   // upload.single('file'),
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "portfolio_attachments", maxCount: 10 }, // Changed from 'portfolios' to 'portfolio_attachments'
//   ]),
//   chatController.sendMessage
// );


router.post('/sendMessage', upload.single('attachment'), chatController.sendMessage);

router.post("/ForgotPass", usercontroller.forgotPassword);
router.get("/ChangePass/:id/:token", usercontroller.ChangePass);
router.post("/ChangePass/:id/:token", usercontroller.ChangePass);

router.post("/query", authMiddleware, queryController.createQuery);

// Route to get all queries (optional, for admin or dashboard)
router.get("/queries", queryController.getAllQueries);

router.get("/users", authMiddleware, queryController.getUser);

router.get("/count", usercontroller.getallfreelancer);
router.get("/freelancerslist", usercontroller.getallfreelancerlist);
router.get("/queries/:id", authMiddleware, queryController.getQueryById);

router.patch("/queries/:id", authMiddleware, queryController.updatequery);

router.post("/generate-cover-letter", aiCoverLetter.generateCoverLetter);
router.post("/save-cover-letter", aiCoverLetter.saveCoverLetter);
router.get(
  "/get-cover-letter/:freelancerId/:jobPostId",
  aiCoverLetter.getCoverLetter
);

// Separate route for searching users by name and email
// router.get('/api/users/search', async (req, res) => {
//   const { name, email } = req.query;

//   if (!name || !email) {
//     return res.status(400).json({ message: 'Name and email are required' });
//   }

//   const user = await User.findOne({ where: { name, email } });

//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   res.json(user);
// });

// Reset Password Route (handles when the user clicks the link from email)
// router.post('/ChangePass/:token', usercontroller.resetPassword);
router.patch("/softban/:id", authMiddleware, usercontroller.freelancersoftban);
router.delete("/ban/:id", authMiddleware, usercontroller.freelancerban);
router.patch("/unban/:id", authMiddleware, usercontroller.freelancerUnban);

router.get("/profile/:id", authMiddleware, usercontroller.fetchprofile);
router.get(
  "/proposals/count/:userId",
  authMiddleware,
  proposalController.getTotalProposalsByFreelancer
);

// route for getting jobs for specific freelancer
router.get(
  "/hired-jobs/:freelancerId",
  hireFreelancerController.getFreelancerHiredJobs
);

// Get specific job review
router.get(
  "/job-review/:jobId",
  authMiddleware,
  hireFreelancerController.getJobReview
);

// Get all reviews for a freelancer
router.get(
  "/freelancer-reviews/:freelancerId",
  authMiddleware,
  hireFreelancerController.getFreelancerReviews
);

router.get(
  "/:freelancerId/reviews",
  authMiddleware,
  hireFreelancerController.getFreelancerReviews
);

router.get(
  "/offer/:freelancerId",
  authMiddleware,
  offerController.getOffersByFreelancerId
);

//router.get('/hired-jobs-count/:freelancerId', authMiddleware,hireFreelancerController.getFreelancerHiredJobsCount);

router.put(
  "/hireProposal/:proposalId",
  authMiddleware,
  proposalController.hireProposal
);

router.get(
  "/completed-jobs/:freelancerId",
  authMiddleware,
  hireFreelancerController.getFreelancerCompletedJobs
);

// router.get('/users/:userId', usercontroller.getAllUsers);

router.get("/users/:userId", usercontroller.getUserById);

router.get(
  "/project-progress/:project_id",
  manageProject.getProjectProgressById
);

router.get(
  "/project-progress/:proposal_id",
  authMiddleware,
  manageProject.getProjectProgress
);

router.get("/profile", authMiddleware, ClientProfile.getProfile);

// router.get('/progress/:client_id/:proposal_id',authMiddleware, manageProject.getProgressByIds);

// router.put('/:project_id/progress',authMiddleware, manageProject.updateProjectProgress);

module.exports = router;
