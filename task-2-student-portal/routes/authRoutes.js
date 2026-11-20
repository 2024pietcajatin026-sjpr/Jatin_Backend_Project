const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'admin').required()
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required()
});

// POST /register
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const email = value.email.toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    const user = await User.create({
      name: value.name,
      email,
      password: hashedPassword,
      role: value.role
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Handles a duplicate-email race condition from MongoDB's unique index.
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }
    if (error.isJoi) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// POST /login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email.toLowerCase() })
      .select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(value.password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      expiresIn: '1h'
    });
  } catch (error) {
    next(error);
  }
});

// GET /profile — any authenticated user
router.get('/profile', authMiddleware, (req, res) => {
  return res.status(200).json({ user: req.user });
});

// GET /students — admin only
router.get('/students', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({ count: students.length, students });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
