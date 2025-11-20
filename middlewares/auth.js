import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/**
 * Auth Middleware
 * @param {string[]} allowedRoles - Array of roles allowed to access (e.g. ['admin'])
 * If empty, any logged-in user can access.
 */
export const protect = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      let token;

      // 1. Check for token in Headers (Standard for APIs)
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      // Log for debugging (Idea taken from your snippet)
      // console.log(`Checking Auth. Path: ${req.path}, Role required: ${allowedRoles}`);

      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
      }

      // 2. Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get User from DB
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      // 4. Check Roles (The smart part from your snippet!)
      // If we passed roles (like ['admin']) and the user doesn't have it...
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: `Access denied. Requires ${allowedRoles.join(' or ')} role.` });
      }

      // Attach user to request
      req.user = user;
      next();

    } catch (error) {
      console.error('Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  };
};