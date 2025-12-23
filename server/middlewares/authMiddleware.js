const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Proxy Pattern: Intercepts requests to check validity before
 * allowing access to the real subject (protected routes).
 */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Middleware for optional authentication.
 * If token is present, verifies it and attaches user.
 * If not, continues without error (guest mode).
 */
const optionalProtect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Token failed, but we allow guest access, so just log debug info if needed
            // console.log('Guest access: Invalid or expired token');
        }
    }
    // Proceed regardless of token presence
    next();
};

module.exports = { protect, optionalProtect };
