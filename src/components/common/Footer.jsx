import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>INCONNU LEARN</h3>
            <p>Master JavaScript from beginner to pro level. Learn, practice, and become a JavaScript expert.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/learning-path">Learning Path</Link>
            <Link to="/referral">Referral Program</Link>
            <Link to="/contact">Contact</Link>
          </div>
          
          <div className="footer-section">
            <h4>Connect</h4>
            <a href="https://whatsapp.com/channel/0029VbBlpT396H4JPxNF7707" target="_blank" rel="noopener noreferrer">
              WhatsApp Channel
            </a>
            <a href="https://www.youtube.com/@inconnuboy-b5h" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </div>
          
          <div className="footer-section">
            <h4>Contact Admin</h4>
            <p>Email: inconnuboytech@gmail.com</p>
            <p>WhatsApp: +17479445970</p>
            <p>Telegram: @just_me_inconnu</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 INCONNU LEARN. Created by Inconnu Boy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
