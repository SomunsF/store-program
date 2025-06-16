import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

// 获取请求头配置
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

// 获取配置（含Content-Type）
const getJsonConfig = () => {
  const config = getConfig();
  config.headers['Content-Type'] = 'application/json';
  return config;
};

// 提交回收订单
const createRecycleOrder = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/recycle`,
      formData,
      {
        ...getConfig(),
        headers: {
          ...getConfig().headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '提交订单失败';
  }
};

// 创建购买订单
const createPurchaseOrder = async (phoneId) => {
  try {
    const response = await axios.post(
      `${API_URL}/purchase`,
      { phoneId },
      getJsonConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '创建订单失败';
  }
};

// 获取用户所有订单
const getMyOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/my`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取订单失败';
  }
};

// 获取所有订单 (仅管理员)
const getAllOrders = async () => {
  try {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取订单失败';
  }
};

// 更新订单状态 (仅管理员)
const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/${orderId}/status`,
      { status },
      getJsonConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '更新订单状态失败';
  }
};

const orderService = {
  createRecycleOrder,
  createPurchaseOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};

export default orderService; 