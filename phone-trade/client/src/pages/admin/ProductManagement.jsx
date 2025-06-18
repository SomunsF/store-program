import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  VideoCameraIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import phoneService from '../../services/phoneService';
import { API_BASE_URL } from '../../config/apiConfig';

const ProductModal = ({ phone, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    price: '',
    originalPrice: '',
    condition: '良好',
    storage: '',
    color: '',
    description: '',
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    if (phone) {
      setFormData({
        title: phone.title || '',
        brand: phone.brand || '',
        model: phone.model || '',
        price: phone.price || '',
        originalPrice: phone.originalPrice || '',
        condition: phone.condition || '良好',
        storage: phone.storage || '',
        color: phone.color || '',
        description: phone.description || '',
      });
      setExistingImages(phone.images || []);
    }
  }, [phone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();

    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });

    existingImages.forEach((image) => {
      submissionData.append('existingImages', image);
    });

    newFiles.forEach((file) => {
      submissionData.append('images', file);
    });

    onSave(submissionData, phone?._id);
  };

  const labelMapping = {
    title: '标题',
    brand: '品牌',
    model: '型号',
    price: '价格',
    originalPrice: '原价',
    condition: '成色',
    storage: '内存',
    color: '颜色',
    description: '描述',
  };

  const renderFilePreview = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) {
      return <VideoCameraIcon className="h-full w-full text-gray-400" />;
    }
    return (
      <img
        src={`${API_BASE_URL}${url}`}
        alt="Preview"
        className="h-full w-full object-cover"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{phone ? '编辑商品' : '添加新商品'}</h3>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.keys(formData).map((key) => (
              <div
                key={key}
                className={key === 'description' || key === 'title' ? 'sm:col-span-2' : ''}
              >
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {labelMapping[key] || key}
                </label>
                {key === 'description' ? (
                  <textarea name={key} value={formData[key]} onChange={handleChange} className="input" />
                ) : key === 'condition' ? (
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="全新">全新</option>
                    <option value="几乎全新">几乎全新</option>
                    <option value="良好">良好</option>
                    <option value="一般">一般</option>
                  </select>
                ) : (
                  <input
                    type={key === 'price' || key === 'originalPrice' ? 'number' : 'text'}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="input"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="sm:col-span-2 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              已有图片/视频
            </label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              {existingImages.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="h-24 w-full rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                    {renderFilePreview(url)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              上传新图片/视频
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                  >
                    <span>上传文件</span>
                    <input
                      id="file-upload"
                      name="images"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                    />
                  </label>
                  <p className="pl-1">或拖拽到此</p>
                </div>
                <p className="text-xs text-gray-500">
                  支持 PNG, JPG, GIF, MP4 等格式
                </p>
              </div>
            </div>
            {newFiles.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                已选择 {newFiles.length} 个新文件。
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);

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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPhone(null);
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await phoneService.updatePhone(id, formData);
        toast.success('商品更新成功');
      } else {
        await phoneService.createPhone(formData);
        toast.success('商品添加成功');
      }
      fetchPhones();
      closeModal();
    } catch (error) {
      toast.error(id ? '更新失败' : '添加失败');
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
                  <div className="h-12 w-12 object-cover rounded bg-gray-100 flex items-center justify-center">
                  {phone.images && phone.images.length > 0 ? (
                      phone.images[0].endsWith('.mp4') ? (
                          <VideoCameraIcon className="h-8 w-8 text-gray-400" />
                      ) : (
                          <img
                              src={`${API_BASE_URL}${phone.images[0]}`}
                              alt={phone.title}
                              className="h-full w-full object-cover rounded"
                          />
                      )
                  ) : <PhotoIcon className="h-8 w-8 text-gray-300" />}
                  </div>
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
        <ProductModal phone={editingPhone} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
};

export default ProductManagement; 