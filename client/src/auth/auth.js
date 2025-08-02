const API_BASE = 'http://localhost:8000/';

export const auth = {
  getToken: () => localStorage.getItem('access_token'),
  
  setTokens: (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },
  
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  isAuthenticated: () => !!localStorage.getItem('access_token'),
  
  getAuthHeaders: () => ({
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json'
  })
};

export const api = {
  getBaseUrl: () => API_BASE,
  
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}profile/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },
  
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE}profile/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return response.json();
  },
  
  logout: async () => {
    const refresh = localStorage.getItem('refresh_token');
    const response = await fetch(`${API_BASE}profile/logout/`, {
      method: 'POST',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({ refresh })
    });
    return response;
  },
  
  
  getEvents: async () => {
    const response = await fetch(`${API_BASE}events/`);
    return response.json();
  },
  
  getEvent: async (id) => {
    const response = await fetch(`${API_BASE}events/${id}/`);
    return response.json();
  },
  
  
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}profile/me/`, {
      headers: auth.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  createBooking: async (eventId) => {
    const response = await fetch(`${API_BASE}bookings/create/`, {
      method: 'POST',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({ event: eventId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Failed to create booking');
    }
    
    return response.json();
  },
  
  getUserBookings: async () => {
    const response = await fetch(`${API_BASE}bookings/`, {
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  getBookingDetail: async (code) => {
    const response = await fetch(`${API_BASE}bookings/${code}/`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Booking not found');
    }
    
    return response.json();
  },
  
  cancelBooking: async (code) => {
    const response = await fetch(`${API_BASE}bookings/${code}/cancel/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Failed to cancel booking');
    }
    
    return response.json();
  },
};
