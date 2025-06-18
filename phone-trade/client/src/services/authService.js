import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const API_URL = `${API_BASE_URL}/api/auth`;

// 获取请求头配置
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

// 用户注册
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '注册失败';
  }
};

// 用户登录
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '登录失败';
  }
};

// 获取当前用户信息
const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取用户信息失败';
  }
};

const authService = {
  register,
  login,
  getCurrentUser
};

export default authService; 