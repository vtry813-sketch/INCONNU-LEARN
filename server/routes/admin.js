const express = require('express');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Level = require('../models/Level');
const Transaction = require('../models/Transaction');

const router = express.Router();

// All routes require admin authentication
router.use(auth);
router.use(admin);

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalCoins = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$coins' } } }
    ]);
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email coins createdAt');

    const levelStats = await Level.aggregate([
      {
        $lookup: {
          from: 'progresses',
          localField: '_id',
          foreignField: 'levelId',
          as: 'progress'
        }
      },
      {
        $project: {
          levelNumber: 1,
          title: 1,
          completions: { $size: '$progress' },
          averageScore: { $avg: '$progress.score' }
        }
      }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalTransactions,
        totalCoins: totalCoins[0]?.total || 0
      },
      recentUsers,
      levelStats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Error fetching admin dashboard' });
  }
});

// Add coins to user
router.post('/add-coins', async (req, res) => {
  try {
    const { userId, amount, note } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: 'User ID and amount are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.addCoins(amount);

    // Create transaction record
    const transaction = new Transaction({
      toUser: user._id,
      amount: amount,
      type: 'purchase',
      note: note || 'Admin coin addition',
      status: 'completed'
    });
    await transaction.save();

    res.json({
      message: 'Coins added successfully',
      newBalance: user.coins,
      transaction: transaction
    });
  } catch (error) {
    console.error('Add coins error:', error);
    res.status(500).json({ message: 'Error adding coins' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('referredBy', 'name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await Transaction.find({
      $or: [{ fromUser: user._id }, { toUser: user._id }]
    })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({
      user,
      transactions
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Create or update level
router.post('/levels', async (req, res) => {
  try {
    const { levelNumber, title, description, difficulty, lessons } = req.body;

    let level = await Level.findOne({ levelNumber });

    if (level) {
      // Update existing level
      level.title = title;
      level.description = description;
      level.difficulty = difficulty;
      level.lessons = lessons;
    } else {
      // Create new level
      level = new Level({
        levelNumber,
        title,
        description,
        difficulty,
        lessons
      });
    }

    await level.save();

    res.json({
      message: level.isNew ? 'Level created successfully' : 'Level updated successfully',
      level
    });
  } catch (error) {
    console.error('Create/update level error:', error);
    res.status(500).json({ message: 'Error saving level', error: error.message });
  }
});

// Initialize admin user
router.post('/init-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'inconnuboytech@gmail.com' });
    
    if (existingAdmin) {
      return res.json({ message: 'Admin user already exists' });
    }

    // Create admin user
    const adminUser = new User({
      name: 'Inconnu Boy',
      email: 'inconnuboytech@gmail.com',
      password: 'inconnuboytech1234',
      coins: 9999999999,
      isAdmin: true,
      unlockedLevels: Array.from({ length: 50 }, (_, i) => i + 1) // Unlock all levels
    });

    await adminUser.save();

    res.json({
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        coins: adminUser.coins,
        isAdmin: adminUser.isAdmin
      }
    });
  } catch (error) {
    console.error('Init admin error:', error);
    res.status(500).json({ message: 'Error creating admin user', error: error.message });
  }
});

module.exports = router;
