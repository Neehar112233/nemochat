import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Hash, Lock as LockIcon, ChevronRight, Loader2, Search } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/rooms/public', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/rooms/create', 
        { name: newRoomName, isPrivate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/chat/${res.data.code}`);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating room');
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!joinCode) return;
    navigate(`/chat/${joinCode.toUpperCase()}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h2>Welcome, {user.username}</h2>
          <p>Join an existing room or create your own</p>
        </div>
        
        <div className="dashboard-actions">
          <form onSubmit={handleJoinByCode} className="join-form">
            <Search className="input-icon" />
            <input 
              type="text" 
              className="input-field with-icon" 
              placeholder="Join by code..."
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              style={{ paddingLeft: 44, paddingTop: 8, paddingBottom: 8, fontSize: 13 }}
            />
          </form>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
          >
            <Plus size={20} />
            <span>Create Room</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="section-title">
          <Users size={20} />
          Public Rooms
        </h3>
        
        {loading ? (
          <div className="loading-center">
            <Loader2 className="spinner" style={{ width: 40, height: 40, color: 'var(--accent-color)' }} />
          </div>
        ) : rooms.length === 0 ? (
          <div className="glass empty-state">
            No public rooms available. Why not create one?
          </div>
        ) : (
          <div className="room-grid">
            {rooms.map((room) => (
              <motion.div 
                key={room._id}
                whileHover={{ y: -5 }}
                className="glass room-card"
                onClick={() => navigate(`/chat/${room.code}`)}
              >
                <div className="room-card-header">
                  <div className="room-card-icon">
                    <Hash size={24} />
                  </div>
                  <span className="room-code-badge">{room.code}</span>
                </div>
                <h4>{room.name}</h4>
                <p className="room-card-meta">
                  Created by <span>{room.createdBy?.username}</span>
                </p>
                <div className="room-card-footer">
                  <span>{room.participants.length} Participant{room.participants.length !== 1 ? 's' : ''}</span>
                  <ChevronRight size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass modal-content"
          >
            <button onClick={() => setShowModal(false)} className="modal-close">
              <Plus style={{ transform: 'rotate(45deg)' }} size={24} />
            </button>
            <h3 className="modal-title">Create New Room</h3>
            <form onSubmit={handleCreateRoom} className="modal-form">
              <div className="form-group">
                <label className="form-label">Room Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Movie Lovers" 
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  required
                />
              </div>
              <div className="toggle-row">
                <div className={`toggle-icon ${isPrivate ? 'private' : 'public'}`}>
                  {isPrivate ? <LockIcon size={18} /> : <Users size={18} />}
                </div>
                <div className="toggle-text">
                  <p>Private Room</p>
                  <small>Only visible if they have the code</small>
                </div>
                <input 
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>Create & Join</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
