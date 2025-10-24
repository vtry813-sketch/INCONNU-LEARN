const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  levelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  levelNumber: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  exercisesCompleted: [{
    exerciseId: String,
    completed: Boolean,
    score: Number,
    attempts: Number,
    bestScore: Number
  }],
  completedAt: {
    type: Date
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique progress per user and level
progressSchema.index({ userId: 1, levelId: 1 }, { unique: true });

// Method to mark as completed
progressSchema.methods.markCompleted = function(score) {
  this.completed = true;
  this.score = score;
  this.completedAt = new Date();
  return this.save();
};

// Method to update exercise progress
progressSchema.methods.updateExercise = function(exerciseId, score) {
  const exercise = this.exercisesCompleted.find(ex => ex.exerciseId === exerciseId);
  
  if (exercise) {
    exercise.attempts += 1;
    exercise.bestScore = Math.max(exercise.bestScore, score);
    if (score >= 80) {
      exercise.completed = true;
    }
  } else {
    this.exercisesCompleted.push({
      exerciseId,
      completed: score >= 80,
      score,
      attempts: 1,
      bestScore: score
    });
  }
  
  return this.save();
};

module.exports = mongoose.model('Progress', progressSchema);
