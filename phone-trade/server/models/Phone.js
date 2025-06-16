const mongoose = require('mongoose');

const PhoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  images: {
    type: [String],
    required: true
  },
  condition: {
    type: String,
    enum: ['全新', '几乎全新', '良好', '一般'],
    default: '良好'
  },
  storage: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Phone', PhoneSchema); 