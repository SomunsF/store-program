import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';
import { PhotoIcon } from '@heroicons/react/24/outline';

const PhoneCard = ({ phone }) => {
  const imageUrl = phone.images && phone.images.length > 0 ? `${API_BASE_URL}${phone.images[0]}` : null;

  return (
    <div className="group block border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={`/phone/${phone._id}`}>
        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={phone.title}
              className="w-full h-full object-center object-cover group-hover:opacity-75"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <PhotoIcon className="h-8 w-8 text-gray-300" aria-hidden="true" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          <Link to={`/phone/${phone._id}`} className="hover:underline">
            {phone.title}
          </Link>
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
  );
};

export default PhoneCard; 