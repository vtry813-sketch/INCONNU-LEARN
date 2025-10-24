const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'transfer';
    }
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'transfer' || this.type === 'referral';
    }
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ['transfer', 'referral', 'purchase', 'reward'],
    required: true
  },
  note: {
    type: String,
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  reference: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
transactionSchema.index({ fromUser: 1, createdAt: -1 });
transactionSchema.index({ toUser: 1, createdAt: -1 });

// Static method to create transfer transaction
transactionSchema.statics.createTransfer = async function(fromUserId, toUserId, amount, note = '') {
  const Transaction = this;
  
  const transaction = new Transaction({
    fromUser: fromUserId,
    toUser: toUserId,
    amount: amount,
    type: 'transfer',
    note: note,
    status: 'completed'
  });
  
  return await transaction.save();
};

// Static method to create referral transaction
transactionSchema.statics.createReferral = async function(toUserId, amount) {
  const Transaction = this;
  
  const transaction = new Transaction({
    toUser: toUserId,
    amount: amount,
    type: 'referral',
    note: 'Referral bonus',
    status: 'completed'
  });
  
  return await transaction.save();
};

module.exports = mongoose.model('Transaction', transactionSchema);
