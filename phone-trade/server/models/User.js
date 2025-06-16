const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 密码加密
UserSchema.pre('save', async function(next) {
  // 如果密码没有修改，则跳过
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // 生成盐值
    const salt = await bcrypt.genSalt(10);
    // 使用盐值对密码进行加密
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 校验密码
UserSchema.methods.matchPassword = async function(enteredPassword) {
  // 打印调试信息
  console.log(`正在比较密码: 输入=${enteredPassword}, 存储的哈希=${this.password.substring(0, 10)}...`);
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log(`密码比较结果: ${isMatch ? '匹配成功' : '匹配失败'}`);
    return isMatch;
  } catch (error) {
    console.error('密码比较出错:', error);
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema); 