import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="glass navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span>Nemo</span>Chat
      </Link>
      
      <div className="navbar-links">
        <Link to="/dashboard" className="navbar-link">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        
        {user?.isAdmin && (
          <Link to="/admin" className="navbar-link">
            <Shield size={18} />
            <span>Admin</span>
          </Link>
        )}
        
        <div className="navbar-divider"></div>
        
        <div className="navbar-user">
          <div className="navbar-user-badge">
            <User size={14} style={{ color: 'var(--accent-color)' }} />
            <span>{user?.username}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="navbar-logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
