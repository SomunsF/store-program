const User = require('../models/User');
const BrowsingHistory = require('../models/BrowsingHistory');
const Favorite = require('../models/Favorite');

// @desc    获取所有用户 (仅管理员)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取用户浏览历史
// @route   GET /api/users/browsing-history
// @access  Private
exports.getBrowsingHistory = async (req, res) => {
  try {
    const history = await BrowsingHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('phone', 'title brand model price images')
      .limit(10);
    
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取用户收藏列表
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('phone', 'title brand model price images');
    
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新用户资料
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.username = req.body.username || user.username;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        phone: updatedUser.phone,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新用户 (仅管理员)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.phone = req.body.phone || user.phone;
      user.role = req.body.role || user.role;
      
      // 如果请求中包含新密码，则更新密码
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        phone: updatedUser.phone,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除用户 (仅管理员)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // 防止删除唯一的管理员
      if (user.role === 'admin' && (await User.countDocuments({ role: 'admin' })) === 1) {
        return res.status(400).json({ message: '不能删除唯一的管理员账户' });
      }
      
      // 使用 findByIdAndDelete 替换 user.remove()
      await User.findByIdAndDelete(req.params.id);

      res.json({ message: '用户已删除' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 