import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Events from './Pages/Events';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import { auth, api } from './auth/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUserState = async () => {
    if (auth.isAuthenticated()) {
      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        // If token is invalid, clear it
        if (err.message.includes('401')) {
          auth.clearTokens();
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    updateUserState();
  }, []);

  const handleAuthChange = () => {
    updateUserState();
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login onAuthChange={handleAuthChange} />} />
          <Route path="/register" element={<Register onAuthChange={handleAuthChange} />} />
          <Route path="/profile" element={<Profile onAuthChange={handleAuthChange} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;