import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import orderService from '../../services/orderService';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('获取订单列表失败:', error);
      toast.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新订单状态
  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success('订单状态已更新');
      fetchOrders();
    } catch (error) {
      console.error('更新订单状态失败:', error);
      toast.error('更新订单状态失败');
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 过滤和搜索订单
  const filteredOrders = orders
    .filter((order) => {
      if (filter === 'all') return true;
      if (filter === 'purchase') return order.type === 'purchase';
      if (filter === 'recycle') return order.type === 'recycle';
      return order.status === filter;
    })
    .filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      const userId = order.user?._id?.toLowerCase() || '';
      const userName = order.user?.username?.toLowerCase() || '';
      const userPhone = order.user?.phone?.toLowerCase() || '';
      const orderId = order._id?.toLowerCase() || '';
      
      return (
        userId.includes(searchLower) ||
        userName.includes(searchLower) ||
        userPhone.includes(searchLower) ||
        orderId.includes(searchLower)
      );
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-primary-600" />
        <span className="ml-2 text-gray-600">加载中...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">订单管理</h2>
        <p className="mt-1 text-sm text-gray-500">
          查看和管理平台所有订单信息
        </p>
      </div>

      {/* 过滤和搜索栏 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/3">
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">所有订单</option>
            <option value="purchase">购买订单</option>
            <option value="recycle">回收订单</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <div className="sm:w-2/3">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="input pr-10"
              placeholder="搜索用户名、手机号或订单ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              没有找到匹配的订单
            </li>
          ) : (
            filteredOrders.map((order) => (
              <li key={order._id} className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  {/* 订单基本信息 */}
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.type === 'purchase'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.type === 'purchase' ? '购买' : '回收'}
                      </span>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status === 'pending'
                          ? '待处理'
                          : order.status === 'processing'
                          ? '处理中'
                          : order.status === 'completed'
                          ? '已完成'
                          : '已取消'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-2">
                      订单ID: {order._id}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      用户: {order.user?.username} ({order.user?.phone})
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      订单时间: {formatDate(order.createdAt)}
                    </div>
                  </div>

                  {/* 订单详情和操作 */}
                  <div>
                    {order.type === 'purchase' && order.phone && (
                      <div className="text-sm text-gray-900 mb-3">
                        商品: {order.phone.title}
                        <br />
                        价格: ¥{order.phone.price}
                      </div>
                    )}
                    {order.type === 'recycle' && (
                      <div className="text-sm text-gray-900 mb-3">
                        品牌: {order.phoneBrand}
                        <br />
                        型号: {order.phoneModel}
                        <br />
                        成色: {order.phoneCondition}
                      </div>
                    )}

                    {/* 订单操作 */}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'processing')}
                            className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                          >
                            开始处理
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'completed')}
                            className="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
                          >
                            标记完成
                          </button>
                        )}
                        <button
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          取消订单
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrderManagement; 