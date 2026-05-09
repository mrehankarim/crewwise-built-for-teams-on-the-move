import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, accessToken, subscriptionStatus: subStatus } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(userData);
      setSubscriptionStatus(subStatus);
      toast.success('Login successful!');
      return { user: userData, subscriptionStatus: subStatus };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      toast.success('Registration successful! Please login.');
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // silent
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    setSubscriptionStatus(null);
    toast.success('Logged out successfully');
  };

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      return null;
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/me/update', data);
      setUser(res.data.data);
      toast.success('Profile updated successfully');
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      throw err;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.patch('/auth/me/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, subscriptionStatus, setSubscriptionStatus,
      login, register, logout, fetchMe, updateProfile, changePassword, setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
