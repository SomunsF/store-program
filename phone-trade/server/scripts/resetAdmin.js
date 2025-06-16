/**
 * 管理员账号重置脚本
 * 用法: node scripts/resetAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// 管理员账号信息
const adminPhone = 'admin';
const adminPassword = 'admin123';
const adminUsername = '管理员';

// 连接数据库
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/phone-trade')
  .then(async () => {
    console.log('MongoDB 连接成功');
    
    try {
      // 生成密码哈希
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      console.log('生成的密码哈希:', hashedPassword);
      
      // 直接使用MongoDB操作，完全绕过Mongoose中间件
      const result = await mongoose.connection.db.collection('users').updateOne(
        { phone: adminPhone },
        { 
          $set: { 
            password: hashedPassword,
            username: adminUsername,
            role: 'admin'
          },
          $setOnInsert: {
            phone: adminPhone,
            createdAt: new Date()
          }
        },
        { upsert: true } // 如果不存在则创建
      );
      
      if (result.matchedCount > 0) {
        console.log('管理员密码已直接更新');
      } else if (result.upsertedCount > 0) {
        console.log('管理员账号已直接创建');
      }
      
      // 验证更新是否成功
      const adminUser = await User.findOne({ phone: adminPhone }).select('+password');
      console.log('管理员账号信息:');
      console.log(`  手机号: ${adminUser.phone}`);
      console.log(`  密码哈希: ${adminUser.password}`);
      console.log(`  用户名: ${adminUser.username}`);
      console.log(`  角色: ${adminUser.role}`);
      
      // 验证密码匹配
      console.log('验证密码匹配:');
      try {
        const isMatch = await bcrypt.compare(adminPassword, adminUser.password);
        console.log(`  密码 '${adminPassword}' 匹配结果: ${isMatch ? '成功' : '失败'}`);
      } catch (error) {
        console.error('  密码验证失败:', error);
      }
      
      // 断开连接
      mongoose.disconnect();
      console.log('数据库连接已关闭');
    } catch (error) {
      console.error('重置管理员账号时出错:', error);
      mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.error('MongoDB 连接错误:', err.message);
  }); 