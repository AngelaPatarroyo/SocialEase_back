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
      .createHmac('sha1', apiSecret)
      .update(signatureString)
      .digest('hex');

    console.log('✅ Signature generated:', signature);

    res.status(200).json({
      timestamp,
      folder,
      signature,
      api_key: apiKey
    });
  } catch (err) {
    console.error('❌ Error generating signature:', err.message);
    res.status(500).json({ message: 'Signature generation failed' });
  }
});

module.exports = router;
