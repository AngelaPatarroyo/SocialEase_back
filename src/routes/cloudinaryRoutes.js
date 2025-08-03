const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.get('/signature', (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'avatars';
    const upload_preset = 'signed_avatars';
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    const paramsToSign = {
      folder,
      timestamp,
      upload_preset,
    };

    // Build the string to sign (sorted alphabetically by key)
    const signatureString = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&');

    // Cloudinary expects: SHA1(stringToSign + apiSecret)
    const signature = crypto
      .createHash('sha1')
      .update(signatureString + apiSecret)
      .digest('hex');

    // Return all params and the signature
    res.status(200).json({
      ...paramsToSign,
      signature,
      api_key: apiKey,
    });
  } catch (err) {
    console.error('❌ Signature generation failed:', err.message);
    res.status(500).json({ message: 'Signature generation failed' });
  }
});

module.exports = router;
