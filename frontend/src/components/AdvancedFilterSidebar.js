'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters, clearFilters } from '@/store/slices/propertySlice';
import { FaStar, FaWifi, FaSwimmingPool, FaDumbbell, FaSpa, FaUtensils, FaParking, FaSnowflake, FaHotTub, FaTv } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const amenities = [
  { id: 'wifi', label: 'WiFi', icon: FaWifi },
  { id: 'pool', label: 'Swimming Pool', icon: FaSwimmingPool },
  { id: 'gym', label: 'Fitness Center', icon: FaDumbbell },
  { id: 'spa', label: 'Spa', icon: FaSpa },
  { id: 'restaurant', label: 'Restaurant', icon: FaUtensils },
  { id: 'parking', label: 'Parking', icon: FaParking },
  { id: 'ac', label: 'Air Conditioning', icon: FaSnowflake },
  { id: 'hotTub', label: 'Hot Tub', icon: FaHotTub },
  { id: 'tv', label: 'TV', icon: FaTv },
];

export default function AdvancedFilterSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.properties.filters);
  const [localFilters, setLocalFilters] = useState({
    location: filters.location || '',
    checkIn: filters.checkIn || '',
    checkOut: filters.checkOut || '',
    guests: filters.guests || 1,
    priceRange: filters.priceRange || [0, 1500],
    rating: filters.rating || 0,
    amenities: filters.amenities || [],
    specialOffers: filters.specialOffers || false,
  });

  const [mapLocation, setMapLocation] = useState(null);

  // Update local filters when redux filters change
  useEffect(() => {
    setLocalFilters({
      location: filters.location || '',
      checkIn: filters.checkIn || '',
      checkOut: filters.checkOut || '',
      guests: filters.guests || 1,
      priceRange: filters.priceRange || [0, 1500],
      rating: filters.rating || 0,
      amenities: filters.amenities || [],
      specialOffers: filters.specialOffers || false,
    });
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    // Validate dates if both are present
    if (localFilters.checkIn && localFilters.checkOut) {
      const checkInDate = new Date(localFilters.checkIn);
      const checkOutDate = new Date(localFilters.checkOut);
      
      if (checkOutDate <= checkInDate) {
        alert('Check-out date must be after check-in date');
        return;
      }
    }

    // Update Redux store with filters
    dispatch(updateFilters(localFilters));
    
    // Close the sidebar
    onClose();
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      priceRange: [0, 1500],
      rating: 0,
      amenities: [],
      specialOffers: false,
    };

    // Update local state
    setLocalFilters(defaultFilters);
    
    // Update Redux store
    dispatch(clearFilters());
    
    // Close the sidebar
    onClose();
  };

  const handlePriceRangeChange = (value) => {
    handleFilterChange('priceRange', value);
  };

  const handleRatingChange = (rating) => {
    handleFilterChange('rating', rating);
  };

  const handleAmenityToggle = (amenityId) => {
    const currentAmenities = localFilters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    handleFilterChange('amenities', newAmenities);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-96 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-50 overflow-y-auto`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Advanced Filters
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Location with Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={localFilters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Enter city or region"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <MdLocationOn className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Check-in
              </label>
              <input
                type="date"
                value={localFilters.checkIn || ''}
                onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Check-out
              </label>
              <input
                type="date"
                value={localFilters.checkOut || ''}
                onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              value={localFilters.guests || 1}
              onChange={(e) => handleFilterChange('guests', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* Price Range Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range (${localFilters.priceRange[0]} - ${localFilters.priceRange[1]})
            </label>
            <div className="px-2">
              <Slider
                range
                min={0}
                max={1500}
                value={localFilters.priceRange}
                onChange={handlePriceRangeChange}
                className="mt-4"
                railStyle={{ backgroundColor: '#E5E7EB' }}
                trackStyle={[{ backgroundColor: '#2563EB' }]}
                handleStyle={[
                  { backgroundColor: '#2563EB', borderColor: '#2563EB' },
                  { backgroundColor: '#2563EB', borderColor: '#2563EB' }
                ]}
              />
            </div>
          </div>

          {/* Guest Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Guest Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`focus:outline-none ${
                    star <= localFilters.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <FaStar className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-3">
              {amenities.map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.amenities?.includes(id) || false}
                    onChange={() => handleAmenityToggle(id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Offers */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.specialOffers}
                onChange={(e) => handleFilterChange('specialOffers', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                Show only properties with special offers
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleApplyFilters}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
} 