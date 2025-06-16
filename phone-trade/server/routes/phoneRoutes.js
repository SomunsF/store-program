const express = require('express');
const router = express.Router();
const {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
  addToFavorite,
  removeFromFavorite
} = require('../controllers/phoneController');
const { protect, admin } = require('../middleware/authMiddleware');

// 获取所有手机商品
router.route('/').get(getPhones).post(protect, admin, createPhone);

// 对单个手机商品的操作
router
  .route('/:id')
  .get(getPhoneById)
  .put(protect, admin, updatePhone)
  .delete(protect, admin, deletePhone);

// 收藏相关
router.post('/:id/favorite', protect, addToFavorite);
router.delete('/:id/favorite', protect, removeFromFavorite);

module.exports = router; 