import React from 'react';

const BuyCoins = () => {
  const contactAdmin = () => {
    const message = "Hello! I'm interested in buying coins for INCONNU LEARN.";
    const whatsappUrl = `https://wa.me/17479445970?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const coinPackages = [
    { coins: 100, description: 'Perfect for unlocking a few levels' },
    { coins: 500, description: 'Great for serious learners' },
    { coins: 1000, description: 'Best value - unlock many levels' },
    { coins: 5000, description: 'Become a pro faster' }
  ];

  return (
    <div className="buy-coins">
      <h3>Buy Coins</h3>
      <p>Need coins to unlock levels faster? Contact the admin to purchase coins.</p>
      
      <div className="coin-packages">
        {coinPackages.map((pkg, index) => (
          <div key={index} className="coin-package">
            <div className="package-coins">{pkg.coins} coins</div>
            <p>{pkg.description}</p>
          </div>
        ))}
      </div>
      
      <div className="contact-options">
        <h4>Contact Admin to Purchase:</h4>
        
        <div className="contact-buttons">
          <button 
            onClick={contactAdmin}
            className="btn btn-success"
          >
            WhatsApp +17479445970
          </button>
          
          <a 
            href="mailto:inconnuboytech@gmail.com?subject=Buy Coins - INCONNU LEARN"
            className="btn btn-outline"
          >
            Email inconnuboytech@gmail.com
          </a>
          
          <a 
            href="https://t.me/just_me_inconnu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Telegram @just_me_inconnu
          </a>
        </div>
      </div>
      
      <div className="purchase-info">
        <h4>Why Buy Coins?</h4>
        <ul>
          <li>Skip the referral process</li>
          <li>Unlock advanced levels immediately</li>
          <li>Support the platform development</li>
          <li>Get personalized support from admin</li>
        </ul>
      </div>
    </div>
  );
};

export default BuyCoins;
