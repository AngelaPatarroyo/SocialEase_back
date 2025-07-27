const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPG, PNG, WEBP allowed.'));
  }
});

router.post('/avatar', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face'
    });

    // Delete local temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

module.exports = router;
