import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import userService from '../../services/userService';

// 用户编辑模态框
const UserEditModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    phone: user.phone,
    role: user.role,
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          编辑用户
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                用户名
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="input mt-1"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                手机号
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="input mt-1"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                角色
              </label>
              <select
                id="role"
                name="role"
                className="input mt-1"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                新密码
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="input mt-1"
                value={formData.password}
                onChange={handleChange}
                placeholder="留空则不修改密码"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // 处理删除
  const handleDelete = async (userId) => {
    if (window.confirm('确定要删除此用户吗？此操作不可撤销。')) {
      try {
        await userService.deleteUser(userId);
        toast.success('用户已删除');
        fetchUsers(); // 重新加载用户列表
      } catch (error) {
        console.error('删除用户失败:', error);
        toast.error(error.toString());
      }
    }
  };

  // 处理保存
  const handleSave = async (updatedData) => {
    try {
      const dataToUpdate = { ...updatedData };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }

      await userService.updateUser(editingUser._id, dataToUpdate);
      toast.success('用户信息已更新');
      setEditingUser(null);
      fetchUsers(); // 重新加载用户列表
    } catch (error) {
      console.error('更新用户失败:', error);
      toast.error(error.toString());
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 过滤用户
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
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
      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">用户管理</h2>
          <p className="mt-1 text-sm text-gray-500">
            查看和管理平台所有用户信息
          </p>
        </div>
      </div>
      
      {/* 搜索和刷新 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative rounded-md shadow-sm flex-grow">
          <input
            type="text"
            className="input pr-10 w-full"
            placeholder="搜索用户名或手机号..."
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
        <button
          onClick={fetchUsers}
          className="ml-3 btn-secondary p-2"
          aria-label="刷新列表"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {/* 用户列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              没有找到匹配的用户
            </li>
          ) : (
            filteredUsers.map((user) => (
              <li key={user._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">
                        {user.username.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                    <span className="ml-4 text-sm text-gray-500 hidden lg:block">
                      注册于 {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-gray-400 hover:text-primary-600"
                      aria-label="编辑用户"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-gray-400 hover:text-red-600"
                      aria-label="删除用户"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
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

export default UserManagement; 