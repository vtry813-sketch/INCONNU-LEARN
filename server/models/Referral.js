const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    required: true
  },
  coinsEarned: {
    type: Number,
    default: 50
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'completed'
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique referrals
referralSchema.index({ referrer: 1, referredUser: 1 }, { unique: true });

// Static method to handle new referral
referralSchema.statics.processReferral = async function(referrerId, referredUserId, referralCode) {
  const Referral = this;
  const User = mongoose.model('User');
  
  // Check if referral already exists
  const existingReferral = await Referral.findOne({
    referrer: referrerId,
    referredUser: referredUserId
  });
  
  if (existingReferral) {
    throw new Error('Referral already processed');
  }
  
  // Create referral record
  const referral = new Referral({
    referrer: referrerId,
    referredUser: referredUserId,
    referralCode: referralCode,
    status: 'completed'
  });
  
  await referral.save();
  
  // Update referrer's stats and add coins
  await User.findByIdAndUpdate(referrerId, {
    $inc: { 
      coins: 50,
      referrals: 1
    }
  });
  
  // Add bonus coins to referred user
  await User.findByIdAndUpdate(referredUserId, {
    $inc: { coins: 25 }
  });
  
  return referral;
};

module.exports = mongoose.model('Referral', referralSchema);
