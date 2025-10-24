import React, { useState } from 'react';
import { CONTACT_INFO } from '../utils/constants';
import '../styles/pages/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: CONTACT_INFO.adminEmail,
      link: `mailto:${CONTACT_INFO.adminEmail}`,
      description: 'Send us an email for any inquiries'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      value: CONTACT_INFO.whatsapp,
      link: `https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`,
      description: 'Chat with us on WhatsApp'
    },
    {
      icon: '✈️',
      title: 'Telegram',
      value: CONTACT_INFO.telegram,
      link: `https://t.me/${CONTACT_INFO.telegram.replace('@', '')}`,
      description: 'Message us on Telegram'
    },
    {
      icon: '🎥',
      title: 'YouTube',
      value: '@inconnuboy-b5h',
      link: CONTACT_INFO.youtube,
      description: 'Check out our tutorials and updates'
    }
  ];

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Get in touch with the INCONNU LEARN team for support, questions, or feedback</p>
        </div>

        <div className="contact-content">
          {/* Contact Methods */}
          <div className="contact-methods">
            <h2>Quick Contact</h2>
            <div className="methods-grid">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="method-card"
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <h3>{method.title}</h3>
                    <p className="method-value">{method.value}</p>
                    <p className="method-description">{method.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            {submitted ? (
              <div className="success-message">
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Additional Information */}
          <div className="additional-info">
            <div className="info-card">
              <h3>Common Questions</h3>
              <div className="faq-list">
                <div className="faq-item">
                  <h4>How do I unlock more levels?</h4>
                  <p>Use coins to unlock levels beyond the first 10 free ones. Earn coins through referrals or contact us to purchase coins.</p>
                </div>
                <div className="faq-item">
                  <h4>Can I transfer coins to friends?</h4>
                  <p>Yes! You can transfer coins to other users from your wallet page.</p>
                </div>
                <div className="faq-item">
                  <h4>Is there a mobile app?</h4>
                  <p>Currently, we're web-only, but our site is fully responsive and works great on mobile devices.</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Stay Updated</h3>
              <p>Follow our channels for the latest updates and new features:</p>
              <div className="update-channels">
                <a 
                  href={CONTACT_INFO.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-link"
                >
                  📢 WhatsApp Channel
                </a>
                <a 
                  href={CONTACT_INFO.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-link"
                >
                  ▶️ YouTube Channel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
