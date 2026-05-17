import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  username: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // In a real app, you'd fetch user profile here
      // For now, we just assume logged in if token exists
      // We will fetch profile in Dashboard anyway, or here.
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setUser({ id: res.data.id, username: res.data.username, email: res.data.email });
    } catch (error) {
      console.error(error);
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      const res = await api.post('/auth/login', credentials);
      localStorage.setItem('access_token', res.data.access_token);
      await fetchProfile();
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/login');
    toast.success('Đã đăng xuất');
  };

  return { user, loading, login, logout };
};
