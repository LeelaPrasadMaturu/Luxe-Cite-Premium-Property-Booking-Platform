'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { updateFilters } from '@/store/slices/propertySlice';
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';

export default function SearchForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    // Validate dates
    if (searchParams.checkIn && searchParams.checkOut) {
      const checkInDate = new Date(searchParams.checkIn);
      const checkOutDate = new Date(searchParams.checkOut);
      
      if (checkOutDate <= checkInDate) {
        setError('Check-out date must be after check-in date');
        return;
      }
    }

    // Create URL parameters
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    // Update Redux store with search parameters
    dispatch(updateFilters({
      location: searchParams.location,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      guests: searchParams.guests,
      priceRange: [0, 1500], // Default price range
      rating: 0, // Default rating
      amenities: [], // Default amenities
      specialOffers: false // Default special offers
    }));

    // Navigate to properties page with search parameters
    router.push(`/properties?${params.toString()}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user changes dates
    if (name === 'checkIn' || name === 'checkOut') {
      setError('');
    }
  };

  const inputBaseClasses = "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white";

  return (
    <form onSubmit={handleSearch} className="search-form w-full max-w-4xl rounded-lg shadow-xl p-8 bg-white/80 backdrop-blur-sm">
      <p className="text-gray-900 text-center mb-6 text-lg font-medium">Find your next unforgettable escape</p>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleInputChange}
            placeholder="Where are you going?"
            className={inputBaseClasses}
          />
        </div>

        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            name="checkIn"
            value={searchParams.checkIn}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className={inputBaseClasses}
          />
        </div>

        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            name="checkOut"
            value={searchParams.checkOut}
            onChange={handleInputChange}
            min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
            className={inputBaseClasses}
          />
        </div>

        <div className="relative">
          <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            name="guests"
            value={searchParams.guests}
            onChange={handleInputChange}
            min="1"
            max="10"
            className={inputBaseClasses}
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 mx-auto"
        >
          <FiSearch className="w-5 h-5" />
          <span>Search Properties</span>
        </button>
      </div>
    </form>
  );
}
