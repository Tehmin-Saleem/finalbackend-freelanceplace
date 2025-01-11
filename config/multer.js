// const multer = require('multer');
// const path = require('path');

// // Configure Multer storage options
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Destination folder for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Unique file name
//   }
// });

// // Initialize Multer with storage configuration
// const upload = multer({ storage: storage });

// module.exports = upload;




const multer = require('multer');
const path = require('path');

// Define allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_PORTFOLIO_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

// Configure Multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choose destination based on field name
    const dest = file.fieldname === 'image' ? 'uploads/profiles' : 'uploads/portfolios';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Check if profile image is of allowed type
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG and GIF files are allowed for profile images.'), false);
    }
  } else if (file.fieldname === 'portfolio_attachments') {
    // Check if portfolio attachment is of allowed type
    if (ALLOWED_PORTFOLIO_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, GIF and PDF files are allowed for portfolio.'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Initialize Multer with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 11 // Maximum 11 files (1 profile image + 10 portfolio items)
  }
});

// Create middleware for specific upload scenarios
const uploadMiddleware = {
  // For single profile image
  profileImage: upload.single('image'),
  
  // For multiple files (profile image and portfolio attachments)
  profileWithPortfolio: upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'portfolio_attachments', maxCount: 10 }
  ])
};

module.exports = uploadMiddleware;
