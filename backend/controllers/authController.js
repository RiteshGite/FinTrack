const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Generate JWT token
 */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      authMethod: 'email'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error(`Signup Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if auth method matches
    if (user.authMethod !== 'email') {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.authMethod} authentication. Please log in using that method.`
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error(`Login Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Google OAuth login/signup
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Update existing user with google info if not already present
      if (!user.googleId) {
        user.googleId = googleId;
        user.googleProfilePicture = picture;
        // Don't change authMethod if they previously signed up with email
        // but we'll allow google login now
      }
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        googleProfilePicture: picture,
        authMethod: 'google'
      });
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user
    });
  } catch (error) {
    console.error(`Google Auth Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(`Get Me Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
};

/**
 * @desc    Logout user (client side mostly)
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
  // Since we use JWT, we just return success
  // The client should delete the token
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
