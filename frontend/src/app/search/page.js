'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import PropertyCard from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/LoadingSkeleton';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (searchParams.get('location')) params.append('location', searchParams.get('location'));
        if (searchParams.get('checkIn')) params.append('checkIn', searchParams.get('checkIn'));
        if (searchParams.get('checkOut')) params.append('checkOut', searchParams.get('checkOut'));
        if (searchParams.get('guests')) params.append('guests', searchParams.get('guests'));
        if (searchParams.get('minPrice')) params.append('minPrice', searchParams.get('minPrice'));
        if (searchParams.get('maxPrice')) params.append('maxPrice', searchParams.get('maxPrice'));

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/properties/search?${params.toString()}`
        );
        
        setProperties(response.data);
        setError(null);
      } catch (err) {
        console.error('Error searching properties:', err);
        setError('Failed to fetch properties. Please try again later.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Search Results
          {searchParams.get('location') && ` for ${searchParams.get('location')}`}
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No properties found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 