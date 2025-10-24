const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Transfer coins to another user
router.post('/transfer', auth, async (req, res) => {
  try {
    const { recipientEmail, amount, note } = req.body;

    if (!recipientEmail || !amount) {
      return res.status(400).json({ message: 'Recipient email and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }

    if (req.user.coins < amount) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    // Find recipient
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (recipient._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot transfer coins to yourself' });
    }

    // Perform transfer
    await req.user.deductCoins(amount);
    await recipient.addCoins(amount);

    // Create transaction record
    const transaction = await Transaction.createTransfer(
      req.user._id,
      recipient._id,
      amount,
      note
    );

    res.json({
      message: 'Coins transferred successfully',
      transaction: {
        id: transaction._id,
        amount: -amount,
        type: 'transfer',
        note: note,
        createdAt: transaction.createdAt,
        counterparty: recipient.email
      },
      newBalance: req.user.coins
    });
  } catch (error) {
    console.error('Transfer coins error:', error);
    res.status(500).json({ message: 'Error transferring coins', error: error.message });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ]
    })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .sort({ createdAt: -1 })
    .limit(50);

    const formattedTransactions = transactions.map(transaction => {
      const isOutgoing = transaction.fromUser?._id.toString() === req.user._id.toString();
      
      return {
        _id: transaction._id,
        type: transaction.type,
        amount: isOutgoing ? -transaction.amount : transaction.amount,
        note: transaction.note,
        createdAt: transaction.createdAt,
        counterparty: isOutgoing 
          ? transaction.toUser?.email 
          : transaction.fromUser?.email,
        status: transaction.status
      };
    });

    res.json(formattedTransactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Get coin balance
router.get('/balance', auth, async (req, res) => {
  try {
    res.json({
      coins: req.user.coins
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Error fetching balance' });
  }
});

// Add coins via referral (internal use)
router.post('/add-referral', auth, async (req, res) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({ message: 'Referral code is required' });
    }

    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    if (referrer._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot use your own referral code' });
    }

    // This would typically be handled in the auth route during registration
    // This endpoint is for adding referral after registration if needed
    res.status(400).json({ 
      message: 'Referral must be used during registration. Please contact support.' 
    });
  } catch (error) {
    console.error('Add referral error:', error);
    res.status(500).json({ message: 'Error processing referral' });
  }
});

module.exports = router;
