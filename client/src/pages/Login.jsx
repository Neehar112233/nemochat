import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Loader2, Shield } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isAdminLogin ? '/api/auth/admin-login' : '/api/auth/login';
      const res = await axios.post(endpoint, { username, password });
      onLogin(res.data);
      navigate(isAdminLogin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setError('');
    setUsername(isAdminLogin ? '' : 'admin');
    setPassword('');
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass auth-card"
      >
        <div className="auth-header">
          <div className="auth-icon" style={isAdminLogin ? { background: 'linear-gradient(135deg, #ff6b35, #ff3366)' } : {}}>
            {isAdminLogin ? <Shield /> : <LogIn />}
          </div>
          <h1 className="auth-title">{isAdminLogin ? 'Admin Access' : 'Welcome Back'}</h1>
          <p className="auth-subtitle">
            {isAdminLogin ? 'Enter admin credentials to access the panel' : 'Log in to NemoChat to start chatting'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-banner">{error}</div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input 
                type="text" 
                className="input-field with-icon" 
                placeholder={isAdminLogin ? 'admin' : 'Enter username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                readOnly={isAdminLogin}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input 
                type="password" 
                className="input-field with-icon" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%',
              ...(isAdminLogin ? { background: 'linear-gradient(135deg, #ff6b35, #ff3366)' } : {})
            }}
          >
            {loading ? <Loader2 className="spinner" style={{ width: 20, height: 20 }} /> : (isAdminLogin ? 'Admin Login' : 'Log In')}
          </button>
        </form>

        <p className="auth-footer">
          {isAdminLogin ? (
            <span onClick={toggleAdminLogin} style={{ color: 'var(--accent)', cursor: 'pointer' }}>← Back to User Login</span>
          ) : (
            <>
              Don't have an account? <Link to="/register">Create one</Link>
              <br />
              <span onClick={toggleAdminLogin} style={{ color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', marginTop: '8px', display: 'inline-block' }}>
                <Shield size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Admin Login
              </span>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
