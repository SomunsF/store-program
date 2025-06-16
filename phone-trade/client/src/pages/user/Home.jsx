import React, { useState, useEffect } from 'react';
import PhoneCard from '../../components/PhoneCard';
import phoneService from '../../services/phoneService';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const data = await phoneService.getPhones();
        setPhones(data);
      } catch (error) {
        console.error('获取手机列表失败:', error);
        setError('获取商品列表失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchPhones();
  }, []);

  // 搜索过滤
  const filteredPhones = phones.filter(
    (phone) =>
      phone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20 pt-4">
      {/* 搜索栏 */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="input pl-10"
          placeholder="搜索手机品牌、型号..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 手机列表 */}
      {filteredPhones.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          没有找到匹配的商品
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhones.map((phone) => (
            <PhoneCard key={phone._id} phone={phone} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 