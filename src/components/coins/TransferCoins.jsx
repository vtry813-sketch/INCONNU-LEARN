import React, { useState } from 'react';
import { useCoins } from '../../contexts/CoinContext';
import { useUser } from '../../contexts/UserContext';

const TransferCoins = () => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { transferCoins } = useCoins();
  const { userData, fetchUserData } = useUser();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await transferCoins(formData.recipientEmail, parseInt(formData.amount));
      await fetchUserData(); // Refresh user data to update coin balance
      
      setFormData({
        recipientEmail: '',
        amount: '',
        note: ''
      });
      
      alert('Coins transferred successfully!');
    } catch (error) {
      alert(error.message || 'Error transferring coins');
    } finally {
      setLoading(false);
    }
  };

  const canTransfer = formData.amount && 
                     parseInt(formData.amount) > 0 && 
                     userData?.coins >= parseInt(formData.amount);

  return (
    <div className="transfer-coins">
      <h3>Transfer Coins</h3>
      
      <div className="balance-info">
        <p>Your current balance: <strong>{userData?.coins || 0} coins</strong></p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipient Email</label>
          <input
            type="email"
            name="recipientEmail"
            value={formData.recipientEmail}
            onChange={handleChange}
            required
            placeholder="Enter recipient's email"
          />
        </div>
        
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            max={userData?.coins}
            placeholder="Enter amount to transfer"
          />
        </div>
        
        <div className="form-group">
          <label>Note (Optional)</label>
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Add a note for the recipient"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary full-width"
          disabled={!canTransfer || loading}
        >
          {loading ? 'Transferring...' : 'Transfer Coins'}
        </button>
      </form>
      
      <div className="transfer-info">
        <h4>Transfer Rules:</h4>
        <ul>
          <li>Minimum transfer: 1 coin</li>
          <li>Maximum transfer: Your current balance</li>
          <li>Transfers are instant and cannot be reversed</li>
          <li>Recipient must be a registered user</li>
        </ul>
      </div>
    </div>
  );
};

export default TransferCoins;
