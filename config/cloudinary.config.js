const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    try {
      console.log("Processing file in Cloudinary storage:", file);
      return {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'pdf'], // Corrected typo: 'allowed_formats'
        resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
        access_mode: 'public'
      };
    } catch (error) {
      console.error("Cloudinary storage error:", error);
      throw error;
    }
  }
});

// Add error handling to multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = { upload, cloudinary };
