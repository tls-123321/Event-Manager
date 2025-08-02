import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, auth } from '../auth/auth';

export default function Profile({ onAuthChange }) {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated()) {
      fetchUserData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
      
      const bookingsData = await api.getUserBookings();
      setBookings(bookingsData);
    } catch (err) {
      if (err.message.includes('401')) {
        auth.clearTokens();
        if (onAuthChange) onAuthChange();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      auth.clearTokens();
      if (onAuthChange) onAuthChange();
      window.location.href = '/';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate('/')}>← Back to Events</button>
      <h1>Profile</h1>

      <div>
        <h2>User Information</h2>
        <p>Username: {user?.username}</p>
        <p>Email: {user?.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div>
        <h2>My Bookings</h2>
        {bookings.length === 0 ? (
          <div>
            <p>No bookings yet.</p>
            <button onClick={() => navigate('/')}>Browse Events</button>
          </div>
        ) : (
          <div>
            {bookings.map(booking => (
              <div key={booking.code}>
                <p>{booking.event_title} - Code: {booking.code}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}