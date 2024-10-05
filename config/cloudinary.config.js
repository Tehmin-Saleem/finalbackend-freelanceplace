const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Updated CloudinaryStorage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads',  // The folder where files will be uploaded
      allowed_formats: ['jpg', 'png', 'pdf'],  // Allowed file formats
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',  // 'raw' for non-image files (like PDF)
      access_mode: 'public'  // Explicitly make the file public
    };
  }
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
