import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: '控制台', href: '/admin', icon: ChartBarIcon },
    { name: '用户管理', href: '/admin/users', icon: UsersIcon },
    { name: '订单管理', href: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: '商品管理', href: '/admin/products', icon: DevicePhoneMobileIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 移动侧边栏 */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 bottom-0 flex flex-col w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          <span className="text-xl font-semibold text-gray-800">管理后台</span>
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon
                    className="mr-3 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.username || '管理员'}</p>
              <div className="flex mt-2">
                <Link
                  to="/"
                  className="text-xs text-gray-500 hover:text-gray-700 mr-3"
                >
                  返回前台
                </Link>
                <button
                  onClick={onLogout}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 静态侧边栏（桌面设备） */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64">
        {/* 侧边栏内容（与移动版相同） */}
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
            <span className="text-xl font-semibold text-gray-800">管理后台</span>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon
                      className="mr-3 flex-shrink-0 h-6 w-6"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">{user?.username || '管理员'}</p>
                <div className="flex mt-2">
                  <Link
                    to="/"
                    className="text-xs text-gray-500 hover:text-gray-700 mr-3"
                  >
                    返回前台
                  </Link>
                  <button
                    onClick={onLogout}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="md:pl-64">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white shadow-sm px-4 py-4 md:px-6">
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 md:flex md:justify-between md:items-center">
            <h1 className="text-xl font-semibold text-gray-900 ml-3 md:ml-0">
              {
                navigation.find(
                  (item) => item.href === window.location.pathname
                )?.name || '控制台'
              }
            </h1>
          </div>
        </div>
        <main className="py-6 px-4 sm:px-6 md:py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 