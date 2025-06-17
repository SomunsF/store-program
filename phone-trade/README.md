# Best

这是一个前后端分离的二手手机交易与回收Web应用，包含用户端和管理端两个界面。

## 功能特点

### 用户端功能
- 浏览二手手机商品列表
- 查看手机详情并下单购买
- 提交手机回收申请
- 个人中心管理（订单、浏览历史、收藏）
- 用户注册登录

### 管理端功能
- 数据统计仪表盘
- 用户管理
- 订单管理（回收订单、购买订单）

## 技术栈

### 前端
- React
- TailwindCSS
- React Router
- Axios
- React Hook Form
- React Toastify

### 后端
- Node.js
- Express
- MongoDB
- Mongoose
- JWT认证
- Multer（文件上传）

## 项目结构

```
phone-trade/
├── client/                 # 前端代码
│   ├── public/             # 静态资源
│   └── src/
│       ├── components/     # 公共组件
│       ├── pages/          # 页面组件
│       │   ├── user/       # 用户端页面
│       │   └── admin/      # 管理端页面
│       ├── services/       # API服务
│       └── App.jsx         # 主应用
├── server/                 # 后端代码
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── routes/             # 路由
│   ├── middleware/         # 中间件
│   ├── data/               # 模拟数据
│   ├── uploads/            # 上传文件存储
│   ├── seeder.js           # 数据填充脚本
│   └── server.js           # 服务器入口
└── README.md               # 项目说明
```

## 快速开始

### 安装依赖

```bash
# 安装后端依赖
cd phone-trade/server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 数据库设置

确保已安装并启动MongoDB服务，默认连接到`mongodb://localhost:27017/phone-trade`

### 导入初始数据

```bash
cd ../server
npm run data:import
```

### 启动应用

```bash
# 启动后端服务
cd phone-trade/server
npm run dev

# 启动前端开发服务器
cd ../client
npm start
```

## 账号信息

### 管理员账号
- 手机号: admin
- 密码: admin123

### 测试用户账号
- 手机号: 13800138000
- 密码: 123456

## API接口说明

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 商品相关
- `GET /api/phones` - 获取所有手机商品
- `GET /api/phones/:id` - 获取单个手机商品详情
- `POST /api/phones/:id/favorite` - 添加到收藏
- `DELETE /api/phones/:id/favorite` - 从收藏中移除

### 订单相关
- `POST /api/orders/recycle` - 创建回收订单
- `POST /api/orders/purchase` - 创建购买订单
- `GET /api/orders/my` - 获取用户订单
- `GET /api/orders` - 获取所有订单(管理员)

### 用户相关
- `GET /api/users` - 获取所有用户(管理员)
- `GET /api/users/browsing-history` - 获取浏览历史
- `GET /api/users/favorites` - 获取收藏列表
- `PUT /api/users/profile` - 更新用户资料

## 部署

### 前端构建
```bash
cd phone-trade/client
npm run build
```

### 后端部署
```bash
cd ../server
npm start
```

## 注意事项

- 图片上传保存在`server/uploads`目录
- 默认服务端运行在5000端口，前端开发服务器运行在3000端口
- 确保MongoDB已正确安装并启动 