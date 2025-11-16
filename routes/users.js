// routes/users.js
import express from 'express';

const router = express.Router();

// A test route to make sure the file is working
router.get('/test', (req, res) => {
    res.send('Users route is working!');
});

// Add your other routes for register, login, etc. here

// This is the most important line! It makes the router available for import.
export default router;