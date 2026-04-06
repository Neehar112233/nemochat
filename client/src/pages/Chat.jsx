import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Share2, LogOut, Loader2, MessageSquare, ShieldAlert } from 'lucide-react';
import useChat from '../hooks/useChat';

const Chat = ({ user }) => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  
  const { messages, setMessages, isConnected, joinRoom, sendMessage, leaveRoom } = useChat(room?._id);

  useEffect(() => {
    fetchRoom();
  }, [code]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/rooms/${code}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoom(res.data);
      
      const msgRes = await axios.get(`http://localhost:5000/api/rooms/${res.data._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(msgRes.data);
      
      joinRoom({ roomId: res.data._id, userId: user.id, username: user.username, isAdmin: user.isAdmin });
    } catch (err) {
      setError(err.response?.data?.msg || 'Room not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage({ roomId: room._id, userId: user.id, username: user.username, text: inputText });
    setInputText('');
  };

  const handleLeave = () => {
    leaveRoom({ roomId: room._id, userId: user.id, username: user.username, isAdmin: user.isAdmin });
    navigate('/dashboard');
  };

  const copyInvite = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Invite link copied to clipboard!');
  };

  if (loading) return (
    <div className="loading-center" style={{ paddingTop: 160 }}>
      <Loader2 className="spinner" style={{ width: 48, height: 48, color: 'var(--accent-color)' }} />
    </div>
  );

  if (error) return (
    <div className="error-page">
      <ShieldAlert style={{ width: 80, height: 80 }} />
      <h2>{error}</h2>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">Back to Dashboard</button>
    </div>
  );

  return (
    <div className="chat-page">
      <div className="glass chat-header">
        <div className="chat-header-info">
          <div className="chat-header-icon">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="chat-room-name">{room?.name}</h4>
            <div className="chat-room-meta">
              <span className="chat-room-code">{room?.code}</span>
              <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
              <span className="status-text">{isConnected ? 'Live' : 'Connecting...'}</span>
            </div>
          </div>
        </div>
        
        <div className="chat-header-actions">
          <button onClick={copyInvite} className="chat-action-btn" title="Copy Invite Link">
            <Share2 size={20} />
          </button>
          <button onClick={handleLeave} className="chat-action-btn leave" title="Leave Room">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="glass messages-area">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.sender === user.id || msg.username === user.username;
            const isSystem = msg.username === 'System';
            
            return (
              <motion.div 
                key={msg._id || idx}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`message-row ${isSystem ? 'center' : isMe ? 'right' : 'left'}`}
              >
                {isSystem ? (
                  <span className="system-message">{msg.text}</span>
                ) : (
                  <div className={`message-bubble-wrapper ${isMe ? 'right' : 'left'}`}>
                    <span className="message-sender">
                      {isMe ? 'You' : msg.username}
                    </span>
                    <div className={`message-bubble ${isMe ? 'sent' : 'received'}`}>
                      <p className="message-text">{msg.text}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="message-input-form">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ paddingRight: 64, paddingTop: 20, paddingBottom: 20, fontSize: 15 }}
        />
        <button 
          type="submit" 
          className="send-btn"
          disabled={!inputText.trim()}
        >
          <Send size={20} />
        </button>
      </form>
      <p className="chat-footer-text">
        NemoChat • End-to-End Transient Messaging
      </p>
    </div>
  );
};

export default Chat;
