const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getAllAnalyses, getStats } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Proxy Pattern + Middleware: Only Admin can access these
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/analyses', protect, authorize('admin'), getAllAnalyses);
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;
