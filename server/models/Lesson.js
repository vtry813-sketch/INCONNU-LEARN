const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  levelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  lessonNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String, // HTML content
    required: true
  },
  keyPoints: [String],
  exercises: [{
    type: {
      type: String,
      enum: ['coding', 'quiz', 'project'],
      required: true
    },
    title: String,
    description: String,
    instructions: String,
    starterCode: String,
    solution: String,
    testCases: [{
      input: String,
      expectedOutput: String,
      hidden: Boolean
    }],
    quizQuestions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }]
  }],
  duration: {
    type: Number, // in minutes
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for unique lesson per level
lessonSchema.index({ levelId: 1, lessonNumber: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', lessonSchema);
