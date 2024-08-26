const multer = require('multer');
const path = require('path');

// Configure Multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

// Initialize Multer with storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
