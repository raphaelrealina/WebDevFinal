// server/server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middleware Setup ---
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const corsOptions = {
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Accept URL-encoded bodies when needed

// --- Database Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
    })
    .catch(err => {
        console.error('MongoDB connection error. Check MONGODB_URI in .env');
        console.error(err);
    });

// --- Test Route ---
// This route is used to verify the connection from the React frontend.
app.get('/api/status', (req, res) => {
    res.status(200).json({ 
        message: 'FitTrack Backend API is operational!',
        service: 'Express/Node.js'
    });
});

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
