import axios from 'axios';

const API_URL = 'http://localhost:5000/api/phones';

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

// 获取所有手机商品
const getPhones = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取商品列表失败';
  }
};

// 获取单个手机商品详情
const getPhoneById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取商品详情失败';
  }
};

// 添加到收藏
const addToFavorite = async (phoneId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${phoneId}/favorite`,
      {},
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '添加到收藏失败';
  }
};

// 从收藏中移除
const removeFromFavorite = async (phoneId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${phoneId}/favorite`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '从收藏中移除失败';
  }
};

// 添加新手机商品 (仅管理员)
const createPhone = async (formData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '添加商品失败';
  }
};

// 更新手机商品 (仅管理员)
const updatePhone = async (id, formData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '更新商品失败';
  }
};

// 删除手机商品 (仅管理员)
const deletePhone = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '删除商品失败';
  }
};

const phoneService = {
  getPhones,
  getPhoneById,
  addToFavorite,
  removeFromFavorite,
  createPhone,
  updatePhone,
  deletePhone
};

export default phoneService; 