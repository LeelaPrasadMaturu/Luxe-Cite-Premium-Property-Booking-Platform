'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaWifi, FaSwimmingPool, FaParking, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  const { _id, title, description, location, price, images, amenities, rating } = property;

  const amenityIcons = {
    'WiFi': <FaWifi className="text-gray-600" />,
    'Pool': <FaSwimmingPool className="text-gray-600" />,
    'Parking': <FaParking className="text-gray-600" />
  };

  return (
    <Link href={`/properties/${_id}`} passHref>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <FaMapMarkerAlt className="mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-gray-700">{rating || 'New'}</span>
            </div>
            <span className="text-lg font-semibold text-blue-600">${price}/night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard; 