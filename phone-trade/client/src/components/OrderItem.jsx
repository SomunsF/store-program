import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const OrderItem = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 订单状态映射
  const statusMap = {
    pending: { text: '待处理', className: 'bg-yellow-100 text-yellow-800' },
    processing: { text: '处理中', className: 'bg-blue-100 text-blue-800' },
    completed: { text: '已完成', className: 'bg-green-100 text-green-800' },
    cancelled: { text: '已取消', className: 'bg-red-100 text-red-800' }
  };

  // 日期格式化
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center">
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${statusMap[order.status]?.className || 'bg-gray-200'}`}>
              {statusMap[order.status]?.text || '未知状态'}
            </span>
            <span className="text-sm text-gray-500 ml-4">订单号: {order._id}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">创建于: {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-blue-600 mr-4">
            估价: ¥{order.estimatedPrice || '---'}
          </span>
          <ChevronDownIcon 
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="font-semibold text-md mb-3 text-gray-800">回收设备详情</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold text-gray-600">品牌:</span> {order.phoneBrand}</div>
            <div><span className="font-semibold text-gray-600">型号:</span> {order.phoneModel}</div>
            <div><span className="font-semibold text-gray-600">存储容量:</span> {order.storage || '未提供'}</div>
            <div><span className="font-semibold text-gray-600">颜色:</span> {order.color || '未提供'}</div>
            <div><span className="font-semibold text-gray-600">设备成色:</span> {order.phoneCondition}</div>
            <div><span className="font-semibold text-gray-600">电池容量:</span> {order.batteryCapacity || '未提供'}</div>
            <div className="md:col-span-2"><span className="font-semibold text-gray-600">功能状况:</span> {order.functionalCondition === '正常' ? '一切功能正常' : '有功能性损坏'}</div>
            {order.description && <div className="md:col-span-2"><span className="font-semibold text-gray-600">补充描述:</span> {order.description}</div>}
          </div>
          
          <h4 className="font-semibold text-md mt-6 mb-3 text-gray-800">设备照片</h4>
          {order.phoneImages && order.phoneImages.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {order.phoneImages.map((image, index) => (
                <div key={index} className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden border">
                  <img
                    src={`${API_BASE_URL}${image}`}
                    alt={`回收设备图片 ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">未提供照片。</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderItem; 