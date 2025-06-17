const express = require('express');
const router = express.Router();
const {
  createRecycleOrder,
  createPurchaseOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 创建回收订单
router.post('/recycle', protect, upload.array('images', 10), createRecycleOrder);

// 创建购买订单
router.post('/purchase', protect, createPurchaseOrder);

// 获取用户订单
router.get('/my', protect, getMyOrders);

// 获取所有订单 (仅管理员)
router.get('/', protect, admin, getAllOrders);

// 更新订单状态 (仅管理员)
router.put('/:id/status', protect, admin, updateOrderStatus);

// 更新订单 (管理员)
router.put('/:id', protect, admin, updateOrder);

// 删除订单 (管理员)
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router; 