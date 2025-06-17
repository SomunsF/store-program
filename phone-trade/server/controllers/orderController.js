const Order = require('../models/Order');
const Phone = require('../models/Phone');
const path = require('path');
const fs = require('fs');

// @desc    创建回收订单
// @route   POST /api/orders/recycle
// @access  Private
exports.createRecycleOrder = async (req, res) => {
  try {
    const {
      phoneBrand,
      phoneModel,
      storage,
      color,
      phoneCondition,
      batteryCapacity,
      functionalCondition,
      description,
    } = req.body;

    // 处理上传的图片
    const phoneImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        phoneImages.push(`/uploads/${file.filename}`);
      });
    }

    const order = await Order.create({
      user: req.user._id,
      type: 'recycle',
      phoneBrand,
      phoneModel,
      storage,
      color,
      phoneCondition,
      batteryCapacity,
      functionalCondition,
      phoneImages,
      description,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    创建购买订单
// @route   POST /api/orders/purchase
// @access  Private
exports.createPurchaseOrder = async (req, res) => {
  try {
    const { phoneId } = req.body;

    // 检查手机是否存在
    const phone = await Phone.findById(phoneId);
    if (!phone) {
      return res.status(404).json({ message: '商品不存在' });
    }

    const order = await Order.create({
      user: req.user._id,
      type: 'purchase',
      phone: phoneId
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取用户所有订单
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('phone', 'title images price');
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取所有订单 (仅管理员)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'username phone')
      .populate('phone', 'title images price');
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新订单状态 (仅管理员)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: '订单不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新订单 (仅管理员)
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // 从请求体中获取所有字段
      const { status, estimatedPrice } = req.body;
      
      order.status = status ?? order.status;
      order.estimatedPrice = estimatedPrice ?? order.estimatedPrice;
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: '订单不存在' });
    }
  } catch (error) {
    console.error('更新订单时出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除订单 (仅管理员)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: '订单已删除' });
    } else {
      res.status(404).json({ message: '订单不存在' });
    }
  } catch (error) {
    console.error('删除订单时出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 