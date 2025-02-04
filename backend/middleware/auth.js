const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token); //debug log
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified:', verified); //debug log
        req.admin = verified;
        next();
    } catch (err) {
        console.error('Token verification failed:', err); //debug log
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = { verifyAdmin }; 