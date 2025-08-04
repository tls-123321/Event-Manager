import { Link } from 'react-router-dom';
import { auth } from '../auth/auth';

export default function Navbar({ user }) {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.2rem 0',
      borderBottom: '1px solid #f0f0f0',
      background: '#fff',
      fontSize: '1rem',
    }}>
      <div>
        <Link to="/" style={{ marginLeft: 100, fontWeight: 600, color: '#222', letterSpacing: '0.5px' }}>
          EventApp
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {auth.isAuthenticated() ? (
          <>
            <span style={{ marginRight: 20, color: '#555' }}>{user?.username || 'User'}</span>
            <Link to="/profile" style={{ marginRight:100, color: '#222' }}>Profile</Link>
          </>
        ) : (
          <Link to="/login" style={{ marginRight:100, color: '#222' }}>Login</Link>
        )}
      </div>
    </nav>
  );
}