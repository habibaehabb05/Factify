import express from 'express';
import { 
  signup, 
  login, 
  getMyProfile, 
  getAllUsers 
} from '../controllers/user.js';

// Import the new unified middleware
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Route (Any logged-in user)
// We pass an empty array (or nothing) to mean "Any User"
router.get('/me', protect(), getMyProfile);

// Admin Route
// We specifically say only 'admin' is allowed
router.get('/', protect(['admin']), getAllUsers);

export default router;