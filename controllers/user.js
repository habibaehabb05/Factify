import User from '../models/user.js';
import { hashPassword, comparePassword, generateToken } from '../services/securityService.js';

export const signup = async (req, res) => {
  try {
    const { username, email, password, adminKey } = req.body;

    // --- 1. NEW VALIDATION LOGIC ---
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    // -------------------------------

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or username already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Determine role (Safer check)
    let role = 'user';
    // We check if adminKey exists AND if it matches the secret
    if (adminKey && adminKey === process.env.ADMIN_SECRET_KEY) {
      role = 'admin';
    }

    // Create User
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Generate Token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User created successfully!',
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // --- 2. NEW VALIDATION LOGIC ---
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    // -------------------------------

    // Check for user email
    const user = await User.findOne({ email });

    // Check password
    if (user && (await comparePassword(password, user.password))) {
      const token = generateToken(user._id, user.role);
      
      res.status(200).json({
        message: 'Login successful!',
        token,
        user: { 
          id: user._id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  res.status(200).json(req.user);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
};