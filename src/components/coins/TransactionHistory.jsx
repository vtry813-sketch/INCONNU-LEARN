import React, { useEffect, useState } from 'react';
import { useCoins } from '../../contexts/CoinContext';

const TransactionHistory = () => {
  const { transactions, getTransactionHistory } = useCoins();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        await getTransactionHistory();
      } catch (error) {
        console.error('Error loading transaction history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [getTransactionHistory]);

  if (loading) {
    return <div className="loading">Loading transaction history...</div>;
  }

  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      
      {transactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions yet.</p>
          <p>Your coin transfers and purchases will appear here.</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-type">
                  {transaction.type === 'transfer' ? '🔄' : '🎁'}
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </div>
                <div className="transaction-details">
                  <span className="amount {transaction.amount < 0 ? 'negative' : 'positive'}">
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} coins
                  </span>
                  <span className="date">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="transaction-meta">
                {transaction.type === 'transfer' && (
                  <p>
                    {transaction.amount < 0 ? 'To: ' : 'From: '}
                    {transaction.counterparty}
                  </p>
                )}
                {transaction.note && (
                  <p className="note">Note: {transaction.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
