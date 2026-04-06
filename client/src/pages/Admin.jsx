import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Shield, Eye, Trash2, Users, Loader2, AlertCircle, RefreshCw, Inbox, LayoutDashboard, Check, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = ({ user }) => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [roomsRes, msgsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/rooms/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/contact/all', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setRooms(roomsRes.data);
      setMessages(msgsRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setRooms(rooms.filter(room => room._id !== id));
    } catch (err) {
      alert('Error deleting room');
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/contact/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      alert('Error marking as read');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/contact/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      alert('Error deleting message');
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-info">
          <div className="admin-header-icon">
            <Shield size={32} />
          </div>
          <div>
            <h2>Admin Panel</h2>
            <p>Full oversight of NemoChat rooms and messages</p>
          </div>
        </div>
        <button onClick={fetchAdminData} className="refresh-btn">
          <RefreshCw size={20} className={loading ? 'spinner' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
          <LayoutDashboard size={18} /> Rooms ({rooms.length})
        </button>
        <button className={`admin-tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
          <Inbox size={18} /> Inbox
          {unreadCount > 0 && <span className="admin-tab-badge">{unreadCount}</span>}
        </button>
      </div>

      {error ? (
        <div className="glass admin-error">
          <AlertCircle size={48} />
          <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{error}</p>
        </div>
      ) : loading ? (
        <div className="loading-center">
          <Loader2 className="spinner" style={{ width: 48, height: 48, color: 'var(--accent-color)' }} />
        </div>
      ) : activeTab === 'rooms' ? (
        /* Rooms Tab */
        rooms.length === 0 ? (
          <div className="glass empty-state">No rooms currently active.</div>
        ) : (
          <div className="glass" style={{ overflow: 'hidden' }}>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Room Name</th>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Participants</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <motion.tr key={room._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td className="room-name">{room.name}</td>
                      <td className="room-code">{room.code}</td>
                      <td>
                        <span className={`type-badge ${room.isPrivate ? 'private' : 'public'}`}>
                          {room.isPrivate ? 'Private' : 'Public'}
                        </span>
                      </td>
                      <td>
                        <div className="participant-count">
                          <Users size={14} />
                          <span>{room.participants.length}</span>
                        </div>
                      </td>
                      <td className="created-by">{room.createdBy?.username || 'System'}</td>
                      <td>
                        <div className="admin-actions">
                          <button onClick={() => navigate('/chat/' + room.code)} className="admin-action-btn" title="View"><Eye size={18} /></button>
                          <button onClick={() => deleteRoom(room._id)} className="admin-action-btn delete" title="Delete"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Inbox Tab */
        messages.length === 0 ? (
          <div className="glass empty-state">
            <Mail size={40} style={{ marginBottom: 16, color: 'var(--text-secondary)' }} />
            <p>No messages yet. When visitors use "Help the Owner", their messages will appear here.</p>
          </div>
        ) : (
          <div className="inbox-list">
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass inbox-card ${!msg.read ? 'unread' : ''}`}
              >
                <div className="inbox-card-header">
                  <div>
                    <span className="inbox-sender">{msg.name}</span>
                    {msg.email && <span className="inbox-email">({msg.email})</span>}
                  </div>
                  <span className="inbox-time">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="inbox-message">{msg.message}</p>
                <div className="inbox-actions">
                  {!msg.read && (
                    <button onClick={() => markAsRead(msg._id)} className="inbox-action-btn">
                      <Check size={14} /> Mark as Read
                    </button>
                  )}
                  <button onClick={() => deleteMessage(msg._id)} className="inbox-action-btn delete">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Admin;
