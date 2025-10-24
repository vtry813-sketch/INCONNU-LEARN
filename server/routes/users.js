const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Level = require('../models/Level');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .populate('levelId', 'levelNumber title')
      .sort('levelNumber');

    res.json({
      user: req.user,
      progress: progress
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user progress
router.post('/progress/:levelId', auth, async (req, res) => {
  try {
    const { levelId } = req.params;
    const { score, timeSpent, exercises } = req.body;

    const level = await Level.findById(levelId);
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    let progress = await Progress.findOne({
      userId: req.user._id,
      levelId: levelId
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        levelId: levelId,
        levelNumber: level.levelNumber
      });
    }

    // Update progress
    progress.score = Math.max(progress.score, score || 0);
    progress.timeSpent += timeSpent || 0;
    progress.lastAccessed = new Date();

    // Update exercises if provided
    if (exercises) {
      for (const exercise of exercises) {
        await progress.updateExercise(exercise.exerciseId, exercise.score);
      }
    }

    // Mark as completed if score is high enough
    if (score >= 80 && !progress.completed) {
      await progress.markCompleted(score);
      
      // Add coins reward
      await req.user.addCoins(level.coinsReward);
      
      // Unlock next level if exists
      const nextLevelNumber = level.levelNumber + 1;
      if (nextLevelNumber <= 50) {
        await req.user.unlockLevel(nextLevelNumber);
      }
    }

    await progress.save();

    res.json({
      message: 'Progress updated successfully',
      progress: progress,
      coinsAdded: score >= 80 ? level.coinsReward : 0
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Error updating progress' });
  }
});

// Unlock level
router.post('/unlock-level/:levelId', auth, async (req, res) => {
  try {
    const { levelId } = req.params;
    
    const level = await Level.findById(levelId);
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Check if level is already unlocked
    if (req.user.hasLevelUnlocked(level.levelNumber)) {
      return res.status(400).json({ message: 'Level already unlocked' });
    }

    // Check if level is free
    if (level.levelNumber <= 10) {
      await req.user.unlockLevel(level.levelNumber);
      return res.json({
        message: 'Level unlocked successfully',
        coins: req.user.coins,
        unlockedLevels: req.user.unlockedLevels
      });
    }

    // Check if user has enough coins
    if (req.user.coins < level.coinsRequired) {
      return res.status(400).json({ 
        message: `Insufficient coins. Need ${level.coinsRequired} but have ${req.user.coins}` 
      });
    }

    // Deduct coins and unlock level
    await req.user.deductCoins(level.coinsRequired);
    await req.user.unlockLevel(level.levelNumber);

    res.json({
      message: 'Level unlocked successfully',
      coins: req.user.coins,
      unlockedLevels: req.user.unlockedLevels
    });
  } catch (error) {
    console.error('Unlock level error:', error);
    res.status(500).json({ message: 'Error unlocking level', error: error.message });
  }
});

// Get user's unlocked levels
router.get('/unlocked-levels', auth, async (req, res) => {
  try {
    const levels = await Level.find({
      levelNumber: { $in: req.user.unlockedLevels }
    }).sort('levelNumber');

    res.json({
      unlockedLevels: levels
    });
  } catch (error) {
    console.error('Get unlocked levels error:', error);
    res.status(500).json({ message: 'Error fetching unlocked levels' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;

    const updates = {};
    if (name) updates.name = name;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
