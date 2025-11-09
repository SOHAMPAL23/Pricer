import api from './api';

export const authService = {
  login: async (email, password) => {
    // Changed from /auth/login to /api/login to match Flask backend
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  },

  signup: async (name, email, password) => {
    // Changed from /auth/signup to /api/register to match Flask backend
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: name, email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    
    return data;
  },

  getProfile: async () => {
    // This would need to be implemented if needed
    return null;
  },
};