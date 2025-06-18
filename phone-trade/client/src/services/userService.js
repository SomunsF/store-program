import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const API_URL = `${API_BASE_URL}/api/users`;

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

// 获取所有用户 (仅管理员)
const getUsers = async () => {
  try {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取用户列表失败';
  }
};

// 获取用户浏览历史
const getBrowsingHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/browsing-history`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取浏览历史失败';
  }
};

// 获取用户收藏列表
const getFavorites = async () => {
  try {
    const response = await axios.get(`${API_URL}/favorites`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取收藏列表失败';
  }
};

// 添加到浏览历史
const addBrowsingHistory = async (phoneId) => {
  try {
    await axios.post(
      `${API_URL}/browsing-history`,
      { phoneId },
      getConfig()
    );
  } catch (error) {
    // 这个错误可以静默处理
    console.error('添加浏览历史失败:', error.response?.data?.message || error.message);
  }
};

// 更新用户资料
const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/profile`,
      userData,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '更新用户资料失败';
  }
};

// 更新用户 (仅管理员)
const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '更新用户失败';
  }
};

// 删除用户 (仅管理员)
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '删除用户失败';
  }
};

const userService = {
  getUsers,
  getBrowsingHistory,
  getFavorites,
  addBrowsingHistory,
  updateUserProfile,
  updateUser,
  deleteUser,
};

export default userService; 