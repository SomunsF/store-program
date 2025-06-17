const Phone = require('../models/Phone');
const BrowsingHistory = require('../models/BrowsingHistory');
const Favorite = require('../models/Favorite');

// @desc    获取所有手机商品
// @route   GET /api/phones
// @access  Public
exports.getPhones = async (req, res) => {
  try {
    const phones = await Phone.find({}).sort({ createdAt: -1 });
    res.json(phones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取单个手机商品详情
// @route   GET /api/phones/:id
// @access  Public
exports.getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);
    
    if (phone) {
      // 如果用户已登录，添加到浏览历史
      if (req.user) {
        await BrowsingHistory.create({
          user: req.user._id,
          phone: phone._id
        });
      }
      
      res.json(phone);
    } else {
      res.status(404).json({ message: '商品不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    添加新手机商品 (仅管理员)
// @route   POST /api/phones
// @access  Private/Admin
exports.createPhone = async (req, res) => {
  try {
    const {
      title,
      brand,
      model,
      price,
      originalPrice,
      condition,
      storage,
      color,
      description
    } = req.body;

    let images = [];
    if (req.files) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const phone = await Phone.create({
      title,
      brand,
      model,
      price,
      originalPrice,
      images,
      condition,
      storage,
      color,
      description
    });

    res.status(201).json(phone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新手机商品 (仅管理员)
// @route   PUT /api/phones/:id
// @access  Private/Admin
exports.updatePhone = async (req, res) => {
  // --- 诊断日志 ---
  console.log('--- 更新商品请求 ---');
  console.log('Request Body:', req.body);
  console.log('Request Files:', req.files);
  console.log('--------------------');
  // --- 结束日志 ---

  try {
    const phone = await Phone.findById(req.params.id);

    if (phone) {
      const {
        title,
        brand,
        model,
        price,
        originalPrice,
        condition,
        storage,
        color,
        description,
        existingImages
      } = req.body;

      let newImages = [];
      if (req.files) {
        newImages = req.files.map(file => `/uploads/${file.filename}`);
      }
      
      let updatedImages = [];
      const existing = typeof existingImages === 'string' ? [existingImages] : existingImages || [];
      updatedImages = [...existing, ...newImages];
      
      phone.title = title || phone.title;
      phone.brand = brand || phone.brand;
      phone.model = model || phone.model;
      phone.price = price ?? phone.price;
      phone.originalPrice = originalPrice ?? phone.originalPrice;
      phone.images = updatedImages;
      phone.condition = condition || phone.condition;
      phone.storage = storage || phone.storage;
      phone.color = color || phone.color;
      phone.description = description || phone.description;

      const updatedPhone = await phone.save();
      res.json(updatedPhone);
    } else {
      res.status(404).json({ message: '商品不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除手机商品 (仅管理员)
// @route   DELETE /api/phones/:id
// @access  Private/Admin
exports.deletePhone = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);

    if (phone) {
      await phone.deleteOne();
      res.json({ message: '商品已删除' });
    } else {
      res.status(404).json({ message: '商品不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    添加到收藏
// @route   POST /api/phones/:id/favorite
// @access  Private
exports.addToFavorite = async (req, res) => {
  try {
    const phoneId = req.params.id;
    const userId = req.user._id;

    // 检查手机是否存在
    const phone = await Phone.findById(phoneId);
    if (!phone) {
      return res.status(404).json({ message: '商品不存在' });
    }

    // 检查是否已收藏
    const existingFavorite = await Favorite.findOne({
      user: userId,
      phone: phoneId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: '商品已在收藏列表中' });
    }

    // 添加到收藏
    const favorite = await Favorite.create({
      user: userId,
      phone: phoneId
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    从收藏中移除
// @route   DELETE /api/phones/:id/favorite
// @access  Private
exports.removeFromFavorite = async (req, res) => {
  try {
    const phoneId = req.params.id;
    const userId = req.user._id;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      phone: phoneId
    });

    if (favorite) {
      res.json({ message: '已从收藏中移除' });
    } else {
      res.status(404).json({ message: '收藏记录不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 