// 根据环境动态设置API基础URL
const getApiBaseUrl = () => {
  // 如果是生产环境使用当前域名和端口
  if (process.env.NODE_ENV === 'production') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5000`; // 如果API在相同域名但不同端口
    // 或者直接使用: return `${protocol}//${hostname}`; // 如果API与前端在同一域名和端口
  }
  // 开发环境使用localhost
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl(); 