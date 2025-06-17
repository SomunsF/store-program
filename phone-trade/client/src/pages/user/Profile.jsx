import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  UserCircleIcon,
  CreditCardIcon,
  ClockIcon,
  HeartIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import OrderItem from '../../components/OrderItem';
import { API_BASE_URL } from '../../config/apiConfig';
import PhoneCard from '../../components/PhoneCard';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  
  const [view, setView] = useState('main'); // 'main', 'orders', 'profile', 'history', 'favorites'
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [data, setData] = useState({ orders: [], history: [], favorites: [] });

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
    }
  }, [user, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || view === 'main' || view === 'profile') return;
      
      setLoading(true);
      try {
        let result;
        if (view === 'orders') {
          result = await orderService.getMyOrders();
          setData(prev => ({ ...prev, orders: result }));
        } else if (view === 'history') {
          result = await userService.getBrowsingHistory();
          setData(prev => ({ ...prev, history: result }));
        } else if (view === 'favorites') {
          result = await userService.getFavorites();
          setData(prev => ({ ...prev, favorites: result }));
        }
      } catch (error) {
        toast.error('数据加载失败，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [view, user]);

  const updateProfile = async (formData) => {
    setUpdateLoading(true);
    try {
      await userService.updateUserProfile(formData);
      toast.success('个人资料已更新。');
      if (formData.password) {
        setValue('password', '');
      }
      // Consider a state management solution to refresh user data globally
    } catch (error) {
      toast.error('更新失败，请稍后重试。');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };
  
  const navigationItems = [
    { name: '我的订单', view: 'orders', icon: CreditCardIcon, description: '查看和管理您的订单' },
    { name: '个人资料', view: 'profile', icon: UserCircleIcon, description: '更新您的账户信息' },
    { name: '浏览记录', view: 'history', icon: ClockIcon, description: '查看您最近浏览过的商品' },
    { name: '我的收藏', view: 'favorites', icon: HeartIcon, description: '管理您收藏的商品' },
  ];

  const renderDetailView = () => {
    const currentItem = navigationItems.find(item => item.view === view);

    let content;
    if (loading) {
      content = <div className="flex justify-center items-center py-20"><ArrowPathIcon className="animate-spin h-8 w-8 text-gray-500" /></div>;
    } else {
      switch (view) {
        case 'profile':
          content = <ProfileForm user={user} register={register} errors={errors} handleSubmit={handleSubmit(updateProfile)} updateLoading={updateLoading} />;
          break;
        case 'orders':
          content = <OrderList orders={data.orders} />;
          break;
        case 'history':
          content = <ProductList products={data.history.map(item => item.phone)} emptyMessage="你还没有浏览任何商品。" link="/" linkText="去逛逛" />;
          break;
        case 'favorites':
          content = <ProductList products={data.favorites.map(item => item.phone)} emptyMessage="你的收藏夹是空的。" link="/" linkText="发现更多" />;
          break;
        default:
          content = null;
      }
    }

    return (
      <div>
        <button onClick={() => setView('main')} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          返回个人中心
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentItem?.name}</h2>
        {content}
      </div>
    );
  };
  
  if (!user) {
    return (
      <div className="text-center py-20">
        <p>请先 <Link to="/login" className="text-blue-600 hover:underline">登录</Link> 以查看个人中心。</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'main' ? (
          <>
            <div className="text-center mb-12">
              <UserCircleIcon className="mx-auto h-20 w-20 text-gray-300" />
              <h1 className="mt-4 text-3xl font-bold text-gray-900">你好, {user.username}</h1>
              <p className="mt-1 text-md text-gray-500">欢迎回到你的个人中心</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {navigationItems.map((item) => (
                <div key={item.name} onClick={() => setView(item.view)} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <item.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                退出登录
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
            {renderDetailView()}
          </div>
        )}
      </main>
    </div>
  );
};

// --- Sub-components for better organization ---

const ProfileForm = ({ user, register, errors, handleSubmit, updateLoading }) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
        用户名
      </label>
      <input
        type="text"
        id="username"
        {...register('username', { required: '用户名不能为空' })}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
    </div>
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        新密码 (可选)
      </label>
      <input
        type="password"
        id="password"
        {...register('password')}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="不修改请留空"
      />
    </div>
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={updateLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {updateLoading ? (
          <>
            <ArrowPathIcon className="animate-spin h-5 w-5 mr-3" />
            更新中...
          </>
        ) : '保存更改'}
      </button>
    </div>
  </form>
);

const OrderList = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">没有订单</h3>
        <p className="mt-1 text-sm text-gray-500">你还没有创建任何回收订单。</p>
        <div className="mt-6">
          <Link to="/recycle" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            申请回收
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderItem key={order._id} order={order} />
      ))}
    </div>
  );
};

const ProductList = ({ products, emptyMessage, link, linkText }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
        <div className="mt-6">
          <Link to={link} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            {linkText}
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((phone) => (
        phone && <PhoneCard key={phone._id} phone={phone} />
      ))}
    </div>
  );
};

export default Profile; 