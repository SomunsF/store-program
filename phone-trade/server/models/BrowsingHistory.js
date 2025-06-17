const mongoose = require('mongoose');

const BrowsingHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phone',
    required: true
  }
}, {
  timestamps: true // 告诉 Mongoose 自动管理 createdAt 和 updatedAt
});

// 添加复合唯一索引，确保一个用户对一个商品只有一条浏览记录
BrowsingHistorySchema.index({ user: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('BrowsingHistory', BrowsingHistorySchema); 