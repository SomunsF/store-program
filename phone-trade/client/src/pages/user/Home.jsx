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
      <div className="text-center py-20 text-gray-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
          每一部，都是放心之选
          </h1>
          
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm leading-5 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="搜索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product List */}
        <div className="pb-24">
          
          {filteredPhones.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>没有找到匹配的商品。</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8 lg:gap-y-10">
              {filteredPhones.map((phone) => (
                <PhoneCard key={phone._id} phone={phone} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home; 