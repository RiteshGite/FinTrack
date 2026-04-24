const express = require('express');
const router = express.Router();
const { signup, login, googleAuth, getMe, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../utils/validation');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post('/signup', validateSignup, signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post('/login', validateLogin, login);

/**
 * @route   POST /api/auth/google
 * @desc    Google OAuth login/signup
 */
router.post('/google', googleAuth);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
router.get('/me', auth, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 */
router.post('/logout', auth, logout);

module.exports = router;
