import React from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, ArrowPathIcon, UserIcon } from '@heroicons/react/24/outline';

const UserLayout = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    {
      name: '首页',
      path: '/',
      icon: HomeIcon
    },
    {
      name: '回收',
      path: '/recycle',
      icon: ArrowPathIcon
    },
    {
      name: '我的',
      path: '/profile',
      icon: UserIcon
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            
          </Link>
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              管理后台
            </Link>
          )}
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 底部导航 */}
      <nav className="bg-white shadow-t border-t border-gray-200 fixed bottom-0 w-full">
        <div className="max-w-md mx-auto px-4 flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                />
                <span className="text-xs mt-1">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default UserLayout; 