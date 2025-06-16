import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import phoneService from '../../services/phoneService';
import { API_BASE_URL } from '../../config/apiConfig';

const ProductManagement = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const data = await phoneService.getPhones();
      setPhones(data);
    } catch (error) {
      toast.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (phone = null) => {
    setEditingPhone(phone);
    if (phone) {
      reset({
        ...phone,
        images: phone.images.join(', '),
      });
    } else {
      reset({
        title: '',
        brand: '',
        model: '',
        price: '',
        originalPrice: '',
        images: '',
        condition: '良好',
        storage: '',
        color: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPhone(null);
    reset();
  };

  const onSubmit = async (data) => {
    const phoneData = {
      ...data,
      images: data.images.split(',').map((item) => item.trim()),
      price: Number(data.price),
      originalPrice: Number(data.originalPrice) || null,
    };

    try {
      if (editingPhone) {
        await phoneService.updatePhone(editingPhone._id, phoneData);
        toast.success('商品更新成功');
      } else {
        await phoneService.createPhone(phoneData);
        toast.success('商品添加成功');
      }
      fetchPhones();
      closeModal();
    } catch (error) {
      toast.error(editingPhone ? '更新失败' : '添加失败');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个商品吗？')) {
      try {
        await phoneService.deletePhone(id);
        toast.success('商品删除成功');
        fetchPhones();
      } catch (error) {
        toast.error('删除失败');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">商品管理</h2>
          <p className="mt-1 text-sm text-gray-500">
            添加、编辑或删除手机商品
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          添加商品
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {phones.map((phone) => (
            <li key={phone._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={`${API_BASE_URL}${phone.images[0]}`}
                    alt={phone.title}
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {phone.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {phone.brand} - {phone.model}
                    </div>
                    <div className="text-sm text-primary-600 font-bold">
                      ¥{phone.price}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openModal(phone)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(phone._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingPhone ? '编辑商品' : '添加新商品'}
              </h3>
              <button onClick={closeModal}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">标题</label>
                  <input {...register('title', { required: true })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">品牌</label>
                  <input {...register('brand', { required: true })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">型号</label>
                  <input {...register('model', { required: true })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">价格</label>
                  <input type="number" {...register('price', { required: true, valueAsNumber: true })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">原价 (选填)</label>
                  <input type="number" {...register('originalPrice', { valueAsNumber: true })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">存储容量</label>
                  <input {...register('storage', { required: true })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">颜色</label>
                  <input {...register('color', { required: true })} className="input" />
                </div>
                 <div className="sm:col-span-2">
                   <label className="block text-sm font-medium text-gray-700">成色</label>
                   <select {...register('condition', { required: true })} className="input">
                     <option>全新</option>
                     <option>几乎全新</option>
                     <option>良好</option>
                     <option>一般</option>
                   </select>
                 </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">图片URL (用逗号分隔)</label>
                  <textarea {...register('images', { required: true })} className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">描述</label>
                  <textarea {...register('description', { required: true })} className="input" />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 