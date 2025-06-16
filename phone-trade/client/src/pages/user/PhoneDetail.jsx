import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import phoneService from '../../services/phoneService';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import { API_BASE_URL } from '../../config/apiConfig';

const PhoneDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // 获取手机详情
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const data = await phoneService.getPhoneById(id);
        setPhone(data);
      } catch (error) {
        console.error('获取手机详情失败:', error);
        setError('获取商品详情失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchPhone();
  }, [id]);

  // 获取收藏状态
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          const data = await userService.getFavorites();
          setFavorites(data);
          const isFavorite = data.some((fav) => fav.phone._id === id);
          setFavorite(isFavorite);
        } catch (error) {
          console.error('获取收藏状态失败:', error);
        }
      };

      fetchFavorites();
    }
  }, [user, id]);

  // 切换收藏状态
  const toggleFavorite = async () => {
    if (!user) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }

    try {
      if (favorite) {
        await phoneService.removeFromFavorite(id);
        toast.success('已从收藏中移除');
      } else {
        await phoneService.addToFavorite(id);
        toast.success('已添加到收藏');
      }
      setFavorite(!favorite);
    } catch (error) {
      console.error('操作收藏失败:', error);
      toast.error('操作失败，请稍后再试');
    }
  };

  // 处理下单
  const handlePurchase = async () => {
    if (!user) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }

    try {
      // 复制商品标题到剪贴板
      await navigator.clipboard.writeText(phone.title);
      toast.success('已复制商品标题');
      
      // 创建购买订单
      await orderService.createPurchaseOrder(id);
      
      // 跳转到微信
      window.location.href = 'https://weixin.qq.com/';
    } catch (error) {
      console.error('下单失败:', error);
      toast.error('下单失败，请稍后再试');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !phone) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error || '商品不存在'}
      </div>
    );
  }

  // 折扣计算
  const discountPercent = phone.originalPrice
    ? Math.round(
        ((phone.originalPrice - phone.price) / phone.originalPrice) * 100
      )
    : null;

  return (
    <div className="container mx-auto px-4 pb-24 pt-4">
      <div className="mb-4">
        <Link to="/" className="text-primary-600 hover:underline">
          &larr; 返回首页
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 商品图片 */}
        <div className="relative">
          <img
            src={`${API_BASE_URL}${phone.images[activeImage]}`}
            alt={phone.title}
            className="w-full h-64 object-cover sm:h-96"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
          >
            {favorite ? (
              <HeartSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartOutline className="h-6 w-6 text-gray-500" />
            )}
          </button>
        </div>

        {/* 缩略图 */}
        {phone.images.length > 1 && (
          <div className="flex overflow-x-auto p-2 gap-2">
            {phone.images.map((image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-16 h-16 border-2 rounded cursor-pointer ${
                  activeImage === index
                    ? 'border-primary-500'
                    : 'border-transparent'
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={`${API_BASE_URL}${image}`}
                  alt={`${phone.title} - 图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* 商品信息 */}
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900">{phone.title}</h1>
          
          <div className="mt-4 flex items-baseline">
            <span className="text-2xl font-bold text-primary-600">
              ¥{phone.price}
            </span>
            {phone.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ¥{phone.originalPrice}
              </span>
            )}
            {discountPercent && discountPercent > 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                省 {discountPercent}%
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">品牌：</span>
              <span className="font-medium">{phone.brand}</span>
            </div>
            <div>
              <span className="text-gray-500">型号：</span>
              <span className="font-medium">{phone.model}</span>
            </div>
            <div>
              <span className="text-gray-500">存储：</span>
              <span className="font-medium">{phone.storage}</span>
            </div>
            <div>
              <span className="text-gray-500">颜色：</span>
              <span className="font-medium">{phone.color}</span>
            </div>
            <div>
              <span className="text-gray-500">成色：</span>
              <span className="font-medium">{phone.condition}</span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">商品描述</h2>
            <p className="mt-2 text-gray-600 whitespace-pre-line">
              {phone.description}
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handlePurchase}
              className="w-full btn btn-primary py-3 text-center"
            >
              立即下单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail; 