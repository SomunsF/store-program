const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 生成JWT令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'phonetrade123', {
    expiresIn: '30d'
  });
};

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { phone, password, username } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: '该手机号已注册' });
    }

    // 创建用户
    const user = await User.create({
      phone,
      password,
      username: username || '用户'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        phone: user.phone,
        username: user.username,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: '无效的用户数据' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log(`尝试登录: 手机号=${phone}, 密码=${password}`);

    // 管理员特殊处理 - 硬编码管理员账号密码验证
    if (phone === 'admin' && password === 'admin123') {
      console.log('使用管理员特殊验证逻辑');
      
      // 获取管理员用户
      const adminUser = await User.findOne({ phone: 'admin' });
      
      if (adminUser) {
        console.log('找到管理员账号，绕过密码验证');
        res.json({
          _id: adminUser._id,
          phone: adminUser.phone,
          username: adminUser.username,
          role: adminUser.role,
          token: generateToken(adminUser._id)
        });
        return;
      }
    }

    // 普通用户验证逻辑
    // 查找用户
    const user = await User.findOne({ phone });
    console.log('查找用户结果:', user ? `找到用户ID=${user._id}` : '未找到用户');

    if (user) {
      const isMatch = await user.matchPassword(password);
      console.log('密码匹配结果:', isMatch ? '密码正确' : '密码错误');
      
      if (isMatch) {
        res.json({
          _id: user._id,
          phone: user.phone,
          username: user.username,
          role: user.role,
          token: generateToken(user._id)
        });
        return;
      }
    }
    
    res.status(401).json({ message: '手机号或密码不正确' });
  } catch (error) {
    console.error('登录过程中发生错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取当前用户信息
// @route   GET /api/auth/me
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 