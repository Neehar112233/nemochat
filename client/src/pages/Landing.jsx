import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Shield, Zap, Users, Lock, Send, X, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';

const Landing = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [helpName, setHelpName] = useState('');
  const [helpEmail, setHelpEmail] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [helpSent, setHelpSent] = useState(false);
  const [helpLoading, setHelpLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    setHelpLoading(true);
    try {
      await axios.post('http://localhost:5000/api/contact/send', {
        name: helpName,
        email: helpEmail,
        message: helpMessage,
      });
      setHelpSent(true);
      setTimeout(() => {
        setShowHelp(false);
        setHelpSent(false);
        setHelpName('');
        setHelpEmail('');
        setHelpMessage('');
      }, 3000);
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setHelpLoading(false);
    }
  };

  const features = [
    { icon: <Zap size={28} />, title: 'Instant Messaging', desc: 'Real-time communication powered by WebSockets. Zero latency.' },
    { icon: <Lock size={28} />, title: 'Private Rooms', desc: 'Create invite-only rooms with unique codes. Your conversations, your rules.' },
    { icon: <Users size={28} />, title: 'Join by Link', desc: 'Share a simple link or code and anyone can join instantly.' },
    { icon: <Shield size={28} />, title: 'Auto-Destruct', desc: 'Rooms self-delete when everyone leaves. No trace, no history.' },
  ];

  const stats = [
    { value: '0ms', label: 'Latency' },
    { value: '256-bit', label: 'Encryption' },
    { value: '∞', label: 'Rooms' },
    { value: '0', label: 'Data Stored' },
  ];

  return (
    <div className="landing-page">
      {/* Cursor glow effect */}
      <div
        className="cursor-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Floating particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Top Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <img src="/logo.png" alt="NemoChat" className="landing-logo-img" />
          <span className="landing-brand-text"><span className="accent">Nemo</span>Chat</span>
        </div>
        <div className="landing-nav-links">
          <Link to="/login" className="landing-nav-link">Log In</Link>
          <Link to="/register" className="landing-nav-btn">
            <Sparkles size={16} />
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <motion.div
            className="hero-logo-container"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <img src="/logo.png" alt="NemoChat Logo" className="hero-logo" />
            <div className="hero-logo-glow" />
          </motion.div>

          <div className="hero-badge">
            <Sparkles size={14} />
            Transient • Private • Ephemeral
          </div>

          <h1 className="hero-title">
            Chat that <span className="hero-gradient-text">Disappears</span>
          </h1>
          <p className="hero-subtitle">
            Create rooms. Invite friends. Chat in real-time.
            <br />
            When you leave, everything vanishes — forever.
          </p>

          <div className="hero-cta-group">
            <Link to="/register" className="hero-cta-primary">
              <span>Start Chatting</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="hero-cta-secondary">
              I have an account
            </Link>
          </div>
        </motion.div>

        {/* Animated chat preview */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-preview"
        >
          <div className="glass preview-card">
            <div className="preview-header">
              <div className="preview-dot green" />
              <span>General Chat</span>
              <span className="preview-code">A7F2B1</span>
            </div>
            <div className="preview-messages">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="preview-msg received"
              >
                <span className="preview-sender">Alex</span>
                <p>Hey! Welcome to NemoChat 🐠</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
                className="preview-msg sent"
              >
                <span className="preview-sender">You</span>
                <p>This is so cool! Loving the vibes ✨</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6 }}
                className="preview-system"
              >
                Sam has joined the chat
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.2 }}
                className="preview-msg received"
              >
                <span className="preview-sender">Sam</span>
                <p>Wait, everything disappears when we leave? 🤯</p>
              </motion.div>
            </div>
            <div className="preview-input">
              <span>Type your message...</span>
              <div className="preview-send-btn"><Send size={14} /></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="landing-stats">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="stat-item"
          >
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="features-header"
        >
          <h2>Why <span className="accent">Nemo</span>Chat?</h2>
          <p>Built for privacy-first conversations that leave no digital footprint</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, borderColor: 'var(--accent-color)' }}
              className="glass feature-card"
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="landing-how">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="how-header"
        >
          <h2>Get Started in <span className="accent">3 Steps</span></h2>
        </motion.div>
        <div className="how-steps">
          {[
            { step: '01', title: 'Create an Account', desc: 'Sign up in seconds — just a username and password.' },
            { step: '02', title: 'Start or Join a Room', desc: 'Create your own room or enter a code to join someone else\'s.' },
            { step: '03', title: 'Chat & Go', desc: 'Talk freely. When everyone leaves, the room self-destructs.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="glass how-step"
            >
              <span className="how-step-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="cta-card glass"
        >
          <h2>Ready to chat without <span className="hero-gradient-text">boundaries</span>?</h2>
          <p>Join NemoChat today. No data stored. No tracking. Just pure conversation.</p>
          <Link to="/register" className="hero-cta-primary" style={{ display: 'inline-flex' }}>
            <span>Create Free Account</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <img src="/logo.png" alt="NemoChat" className="footer-logo" />
          <span><span className="accent">Nemo</span>Chat</span>
        </div>
        <p>© 2026 NemoChat. Built with ❤️ for privacy.</p>
      </footer>

      {/* Help the Owner Button */}
      <motion.button
        className="help-owner-btn"
        onClick={() => setShowHelp(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <HelpCircle size={20} />
        <span>Help the Owner</span>
      </motion.button>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="modal-overlay" onClick={() => setShowHelp(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowHelp(false)} className="modal-close"><X size={20} /></button>

              {helpSent ? (
                <div className="help-success">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="help-success-icon"
                  >
                    ✅
                  </motion.div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. The owner will see your message.</p>
                </div>
              ) : (
                <>
                  <div className="help-modal-header">
                    <div className="help-modal-icon">
                      <MessageSquare size={24} />
                    </div>
                    <h3>Help the Owner</h3>
                    <p>Got a suggestion, bug report, or just want to say hi? Send a message directly to the NemoChat team.</p>
                  </div>
                  <form onSubmit={handleHelpSubmit} className="modal-form">
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Nemo"
                        value={helpName}
                        onChange={(e) => setHelpName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email (optional)</label>
                      <input
                        type="email"
                        className="input-field"
                        placeholder="e.g. nemo@ocean.com"
                        value={helpEmail}
                        onChange={(e) => setHelpEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Message *</label>
                      <textarea
                        className="input-field"
                        placeholder="Tell us what's on your mind..."
                        rows={4}
                        value={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                        required
                        style={{ resize: 'vertical', minHeight: 100 }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={helpLoading}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}
                    >
                      {helpLoading ? 'Sending...' : <><Send size={18} /> Send Message</>}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
