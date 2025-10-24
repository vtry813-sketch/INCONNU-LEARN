const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 50
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  coinsRequired: {
    type: Number,
    required: true,
    default: 0
  },
  coinsReward: {
    type: Number,
    required: true,
    default: 10
  },
  lessons: [{
    title: String,
    description: String,
    theory: String, // HTML content
    exercises: [{
      type: {
        type: String,
        enum: ['coding', 'quiz'],
        required: true
      },
      title: String,
      description: String,
      initialCode: String,
      testCases: [{
        code: String,
        expected: mongoose.Schema.Types.Mixed
      }],
      questions: [{
        question: String,
        options: [String],
        correctAnswer: Number
      }],
      hint: String
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for checking if level is free
levelSchema.virtual('isFree').get(function() {
  return this.levelNumber <= 10;
});

// Pre-save middleware to set coinsRequired
levelSchema.pre('save', function(next) {
  if (this.levelNumber <= 10) {
    this.coinsRequired = 0;
  } else {
    this.coinsRequired = (this.levelNumber - 10) * 10;
  }
  this.order = this.levelNumber;
  next();
});

module.exports = mongoose.model('Level', levelSchema);
