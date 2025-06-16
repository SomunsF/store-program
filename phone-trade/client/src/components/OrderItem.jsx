import React from 'react';
import { Link } from 'react-router-dom';

const OrderItem = ({ order }) => {
  // 订单状态映射
  const statusMap = {
    pending: { text: '待处理', className: 'badge-warning' },
    processing: { text: '处理中', className: 'badge-primary' },
    completed: { text: '已完成', className: 'badge-success' },
    cancelled: { text: '已取消', className: 'badge-danger' }
  };

  // 日期格式化
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

  return (
    <div className="card mb-4 overflow-visible">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">订单时间：{formatDate(order.createdAt)}</span>
            <p className="text-sm font-medium mt-1">
              订单类型：{order.type === 'purchase' ? '购买' : '回收'}
            </p>
          </div>
          <span className={`badge ${statusMap[order.status]?.className || 'badge-warning'}`}>
            {statusMap[order.status]?.text || '待处理'}
          </span>
        </div>
      </div>

      <div className="p-4">
        {order.type === 'purchase' && order.phone && (
          <div className="flex">
            <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden">
              {order.phone.images && order.phone.images[0] && (
                <img
                  src={order.phone.images[0]}
                  alt={order.phone.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="ml-4 flex-1">
              <Link to={`/phone/${order.phone._id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600">
                {order.phone.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">价格: ¥{order.phone.price}</p>
            </div>
          </div>
        )}

        {order.type === 'recycle' && (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {order.phoneImages && order.phoneImages.map((image, index) => (
                <div key={index} className="w-20 h-20 bg-gray-200 rounded overflow-hidden">
                  <img
                    src={image}
                    alt={`回收手机图片 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <p className="font-medium">{order.phoneBrand} {order.phoneModel}</p>
              <p className="text-gray-500 mt-1">
                状态: {order.phoneCondition} | 描述: {order.description || '无'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem; 