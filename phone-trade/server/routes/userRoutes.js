const express = require('express');
const router = express.Router();
const {
  getUsers,
  getBrowsingHistory,
  getFavorites,
  updateUserProfile,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// 获取所有用户 (仅管理员)
router.get('/', protect, admin, getUsers);

// 获取用户浏览历史
router.get('/browsing-history', protect, getBrowsingHistory);

// 获取用户收藏列表
router.get('/favorites', protect, getFavorites);

// 更新用户资料
router.put('/profile', protect, updateUserProfile);

// 更新用户 (仅管理员)
router.put('/:id', protect, admin, updateUser);

// 删除用户 (仅管理员)
router.delete('/:id', protect, admin, deleteUser);

module.exports = router; 