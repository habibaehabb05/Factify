const express = require('express');
const router = express.Router();
const { analyzeContent, getHistory } = require('../controllers/analysisController');
const { protect, optionalProtect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Route for text/url analysis - Public access, optional auth for history
router.post('/', optionalProtect, upload.single('image'), analyzeContent);

// Route for history - Protected
router.get('/history', protect, getHistory);

module.exports = router;
