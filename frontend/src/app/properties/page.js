'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setProperties, updateFilters } from '@/store/slices/propertySlice';
import PropertyCard from '@/components/PropertyCard';
import FilterSidebar from '@/components/FilterSidebar';
import { useSearchParams } from 'next/navigation';

export default function PropertiesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  const searchParams = useSearchParams();

  // Handle URL parameters on initial load
  useEffect(() => {
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    if (location || checkIn || checkOut || guests) {
      dispatch(updateFilters({
        location: location || '',
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        guests: guests ? parseInt(guests) : 1,
        priceRange: [0, 1500],
        rating: 0,
        amenities: [],
        specialOffers: false
      }));
    }
  }, [searchParams, dispatch]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('Fetching properties with filters:', filters);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
        {
          params: {
            location: filters.location,
            minPrice: filters.priceRange?.[0],
            maxPrice: filters.priceRange?.[1],
            guests: filters.guests,
            checkIn: filters.checkIn,
            checkOut: filters.checkOut,
            rating: filters.rating,
            amenities: filters.amenities?.join(','),
            specialOffers: filters.specialOffers
          },
          headers: user ? {
            Authorization: `Bearer ${user.token}`
          } : {}
        }
      );

      console.log('API Response:', response.data);

      if (response.data.success) {
        dispatch(setProperties(response.data.properties));
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch properties');
        dispatch(setProperties([]));
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.response?.data?.message || 'Error loading properties');
      dispatch(setProperties([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current properties in Redux:', properties);
    fetchProperties();
  }, [filters, dispatch]);

  const handleFilterChange = (newFilters) => {
    dispatch(updateFilters(newFilters));
  };

  const properties = useSelector((state) => state.properties.properties) || [];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Available Properties</h1>
            {filters.location && (
              <p className="text-gray-600 mt-1">Showing results for "{filters.location}"</p>
            )}
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Filters
          </button>
        </div>

        {/* Properties Grid */}
        <div className="flex-1">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : Array.isArray(properties) && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 