import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  DevicePhoneMobileIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import phoneService from '../../services/phoneService';
import userService from '../../services/userService';
import orderService from '../../services/orderService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    phones: 0,
    orders: 0,
    recycleOrders: 0,
    purchaseOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 获取用户数量
        const users = await userService.getUsers();
        
        // 获取手机商品数量
        const phones = await phoneService.getPhones();
        
        // 获取订单数量
        const orders = await orderService.getAllOrders();
        
        // 计算回收订单和购买订单数量
        const recycleOrders = orders.filter(order => order.type === 'recycle');
        const purchaseOrders = orders.filter(order => order.type === 'purchase');
        
        // 更新统计数据
        setStats({
          users: users.length,
          phones: phones.length,
          orders: orders.length,
          recycleOrders: recycleOrders.length,
          purchaseOrders: purchaseOrders.length
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
        toast.error('获取统计数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 统计卡片组件
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

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
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">欢迎使用管理后台</h2>
        <p className="mt-1 text-sm text-gray-500">
          在这里您可以管理用户、订单和手机商品信息
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="用户数量"
          value={stats.users}
          icon={UsersIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="手机商品"
          value={stats.phones}
          icon={DevicePhoneMobileIcon}
          color="bg-green-500"
        />
        <StatCard
          title="订单总数"
          value={stats.orders}
          icon={ClipboardDocumentListIcon}
          color="bg-purple-500"
        />
      </div>

      {/* 订单类型统计 */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">订单统计</h3>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">回收订单</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats.recycleOrders}
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">购买订单</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats.purchaseOrders}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 