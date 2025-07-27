const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'temp/' });
//  POST /api/upload/avatar
router.post('/avatar', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    //  Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars'
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

module.exports = router;
