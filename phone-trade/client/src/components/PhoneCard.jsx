import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

const PhoneCard = ({ phone }) => {
  // 价格折扣百分比
  const discountPercent = phone.originalPrice
    ? Math.round(((phone.originalPrice - phone.price) / phone.originalPrice) * 100)
    : null;

  return (
    <Link to={`/phone/${phone._id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-300">
        <div className="relative pb-[75%] overflow-hidden">
          <img
            src={`${API_BASE_URL}${phone.images[0]}`}
            alt={phone.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {discountPercent && discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercent}% OFF
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <span className="inline-block px-2 py-1 text-xs text-white bg-primary-600 rounded">
              {phone.condition}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {phone.title}
          </h3>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <p className="text-lg font-bold text-primary-600">¥{phone.price}</p>
              {phone.originalPrice && (
                <p className="text-xs text-gray-500 line-through">
                  ¥{phone.originalPrice}
                </p>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {phone.brand} · {phone.storage}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PhoneCard; 