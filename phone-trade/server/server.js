const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 导入路由
const authRoutes = require('./routes/authRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// 初始化 Express
const app = express();

// 中间件
app.use(express.json());
app.use(cors());

// 创建上传目录
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 静态文件目录
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 连接到 MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/phone-trade')
  .then(() => {
    console.log('MongoDB 连接成功');
  })
  .catch((err) => {
    console.error('MongoDB 连接错误:', err.message);
  });

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

// 初始化管理员账户
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const initAdmin = async () => {
  try {
    const adminExists = await User.findOne({ phone: 'admin' });
    
    if (!adminExists) {
      // 手动加密密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // 创建管理员用户并禁用自动加密
      const admin = new User({
        phone: 'admin',
        password: hashedPassword,
        username: '管理员',
        role: 'admin'
      });
      
      // 保存并跳过中间件
      await admin.save();
      console.log('管理员账户创建成功');
    }
  } catch (error) {
    console.error('管理员账户创建失败:', error);
  }
};

// 端口
const PORT = process.env.PORT || 5000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  initAdmin();
}); 