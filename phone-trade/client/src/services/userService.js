import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

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
  updateUserProfile,
  updateUser,
  deleteUser,
};

export default userService; 