import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const loginUser = (responseData) => {
    const flatUser = {
      id: responseData.user.id,
      username: responseData.user.username,
      isAdmin: responseData.user.isAdmin,
      token: responseData.token,
    };
    localStorage.setItem('user', JSON.stringify(flatUser));
    localStorage.setItem('token', responseData.token);
    setUser(flatUser);
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={logoutUser} />}
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={loginUser} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/chat/:code" element={user ? <Chat user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.isAdmin ? <Admin user={user} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
