import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ArrowPathIcon, MagnifyingGlassIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import orderService from '../../services/orderService';
import { API_BASE_URL } from '../../config/apiConfig';

const AdminOrderItem = ({ order, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [estimatedPrice, setEstimatedPrice] = useState(order.estimatedPrice || '');

  const handleUpdate = async () => {
    onUpdate(order._id, { status, estimatedPrice: Number(estimatedPrice) });
  };
  
  const statusMap = {
    pending: { text: '待处理', className: 'bg-yellow-100 text-yellow-800' },
    processing: { text: '处理中', className: 'bg-blue-100 text-blue-800' },
    completed: { text: '已完成', className: 'bg-green-100 text-green-800' },
    cancelled: { text: '已取消', className: 'bg-red-100 text-red-800' }
  };

  return (
    <li className="bg-white border border-gray-200 rounded-lg mb-4">
      <div 
        className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="flex items-center">
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${statusMap[order.status]?.className || 'bg-gray-200'}`}>
              {statusMap[order.status]?.text || '未知'}
            </span>
             <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ml-2 ${order.type === 'purchase' ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'}`}>
              {order.type === 'purchase' ? '购买' : '回收'}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900 mt-2">订单号: {order._id}</p>
          <p className="text-sm text-gray-500 mt-1">用户: {order.user?.username} ({order.user?.phone})</p>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 text-sm mr-4">估价: ¥{order.estimatedPrice || 'N/A'}</span>
          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">订单详情</h4>
              <p className="text-sm"><span className="font-medium">品牌:</span> {order.phoneBrand}</p>
              <p className="text-sm"><span className="font-medium">型号:</span> {order.phoneModel}</p>
              <p className="text-sm"><span className="font-medium">存储:</span> {order.storage}</p>
              <p className="text-sm"><span className="font-medium">颜色:</span> {order.color}</p>
              <p className="text-sm"><span className="font-medium">成色:</span> {order.phoneCondition}</p>
              <p className="text-sm"><span className="font-medium">电池:</span> {order.batteryCapacity}</p>
              <p className="text-sm"><span className="font-medium">功能:</span> {order.functionalCondition}</p>
              <p className="text-sm"><span className="font-medium">描述:</span> {order.description || '无'}</p>
            </div>
             <div>
              <h4 className="font-semibold text-gray-700 mb-2">设备照片</h4>
              {order.phoneImages && order.phoneImages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {order.phoneImages.map((img, index) => (
                    <a key={index} href={`${API_BASE_URL}${img}`} target="_blank" rel="noopener noreferrer">
                      <img src={`${API_BASE_URL}${img}`} alt={`设备照片 ${index+1}`} className="w-20 h-20 object-cover rounded-md border" />
                    </a>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">无照片</p>}
            </div>
            <div className="md:col-span-2 pt-4 border-t mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">订单操作</h4>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-auto">
                  <label htmlFor={`price-${order._id}`} className="block text-sm font-medium text-gray-700">估价</label>
                  <input
                    type="number"
                    id={`price-${order._id}`}
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="input-sm"
                    placeholder="输入估价"
                  />
                </div>
                <div className="w-full sm:w-auto">
                   <label htmlFor={`status-${order._id}`} className="block text-sm font-medium text-gray-700">状态</label>
                  <select
                    id={`status-${order._id}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-sm"
                  >
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </div>
                 <div className="flex-grow flex items-end h-full">
                  <button onClick={handleUpdate} className="btn btn-primary btn-sm w-full sm:w-auto">保存更改</button>
                </div>
                 <div className="flex-grow flex items-end h-full">
                   <button onClick={() => onDelete(order._id)} className="btn btn-danger btn-sm w-full sm:w-auto flex items-center justify-center">
                    <TrashIcon className="h-4 w-4 mr-1" />
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

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
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('获取订单列表失败:', error);
      toast.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId, updateData) => {
    try {
      await orderService.updateOrder(orderId, updateData);
      toast.success('订单已成功更新');
      fetchOrders();
    } catch (error) {
      toast.error('订单更新失败');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('您确定要永久删除此订单吗？此操作无法撤销。')) {
      try {
        await orderService.deleteOrder(orderId);
        toast.success('订单已删除');
        fetchOrders();
      } catch (error) {
        toast.error('删除订单失败');
      }
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      if (filter === 'all') return true;
      return order.status === filter;
    })
    .filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      if (!searchLower) return true;
      const orderId = order._id || '';
      const userPhone = order.user?.phone || '';
      return orderId.includes(searchLower) || userPhone.includes(searchLower);
    });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">订单管理</h2>
          <p className="mt-1 text-sm text-gray-500">
            共 {filteredOrders.length} 条订单
          </p>
        </div>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">所有状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <div className="relative flex-grow">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="搜索订单号或用户手机..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ul className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <AdminOrderItem 
              key={order._id} 
              order={order} 
              onUpdate={handleUpdateOrder} 
              onDelete={handleDeleteOrder} 
            />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">没有找到匹配的订单。</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default OrderManagement; 