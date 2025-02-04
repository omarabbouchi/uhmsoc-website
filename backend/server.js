require('dotenv').config();
const express = require('express');
const playersRoutes = require('./routes/players');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const adminRoutes = require('./routes/admin');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();

//middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//make sure this comes before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this after your middleware setup
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//API routes
app.use('/api/players', playersRoutes);
app.use('/api/auth', authRoutes);

//root route
app.get('/', (req, res) => {
    res.send('API is running');
});

//error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
