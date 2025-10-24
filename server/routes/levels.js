const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');
const Level = require('../models/Level');
const Progress = require('../models/Progress');

const router = express.Router();

// Get all levels
router.get('/', optionalAuth, async (req, res) => {
  try {
    const levels = await Level.find({ isActive: true })
      .sort('levelNumber')
      .select('-lessons.exercises.solution -lessons.exercises.testCases.hidden');

    // Add progress information if user is authenticated
    let levelsWithProgress = levels;
    if (req.user) {
      const progress = await Progress.find({ userId: req.user._id });
      
      levelsWithProgress = levels.map(level => {
        const levelProgress = progress.find(p => p.levelId.toString() === level._id.toString());
        return {
          ...level.toObject(),
          progress: levelProgress || null,
          isUnlocked: req.user.hasLevelUnlocked(level.levelNumber)
        };
      });
    } else {
      // For non-authenticated users, show first 10 levels as unlocked
      levelsWithProgress = levels.map(level => ({
        ...level.toObject(),
        isUnlocked: level.levelNumber <= 10
      }));
    }

    res.json(levelsWithProgress);
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ message: 'Error fetching levels' });
  }
});

// Get single level
router.get('/:id', auth, async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Check if user has access to this level
    if (!req.user.hasLevelUnlocked(level.levelNumber)) {
      return res.status(403).json({ message: 'Level is locked. Unlock it to access.' });
    }

    const progress = await Progress.findOne({
      userId: req.user._id,
      levelId: level._id
    });

    res.json({
      level: level,
      progress: progress
    });
  } catch (error) {
    console.error('Get level error:', error);
    res.status(500).json({ message: 'Error fetching level' });
  }
});

// Get level by number
router.get('/number/:number', auth, async (req, res) => {
  try {
    const levelNumber = parseInt(req.params.number);
    
    const level = await Level.findOne({ 
      levelNumber: levelNumber,
      isActive: true 
    });
    
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Check if user has access to this level
    if (!req.user.hasLevelUnlocked(level.levelNumber)) {
      return res.status(403).json({ message: 'Level is locked. Unlock it to access.' });
    }

    const progress = await Progress.findOne({
      userId: req.user._id,
      levelId: level._id
    });

    res.json({
      level: level,
      progress: progress
    });
  } catch (error) {
    console.error('Get level by number error:', error);
    res.status(500).json({ message: 'Error fetching level' });
  }
});

// Complete level exercise
router.post('/:id/complete-exercise', auth, async (req, res) => {
  try {
    const { exerciseId, score, timeSpent } = req.body;
    
    const level = await Level.findById(req.params.id);
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    let progress = await Progress.findOne({
      userId: req.user._id,
      levelId: level._id
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        levelId: level._id,
        levelNumber: level.levelNumber
      });
    }

    // Update exercise progress
    await progress.updateExercise(exerciseId, score);
    progress.timeSpent += timeSpent || 0;
    progress.lastAccessed = new Date();

    await progress.save();

    res.json({
      message: 'Exercise completed successfully',
      progress: progress
    });
  } catch (error) {
    console.error('Complete exercise error:', error);
    res.status(500).json({ message: 'Error completing exercise' });
  }
});

// Get level progress
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user._id,
      levelId: req.params.id
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found for this level' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Get level progress error:', error);
    res.status(500).json({ message: 'Error fetching level progress' });
  }
});

module.exports = router;
