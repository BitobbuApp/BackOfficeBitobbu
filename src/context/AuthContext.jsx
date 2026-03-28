import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync state with token
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // In a real app we might fetch user details using the token
      // Mocking user profile here based on the requirement
      // Try to parse user from local storage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          try {
              setUser(JSON.parse(storedUser));
          } catch(e) {
              // fallback
              setUser({ name: 'Super Admin', email: 'admin@bitobbu.com', role: 'admin' });
          }
      } else {
        setUser({ name: 'Super Admin', email: 'admin@bitobbu.com', role: 'admin' });
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      // Simulate API call to /api/v1/auth/verify?role=admin
      // In a real scenario, uncomment and use axios:
      // const response = await axios.post('/api/v1/auth/verify?role=admin', { email, password });
      // const { token, user } = response.data;

      // Mocking successful login for admin
      if (email === 'admin@bitobbu.com' && password === 'admin123') {
        const mockToken = 'mock-jwt-token-12345';
        const mockUser = { name: 'Super Admin', email: 'admin@bitobbu.com', role: 'admin' };

        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));

        return { success: true };
      } else {
         return { success: false, message: 'Invalid credentials' };
      }

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
