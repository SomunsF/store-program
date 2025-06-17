const multer = require('multer');
const path = require('path');

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 确保上传目录存在
    const uploadPath = path.join(__dirname, '../uploads');
    // 注意：这里的路径是相对于当前文件(middleware)的，所以用'../uploads'
    // fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 检查文件类型
const checkFileType = (file, cb) => {
  // 允许的文件扩展名
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv/;
  // 检查扩展名
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // 检查MIME类型
  const mimetype = /image|video/.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('错误：仅支持图片或视频格式！');
  }
};

// 上传配置
const upload = multer({
  storage,
  limits: { fileSize: 50000000 }, // 50MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload; 