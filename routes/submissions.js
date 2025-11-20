import express from 'express';
import { createSubmission, getMySubmissions } from '../controllers/submissions.js';
import { protect } from '../middlewares/auth.js';

// ▼▼▼ UPDATE THIS LINE ▼▼▼
import upload from '../config/multer.js'; 

const router = express.Router();

router.post('/', protect(), upload.single('file'), createSubmission);
router.get('/', protect(), getMySubmissions);

export default router;