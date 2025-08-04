import { useState, useEffect } from 'react';
import { api, auth } from '../auth/auth';

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return isNaN(d) ? '' : d.toLocaleDateString();
}

function EventCard({ event, ...props }) {
  const [imgError, setImgError] = useState(false);
  const thumbnailSrc = !imgError && event.thumbnail_url ? event.thumbnail_url : '/media/nothumbnail.jpeg';
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 6, margin: '1rem 0', padding: 16, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <img
        src={thumbnailSrc}
        style={{ width: 220, height: 180, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
        onError={() => setImgError(true)}
      />
      <div style={{ flex: 1 }}>
        {props.children}
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingCodes, setBookingCodes] = useState({});
  const [bookingLoading, setBookingLoading] = useState({});
  const [manageCode, setManageCode] = useState({});
  const [bookingDetails, setBookingDetails] = useState({});
  const [bookingError, setBookingError] = useState({});
  const [canceling, setCanceling] = useState({});

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => setError('Failed to load events')).finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? events.filter(e => (e.title || '').toLowerCase().includes(search.toLowerCase()) || (e.description || '').toLowerCase().includes(search.toLowerCase()))
    : events;

  async function handleBooking(eventId) {
    if (!auth.isAuthenticated()) return alert('Please login to book events');
    if (!window.confirm('Are you sure you want to book this event?')) return;
    setBookingLoading(x => ({ ...x, [eventId]: true }));
    try {
      const booking = await api.createBooking(eventId);
      setBookingCodes(x => ({ ...x, [eventId]: booking.code }));
      setTimeout(() => setBookingCodes(x => { const y = { ...x }; delete y[eventId]; return y; }), 10000);
    } catch (e) {
      alert(e.message || 'Failed to create booking');
    } finally {
      setBookingLoading(x => ({ ...x, [eventId]: false }));
    }
  }

  async function handleManageBooking(eventId) {
    const code = (manageCode[eventId] || '').trim().toUpperCase();
    if (!code) return setBookingError(x => ({ ...x, [eventId]: 'Enter booking code' }));
    setBookingError(x => ({ ...x, [eventId]: null }));
    try {
      const booking = await api.getBookingDetail(code);
      setBookingDetails(x => ({ ...x, [eventId]: booking }));
    } catch (e) {
      setBookingError(x => ({ ...x, [eventId]: e.message || 'Invalid code' }));
    }
  }

  async function handleCancelBooking(eventId, code) {
    const booking = bookingDetails[eventId];
    if (!booking.can_cancel) return alert('This booking cannot be canceled.');
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCanceling(x => ({ ...x, [eventId]: true }));
    try {
      await api.cancelBooking(code);
      alert('Booking canceled!');
      setBookingDetails(x => { const y = { ...x }; delete y[eventId]; return y; });
      setManageCode(x => ({ ...x, [eventId]: '' }));
      setBookingCodes(x => { const y = { ...x }; delete y[eventId]; return y; });
    } catch (e) {
      alert(e.message || 'Failed to cancel booking');
    } finally {
      setCanceling(x => ({ ...x, [eventId]: false }));
    }
  }

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Events</h2>
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {filtered.length === 0 ? (
        <div>No events found.</div>
      ) : (
        <div>
          {filtered.map(event => (
            <EventCard key={event.id} event={event}>
              <div style={{ fontWeight: 'bold', fontSize: 20 }}>{event.title}</div>
              <div>{event.description}</div>
              <div>Date: {formatDate(event.startDate)} - {formatDate(event.endDate)}</div>
              {auth.isAuthenticated() && (
                <div style={{ marginTop: 12 }}>
                  <button onClick={() => handleBooking(event.id)} disabled={bookingLoading[event.id]}>
                    {bookingLoading[event.id] ? 'Booking...' : bookingCodes[event.id] ? `Booked! ${bookingCodes[event.id]}` : 'Book Now'}
                  </button>
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="text"
                      placeholder="Enter booking code"
                      value={manageCode[event.id] || ''}
                      onChange={e => setManageCode(x => ({ ...x, [event.id]: e.target.value }))}
                    />
                    <button onClick={() => handleManageBooking(event.id)} style={{ marginLeft: 8 }}>Manage Booking</button>
                  </div>
                  {bookingError[event.id] && <div style={{ color: 'red' }}>{bookingError[event.id]}</div>}
                  {bookingDetails[event.id] && (
                    <div style={{ marginTop: 8, border: '1px solid #eee', padding: 8 }}>
                      <div>Code: {bookingDetails[event.id].code}</div>
                      <div>Status: {bookingDetails[event.id].status}</div>
                      <div>Booked On: {formatDate(bookingDetails[event.id].created_at)}</div>
                      {bookingDetails[event.id].status === 'Active' && (
                        <button
                          onClick={() => handleCancelBooking(event.id, bookingDetails[event.id].code)}
                          disabled={canceling[event.id]}
                          style={{ marginTop: 8 }}
                        >
                          {canceling[event.id] ? 'Canceling...' : 'Cancel Booking'}
                        </button>
                      )}
                      <button onClick={() => setBookingDetails(x => { const y = { ...x }; delete y[event.id]; return y; })} style={{ marginLeft: 8 }}>
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
            </EventCard>
          ))}
        </div>
      )}
    </div>
  );
}