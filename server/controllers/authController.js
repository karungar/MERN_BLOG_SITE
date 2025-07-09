import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userObj,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userObj,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    // Return user without password
    const userObj = req.user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      data: userObj
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;
    
    // Check if username is taken by another user
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    // Update user
    const user = req.user;
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    
    await user.save();

    // Return updated user without password
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userObj
    });
  } catch (error) {
    next(error);
  }
};