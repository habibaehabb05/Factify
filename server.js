import express from 'express';
import 'dotenv/config';

import connectDB from './config/db.js';
import usersRouter from './routes/users.js';
import submissionsRouter from './routes/submissions.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/submissions', submissionsRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Fake News Checker API' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Error: Route not found' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
  });
}).catch(error => {
    console.error("Failed to connect to the database. Server did not start.", error);
});