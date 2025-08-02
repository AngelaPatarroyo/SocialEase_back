// src/routes/cloudinaryRoutes.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.get('/signature', (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'avatars';
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    const signatureString = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHmac('sha1', apiSecret) // ✅ HMAC instead of append + hash
      .update(signatureString)
      .digest('hex');

    return res.status(200).json({
      timestamp,
      folder,
      signature,
      api_key: apiKey
    });
  } catch (error) {
    console.error('❌ Error generating signature:', error);
    res.status(500).json({ message: 'Signature generation failed' });
  }
});

module.exports = router;
