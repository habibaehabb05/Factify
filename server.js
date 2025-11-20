import express from 'express';
import 'dotenv/config';

import connectDB from './config/db.js';
import usersRouter from './routes/user.js';
import submissionsRouter from './routes/submissions.js';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 5000;

// 1. Allow JSON and Form Data
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. [NEW] Serve Uploaded Images Publicly
// Now you can visit: http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static('uploads'));

// --- ROUTES ---
app.use('/api/user', usersRouter);
app.use('/api/submissions', submissionsRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Fake News Checker API' });
});

// 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
  });
}).catch(error => {
    console.error("Failed to connect to the database.", error);
});