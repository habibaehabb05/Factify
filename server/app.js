const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Singleton Database Connection
const Database = require('./config/db');
const db = Database.getInstance();
db.connect(process.env.MONGO_URI);

const seedAdmin = require('./utils/seeder');
seedAdmin();

// Initialize Express
const app = express();

// Middleware - Manual CORS with debug logging
app.use((req, res, next) => {
    console.log(`[CORS] ${req.method} ${req.path} from ${req.headers.origin || 'unknown'}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        console.log('[CORS] Responding to OPTIONS preflight');
        return res.status(200).end();
    }
    next();
});
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Factify API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
