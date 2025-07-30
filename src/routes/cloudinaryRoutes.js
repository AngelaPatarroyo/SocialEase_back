const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

router.get('/signature', (req, res) => {
  try {
    console.log('🎯 /api/cloudinary/signature hit');

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'avatars';

    const signature = cloudinary.utils.api_sign_request(
      { folder, timestamp }, 
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({ signature, timestamp, folder }); // Return only what was signed
  } catch (err) {
    console.error('❌ Error generating signature:', err);
    res.status(500).json({ message: 'Failed to generate Cloudinary signature' });
  }
});

module.exports = router;
