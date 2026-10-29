/**
 * SUMMARY:
 * This file handles all user account operations:
 * 1. POST /api/auth/register : Creates a new account, hashes password with bcrypt, and returns a JWT token.
 * 2. POST /api/auth/login    : Validates email and password, then returns a JWT token if credentials match.
 * 3. GET /api/auth/me        : Protected route that returns the currently logged-in user's profile information.
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * Helper function: Creates a signed JSON Web Token (JWT) containing the user's ID.
 * The token is valid for 7 days.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ==========================================
// 1. REGISTER NEW USER
// POST /api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that both fields exist
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Check minimum password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if an account already exists with this email address
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Encrypt the plain text password using bcrypt with 10 salt rounds
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user record in MongoDB
    const newUser = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Create a new login token so user is automatically logged in upon registering
    const token = generateToken(savedUser._id);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// ==========================================
// 2. USER LOGIN
// POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that both fields are supplied
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Find the user by email in the database
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the encrypted password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Password is correct! Generate a new JWT session token
    const token = generateToken(user._id);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// ==========================================
// 3. GET CURRENT LOGGED IN USER
// GET /api/auth/me (Protected with auth middleware)
// ==========================================
router.get('/me', auth, async (req, res) => {
  try {
    // Look up user by the ID extracted from the verified JWT token (exclude password)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

export default router;
