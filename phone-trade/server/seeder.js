const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Phone = require('./models/Phone');
const Order = require('./models/Order');
const BrowsingHistory = require('./models/BrowsingHistory');
const Favorite = require('./models/Favorite');

// 读取JSON数据
const phones = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'phones.json'), 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8')
);

const orders = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'orders.json'), 'utf-8')
);

// 连接到MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/phone-trade')
  .then(() => {
    console.log('MongoDB 连接成功');
  })
  .catch((err) => {
    console.error('MongoDB 连接错误:', err.message);
  });

// 导入数据
const importData = async () => {
  try {
    // 清空数据库
    await User.deleteMany();
    await Phone.deleteMany();
    await Order.deleteMany();
    await BrowsingHistory.deleteMany();
    await Favorite.deleteMany();

    // 导入用户
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} 个用户已导入`);

    // 导入手机商品
    const createdPhones = await Phone.insertMany(phones);
    console.log(`${createdPhones.length} 个手机商品已导入`);

    // 修正订单中的用户ID和手机ID引用
    const sampleOrders = orders.map((order, index) => {
      const updatedOrder = { ...order };
      updatedOrder.user = createdUsers[index % createdUsers.length]._id;
      
      if (order.type === 'purchase') {
        updatedOrder.phone = createdPhones[index % createdPhones.length]._id;
      }
      
      return updatedOrder;
    });

    // 导入订单
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`${createdOrders.length} 个订单已导入`);

    // 创建一些浏览历史
    const browsingHistories = [];
    
    for (let i = 0; i < 10; i++) {
      const user = createdUsers[i % createdUsers.length];
      const phone = createdPhones[i % createdPhones.length];
      
      browsingHistories.push({
        user: user._id,
        phone: phone._id,
        createdAt: new Date()
      });
    }
    
    const createdHistories = await BrowsingHistory.insertMany(browsingHistories);
    console.log(`${createdHistories.length} 条浏览历史已导入`);

    // 创建一些收藏记录
    const favorites = [];
    
    for (let i = 0; i < 5; i++) {
      const user = createdUsers[i % createdUsers.length];
      const phone = createdPhones[i % createdPhones.length];
      
      favorites.push({
        user: user._id,
        phone: phone._id,
        createdAt: new Date()
      });
    }
    
    const createdFavorites = await Favorite.insertMany(favorites);
    console.log(`${createdFavorites.length} 条收藏记录已导入`);

    console.log('数据导入完成');
    process.exit();
  } catch (error) {
    console.error(`数据导入错误: ${error}`);
    process.exit(1);
  }
};

// 清空数据
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Phone.deleteMany();
    await Order.deleteMany();
    await BrowsingHistory.deleteMany();
    await Favorite.deleteMany();

    console.log('数据已清空');
    process.exit();
  } catch (error) {
    console.error(`数据清空错误: ${error}`);
    process.exit(1);
  }
};

// 根据命令行参数决定导入或清空数据
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 