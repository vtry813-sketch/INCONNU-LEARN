const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.githubId; // Password not required for GitHub OAuth users
    }
  },
  githubId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String
  },
  coins: {
    type: Number,
    default: 25 // Starting coins for new users
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  unlockedLevels: [{
    type: Number,
    default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // First 10 levels free
  }],
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referrals: {
    type: Number,
    default: 0
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate referral code before saving
userSchema.pre('save', function(next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if level is unlocked
userSchema.methods.hasLevelUnlocked = function(levelNumber) {
  return this.unlockedLevels.includes(levelNumber);
};

// Add coins method
userSchema.methods.addCoins = function(amount) {
  this.coins += amount;
  return this.save();
};

// Deduct coins method
userSchema.methods.deductCoins = function(amount) {
  if (this.coins < amount) {
    throw new Error('Insufficient coins');
  }
  this.coins -= amount;
  return this.save();
};

// Unlock level method
userSchema.methods.unlockLevel = function(levelNumber) {
  if (!this.unlockedLevels.includes(levelNumber)) {
    this.unlockedLevels.push(levelNumber);
  }
  this.currentLevel = Math.max(this.currentLevel, levelNumber);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
