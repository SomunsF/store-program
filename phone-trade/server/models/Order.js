const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'recycle'],
    required: true
  },
  // 回收订单字段
  phoneBrand: {
    type: String
  },
  phoneModel: {
    type: String
  },
  phoneCondition: {
    type: String,
    enum: ['全新', '几乎全新', '良好', '一般']
  },
  phoneImages: {
    type: [String]
  },
  description: {
    type: String
  },
  // 购买订单字段
  phone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phone'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema); 