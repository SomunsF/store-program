import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  UserIcon,
  ClockIcon,
  HeartIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import OrderItem from '../../components/OrderItem';
import { API_BASE_URL } from '../../config/apiConfig';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      username: user?.username || '',
      password: ''
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 根据激活的标签页加载不同的数据
        if (activeTab === 'orders') {
          const ordersData = await orderService.getMyOrders();
          setOrders(ordersData);
        } else if (activeTab === 'history') {
          const historyData = await userService.getBrowsingHistory();
          setBrowsingHistory(historyData);
        } else if (activeTab === 'favorites') {
          const favoritesData = await userService.getFavorites();
          setFavorites(favoritesData);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        toast.error('获取数据失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // 更新用户资料
  const updateProfile = async (data) => {
    try {
      setUpdateLoading(true);
      await userService.updateUserProfile(data);
      toast.success('资料更新成功');
      
      // 如果密码已更新，清空密码字段
      if (data.password) {
        reset({ username: data.username, password: '' });
      }
    } catch (error) {
      console.error('更新资料失败:', error);
      toast.error('更新失败，请稍后再试');
    } finally {
      setUpdateLoading(false);
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 pb-20 pt-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">个人中心</h1>
        
        {/* 标签页导航 */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            个人资料
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            我的订单
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            浏览记录
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'favorites'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            我的收藏
          </button>
        </div>

        {/* 个人资料 */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-6">
              <div className="bg-gray-200 rounded-full p-3">
                <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium">{user?.username}</h2>
                <p className="text-sm text-gray-500">{user?.phone}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(updateProfile)}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  className={`input ${errors.username ? 'border-red-500' : ''}`}
                  {...register('username', { required: '请输入用户名' })}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  新密码 (不修改请留空)
                </label>
                <input
                  type="password"
                  className="input"
                  {...register('password')}
                  placeholder="输入新密码"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                      更新中...
                    </>
                  ) : (
                    '更新资料'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn bg-red-600 hover:bg-red-700"
                >
                  退出登录
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 我的订单 */}
        {activeTab === 'orders' && (
          <div>
            {loading ? (
              <div className="text-center py-10">
                <ArrowPathIcon className="animate-spin h-8 w-8 mx-auto text-primary-600" />
                <p className="mt-2 text-gray-500">加载中...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <ClockIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">暂无订单记录</p>
                <Link to="/recycle" className="mt-4 inline-block btn btn-primary">
                  去回收手机
                </Link>
              </div>
            ) : (
              <div>
                {orders.map((order) => (
                  <OrderItem key={order._id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 浏览记录 */}
        {activeTab === 'history' && (
          <div>
            {loading ? (
              <div className="text-center py-10">
                <ArrowPathIcon className="animate-spin h-8 w-8 mx-auto text-primary-600" />
                <p className="mt-2 text-gray-500">加载中...</p>
              </div>
            ) : browsingHistory.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <ClockIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">暂无浏览记录</p>
                <Link to="/" className="mt-4 inline-block btn btn-primary">
                  去浏览手机
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {browsingHistory.map((item) => (
                  <Link
                    key={item._id}
                    to={`/phone/${item.phone._id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 bg-gray-200">
                        {item.phone.images && item.phone.images[0] && (
                          <img
                            src={`${API_BASE_URL}${item.phone.images[0]}`}
                            alt={item.phone.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.phone.title}
                        </h3>
                        <p className="text-sm text-primary-600 font-bold mt-1">
                          ¥{item.phone.price}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 我的收藏 */}
        {activeTab === 'favorites' && (
          <div>
            {loading ? (
              <div className="text-center py-10">
                <ArrowPathIcon className="animate-spin h-8 w-8 mx-auto text-primary-600" />
                <p className="mt-2 text-gray-500">加载中...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <HeartIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">暂无收藏记录</p>
                <Link to="/" className="mt-4 inline-block btn btn-primary">
                  去浏览手机
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((item) => (
                  <Link
                    key={item._id}
                    to={`/phone/${item.phone._id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 bg-gray-200">
                        {item.phone.images && item.phone.images[0] && (
                          <img
                            src={`${API_BASE_URL}${item.phone.images[0]}`}
                            alt={item.phone.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.phone.title}
                        </h3>
                        <p className="text-sm text-primary-600 font-bold mt-1">
                          ¥{item.phone.price}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 