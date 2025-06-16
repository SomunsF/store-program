const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// 注册用户
router.post('/register', registerUser);

// 用户登录
router.post('/login', loginUser);

// 获取用户信息
router.get('/me', protect, getUserProfile);

module.exports = router; 