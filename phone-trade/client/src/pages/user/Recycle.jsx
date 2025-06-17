import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowPathIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import orderService from '../../services/orderService';

const deviceData = {
  苹果: ['iphone 16','iphone 16 pro','iphone 16 pro max','iphone 15','iphone 15 pro','iphone 15 pro max', 'iphone 14', 'iphone 14 pro', 'iphone 14 pro max', 'iphone 13','iphone 13 pro', 'iphone 13 pro max',
     'iphone 12','iphone 12 pro','iphone 12 pro max','iphone 11','iphone 11 pro','iphone 11 pro max','iphone xs','iphone xs max','iphone xr','iphone x']
};

const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const colorOptions = ['黑色', '白色', '金色', '其他，在备注中说明'];

const Recycle = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  
  const initialImageState = { front: null, back: null, top: null, bottom: null, left: null, right: null };
  const [requiredImages, setRequiredImages] = useState(initialImageState);
  const [requiredPreviews, setRequiredPreviews] = useState(initialImageState);
  const [detailImages, setDetailImages] = useState([]);
  const [detailPreviews, setDetailPreviews] = useState([]);

  const [models, setModels] = useState([]);

  const selectedBrand = watch('brand');

  useEffect(() => {
    if (selectedBrand && deviceData[selectedBrand]) {
      setModels(deviceData[selectedBrand]);
    } else {
      setModels([]);
    }
    setValue('model', ''); // Reset model when brand changes
  }, [selectedBrand, setValue]);

  const handleRequiredImageChange = useCallback((e, side) => {
    const file = e.target.files[0];
    if (file) {
      setRequiredImages(prev => ({ ...prev, [side]: file }));
      if (requiredPreviews[side]) {
        URL.revokeObjectURL(requiredPreviews[side]);
      }
      setRequiredPreviews(prev => ({ ...prev, [side]: URL.createObjectURL(file) }));
    }
  }, [requiredPreviews]);

  const removeRequiredImage = useCallback((side) => {
    setRequiredImages(prev => ({ ...prev, [side]: null }));
    if (requiredPreviews[side]) {
      URL.revokeObjectURL(requiredPreviews[side]);
    }
    setRequiredPreviews(prev => ({ ...prev, [side]: null }));
  }, [requiredPreviews]);

  const handleDetailImageChange = useCallback((e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (detailImages.length + filesArray.length > 3) {
        toast.warn('最多只能上传 3 张细节图片。');
        return;
      }
      setDetailImages(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setDetailPreviews(prev => [...prev, ...newPreviews]);
    }
  }, [detailImages.length]);

  const removeDetailImage = useCallback((index) => {
    URL.revokeObjectURL(detailPreviews[index]);
    setDetailImages(prev => prev.filter((_, i) => i !== index));
    setDetailPreviews(prev => prev.filter((_, i) => i !== index));
  }, [detailPreviews]);

  const onSubmit = async (data) => {
    const allRequiredUploaded = Object.values(requiredImages).every(img => img !== null);
    if (!allRequiredUploaded) {
      toast.warn('请上传全部6张必需的设备照片。');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('phoneBrand', data.brand);
      formData.append('phoneModel', data.model);
      formData.append('storage', data.storage);
      formData.append('color', data.color);
      formData.append('phoneCondition', data.condition);
      formData.append('batteryCapacity', data.batteryCapacity);
      formData.append('functionalCondition', data.functionalCondition);
      formData.append('description', data.description);
      
      const filesToUpload = [...Object.values(requiredImages), ...detailImages];
      filesToUpload.forEach(file => {
        if(file) formData.append('images', file);
      });

      await orderService.createRecycleOrder(formData);
      toast.success('回收订单已成功提交！');
      reset();
      
      // Reset image states
      setRequiredImages(initialImageState);
      setRequiredPreviews(initialImageState);
      setDetailImages([]);
      detailPreviews.forEach(url => URL.revokeObjectURL(url));
      setDetailPreviews([]);

      navigate('/profile');
    } catch (error) {
      console.error('提交回收订单失败:', error);
      toast.error(error.response?.data?.message || '提交失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
            设备回收
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            简单几步，轻松完成估价和回收。
          </p>
        </div>

        <div className="max-w-2xl mx-auto pb-24">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    设备品牌
                  </label>
                  <select
                    id="brand"
                    {...register('brand', { required: '请选择设备品牌' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">选择品牌</option>
                    {Object.keys(deviceData).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  {errors.brand && <p className="mt-2 text-sm text-red-600">{errors.brand.message}</p>}
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    设备型号
                  </label>
                  <select
                    id="model"
                    {...register('model', { required: '请选择设备型号' })}
                    disabled={!selectedBrand || models.length === 0}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                  >
                    <option value="">选择型号</option>
                    {models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  {errors.model && <p className="mt-2 text-sm text-red-600">{errors.model.message}</p>}
                </div>
                <div>
                  <label htmlFor="storage" className="block text-sm font-medium text-gray-700">
                    存储容量
                  </label>
                  <select
                    id="storage"
                    {...register('storage', { required: '请选择存储容量' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">选择容量</option>
                    {storageOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.storage && <p className="mt-2 text-sm text-red-600">{errors.storage.message}</p>}
                </div>
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    颜色
                  </label>
                  <select
                    id="color"
                    {...register('color', { required: '请选择颜色' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">选择颜色</option>
                    {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.color && <p className="mt-2 text-sm text-red-600">{errors.color.message}</p>}
                </div>
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    设备成色
                  </label>
                  <select
                    id="condition"
                    {...register('condition', { required: '请选择设备成色' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">选择成色</option>
                    <option value="几乎全新">99新，无任何使用痕迹</option>
                    <option value="良好">95新，有轻微使用痕迹</option>
                    <option value="一般">9新，有明显划痕或磕碰</option>
                    <option value="较差">8新，有严重划痕或磕碰</option>
                  </select>
                  {errors.condition && <p className="mt-2 text-sm text-red-600">{errors.condition.message}</p>}
                </div>
                <div>
                  <label htmlFor="batteryCapacity" className="block text-sm font-medium text-gray-700">
                    电池容量
                  </label>
                  <select
                    id="batteryCapacity"
                    {...register('batteryCapacity', { required: '请选择电池容量' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">选择容量</option>
                    <option value="100%-95%">100%-95%</option>
                    <option value="94%-90%">94%-90%</option>
                    <option value="89%-85%">89%-85%</option>
                    <option value="85%以下">85%以下</option>
                  </select>
                  {errors.batteryCapacity && <p className="mt-2 text-sm text-red-600">{errors.batteryCapacity.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="functionalCondition" className="block text-sm font-medium text-gray-700">
                    一切功能是否正常
                  </label>
                  <select
                    id="functionalCondition"
                    {...register('functionalCondition', { required: '一切功能是否正常' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">请选择</option>
                    <option value="正常">是，功能一切正常</option>
                    <option value="损坏">否，有功能性损坏</option>
                  </select>
                  {errors.functionalCondition && <p className="mt-2 text-sm text-red-600">{errors.functionalCondition.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    其他描述
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="补充描述设备的具体状况，如维修历史、功能损坏位置与程度等。"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">设备照片</h2>
              <p className="text-sm text-gray-500 mt-1">请上传设备的清晰照片。</p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: 'front', label: '正面' }, { key: 'back', label: '背面' }, { key: 'top', label: '顶部' },
                  { key: 'bottom', label: '底部' }, { key: 'left', label: '左侧' }, { key: 'right', label: '右侧' },
                ].map(side => (
                  <ImageUploadSlot
                    key={side.key}
                    label={side.label}
                    preview={requiredPreviews[side.key]}
                    onImageChange={(e) => handleRequiredImageChange(e, side.key)}
                    onImageRemove={() => removeRequiredImage(side.key)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">磕碰划痕细节</h2>
              <p className="text-sm text-gray-500 mt-1">如有，请上传特写照片（最多3张）。</p>
              <div className="mt-4">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="detail-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <PhotoIcon className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">点击上传</span> 或拖拽到此</p>
                    </div>
                    <input id="detail-file-upload" type="file" className="hidden" multiple accept="image/*" onChange={handleDetailImageChange} disabled={detailImages.length >= 3} />
                  </label>
                </div>
                {detailPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-3 gap-4">
                    {detailPreviews.map((src, index) => (
                      <div key={src} className="relative group bg-gray-100 rounded-md">
                        <img src={src} alt={`细节 ${index + 1}`} className="w-full h-24 object-contain rounded-md" />
                        <button type="button" onClick={() => removeDetailImage(index)} className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-3" />
                    正在提交...
                  </>
                ) : (
                  '确认并提交回收订单'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

const ImageUploadSlot = ({ label, preview, onImageChange, onImageRemove }) => (
  <div className="text-center">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative w-full h-32 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
      {preview ? (
        <>
          <img src={preview} alt={label} className="w-full h-full object-contain rounded-lg" />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <PhotoIcon className="w-8 h-8" />
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={onImageChange}
          />
        </>
      )}
    </div>
  </div>
);

export default Recycle;