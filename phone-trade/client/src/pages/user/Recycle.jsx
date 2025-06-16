import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowPathIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import orderService from '../../services/orderService';

const Recycle = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // 处理图片上传
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // 限制最多上传5张图片
      if (images.length + filesArray.length > 5) {
        toast.warning('最多上传5张图片');
        return;
      }
      
      // 更新图片状态
      setImages([...images, ...filesArray]);
      
      // 创建预览URL
      const newPreviewImages = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviewImages]);
    }
  };

  // 移除图片
  const removeImage = (index) => {
    // 释放预览URL
    URL.revokeObjectURL(previewImages[index]);
    
    // 更新状态
    setImages(images.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  // 提交表单
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.warning('请至少上传一张手机图片');
      return;
    }

    try {
      setLoading(true);
      
      // 创建FormData对象
      const formData = new FormData();
      formData.append('phoneBrand', data.brand);
      formData.append('phoneModel', data.model);
      formData.append('phoneCondition', data.condition);
      formData.append('description', data.description);
      
      // 添加图片
      images.forEach(file => {
        formData.append('images', file);
      });
      
      // 提交表单
      await orderService.createRecycleOrder(formData);
      
      toast.success('回收订单提交成功');
      reset();
      setImages([]);
      setPreviewImages([]);
      navigate('/profile');
    } catch (error) {
      console.error('提交回收订单失败:', error);
      toast.error('提交失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20 pt-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">手机回收</h1>

        {/* 回收流程 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">回收流程</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>填写手机信息并上传照片</li>
            <li>提交回收申请</li>
            <li>客服人员会在24小时内联系您</li>
            <li>上门验机或邮寄至回收中心</li>
            <li>验机通过后支付回收款</li>
          </ol>
        </div>

        {/* 回收表单 */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              手机品牌 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`input ${errors.brand ? 'border-red-500' : ''}`}
              {...register('brand', { required: '请输入手机品牌' })}
              placeholder="如: Apple, 小米, 华为等"
            />
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              手机型号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`input ${errors.model ? 'border-red-500' : ''}`}
              {...register('model', { required: '请输入手机型号' })}
              placeholder="如: iPhone 13, 小米12, P40等"
            />
            {errors.model && (
              <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              手机成色 <span className="text-red-500">*</span>
            </label>
            <select
              className={`input ${errors.condition ? 'border-red-500' : ''}`}
              {...register('condition', { required: '请选择手机成色' })}
            >
              <option value="">请选择</option>
              <option value="全新">全新</option>
              <option value="几乎全新">几乎全新</option>
              <option value="良好">良好</option>
              <option value="一般">一般</option>
            </select>
            {errors.condition && (
              <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              其他描述
            </label>
            <textarea
              className="input h-24"
              {...register('description')}
              placeholder="请描述手机的使用年限、电池状态、是否有明显磕碰等情况..."
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              上传手机照片 <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-2">(最多5张)</span>
            </label>
            
            {/* 图片预览 */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`手机图片 ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                    >
                      <XMarkIcon className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* 上传按钮 */}
            {images.length < 5 && (
              <div className="mt-2">
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-primary-500">
                  <CameraIcon className="h-6 w-6 mx-auto text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-500">点击上传图片</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full btn btn-primary py-3 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                  提交中...
                </>
              ) : (
                '提交回收订单'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recycle;