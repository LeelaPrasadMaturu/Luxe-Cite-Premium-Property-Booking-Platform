import express from 'express';
import { register, login, getCurrentUser, forgotPassword, resetPassword, updateUser } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Admin Registration
router.post('/admin/register', async (req, res) => {
  try {
    const { username, email, password, secretKey, name, phone } = req.body;

    // Validate admin secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin secret key'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new admin user
    const user = new User({
      username,
      email,
      password,
      name,
      phone,
      role: 'ADMIN'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering admin',
      error: error.message
    });
  }
});

// Protected routes
router.get('/me', auth, getCurrentUser);
router.put('/me', auth, updateUser);

export default router; 