import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Named Export: Allows you to import { hashPassword }
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Named Export
export const comparePassword = async (enteredPassword, storedHash) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};

// Named Export
export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, 
  });
};