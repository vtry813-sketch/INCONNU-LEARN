const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Referral = require('../models/Referral');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Process referral if provided
    if (referralCode) {
      try {
        const referrer = await User.findOne({ referralCode });
        if (referrer && referrer._id.toString() !== user._id.toString()) {
          await Referral.processReferral(referrer._id, user._id, referralCode);
        }
      } catch (referralError) {
        console.error('Referral processing error:', referralError);
        // Don't fail registration if referral fails
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins,
        currentLevel: user.currentLevel,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins,
        currentLevel: user.currentLevel,
        referralCode: user.referralCode,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// GitHub OAuth routes
router.get('/github', (req, res) => {
  const githubAuthUrl = `https://github.com/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const { access_token } = tokenResponse.data;

    // Get user data from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { login, id, avatar_url, name } = userResponse.data;

    // Get user email
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const primaryEmail = emailResponse.data.find(email => email.primary)?.email;

    // Find or create user
    let user = await User.findOne({ githubId: id });
    
    if (!user) {
      user = await User.findOne({ email: primaryEmail });
      
      if (user) {
        // Link GitHub account to existing user
        user.githubId = id;
        user.avatar = avatar_url;
        await user.save();
      } else {
        // Create new user
        user = new User({
          name: name || login,
          email: primaryEmail,
          githubId: id,
          avatar: avatar_url,
          coins: 25
        });
        await user.save();
      }
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth-success?token=${token}`);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth-error`);
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        coins: req.user.coins,
        currentLevel: req.user.currentLevel,
        referralCode: req.user.referralCode,
        isAdmin: req.user.isAdmin,
        unlockedLevels: req.user.unlockedLevels
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins,
        currentLevel: user.currentLevel,
        referralCode: user.referralCode,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
