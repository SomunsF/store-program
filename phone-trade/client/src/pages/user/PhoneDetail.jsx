import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HeartIcon as HeartOutline, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  // 记录浏览历史 (用户登录时)
  useEffect(() => {
    if (user && id) {
      userService.addBrowsingHistory(id);
    }
  }, [user, id]);

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

  const imagesForLightbox = phone.images.map(img => ({
    src: `${API_BASE_URL}${img}`
  }));

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg"
          >
            <ChevronLeftIcon className="h-5 w-5 -ml-1" />
            <span className="ml-1 text-sm font-medium">返回首页</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-8">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div 
              className="relative bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={`${API_BASE_URL}${phone.images[activeImage]}`}
                alt={phone.title}
                className="w-full h-auto object-contain aspect-square rounded-lg"
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
              >
                {favorite ? (
                  <HeartSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutline className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
            {phone.images.length > 1 && (
              <div className="flex overflow-x-auto gap-3">
                {phone.images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md cursor-pointer border-2 transition-colors ${
                      activeImage === index
                        ? 'border-primary-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={`${API_BASE_URL}${image}`}
                      alt={`${phone.title} - 图片 ${index + 1}`}
                      className="w-full h-full object-contain rounded-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{phone.title}</h1>
            
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-800">
                ¥{phone.price}
              </span>
              {phone.originalPrice && (
                <span className="ml-3 text-base text-gray-400 line-through">
                  ¥{phone.originalPrice}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="ml-4 text-sm bg-blue-100 text-primary-700 px-2 py-1 rounded-md font-medium">
                  省 {discountPercent}%
                </span>
              )}
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-medium text-gray-900">规格</h2>
              <div className="mt-4 space-y-3 text-gray-600">
                <div className="flex">
                  <span className="w-20 text-gray-500">品牌</span>
                  <span className="font-medium text-gray-800">{phone.brand}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-500">型号</span>
                  <span className="font-medium text-gray-800">{phone.model}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-500">存储</span>
                  <span className="font-medium text-gray-800">{phone.storage}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-500">颜色</span>
                  <span className="font-medium text-gray-800">{phone.color}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-500">成色</span>
                  <span className="font-medium text-gray-800">{phone.condition}</span>
                </div>
              </div>
            </div>
            
            {phone.description && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-lg font-medium text-gray-900">商品描述</h2>
                <p className="mt-4 text-gray-600 whitespace-pre-line leading-relaxed">
                  {phone.description}
                </p>
              </div>
            )}

            <div className="mt-10 flex-grow flex items-end">
              <button
                onClick={handlePurchase}
                className="w-full max-w-xs btn btn-primary py-3 text-base font-semibold text-center rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                立即下单
              </button>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={imagesForLightbox}
        index={activeImage}
      />
    </>
  );
};

export default PhoneDetail; 