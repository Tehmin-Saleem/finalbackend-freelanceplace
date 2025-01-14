const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Ensure your Cloudinary credentials are set correctly
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    try {
      return {
        folder: 'uploads',  // Cloudinary folder where files are uploaded
        allowed_formats: ['jpg', 'png', 'pdf'],  // Supported file formats
        resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
        access_mode: 'public',
      };
    } catch (error) {
      console.error("Cloudinary storage error:", error);
      throw error;
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = { upload, cloudinary };
