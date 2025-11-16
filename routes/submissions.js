// routes/submissions.js
import express from 'express';

const router = express.Router();

// A test route
router.get('/test', (req, res) => {
    res.send('Submissions route is working!');
});

// Add your other routes for creating/getting submissions here

// Make sure this line exists!
export default router;