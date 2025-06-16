import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// 用户页面
import UserLayout from './components/layouts/UserLayout';
import Home from './pages/user/Home';
import Recycle from './pages/user/Recycle';
import Profile from './pages/user/Profile';
import PhoneDetail from './pages/user/PhoneDetail';
import Login from './pages/user/Login';
import Register from './pages/user/Register';

// 管理员页面
import AdminLayout from './components/layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ProductManagement from './pages/admin/ProductManagement';

// 服务和工具
import authService from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中是否有令牌
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(data => {
          setUser(data);
        })
        .catch(error => {
          console.error('获取用户信息失败:', error);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    toast.success('登录成功');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    toast.info('已退出登录');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  return (
    <Routes>
      {/* 用户端路由 */}
      <Route path="/" element={<UserLayout user={user} onLogout={handleLogout} />}>
        <Route index element={<Home />} />
        <Route path="phone/:id" element={<PhoneDetail user={user} />} />
        <Route path="recycle" element={user ? <Recycle /> : <Navigate to="/login" />} />
        <Route path="profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
      </Route>

      {/* 认证路由 */}
      <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />

      {/* 管理员路由 */}
      <Route
        path="/admin"
        element={
          user && user.role === 'admin' ? (
            <AdminLayout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="products" element={<ProductManagement />} />
      </Route>

      {/* 404 路由 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App; 