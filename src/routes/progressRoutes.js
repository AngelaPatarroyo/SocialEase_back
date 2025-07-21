const express = require('express');
const router = express.Router();
const { getProgress, updateProgress } = require('../controllers/progressController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, getProgress);
router.post('/update', verifyToken, updateProgress);

module.exports = router;
