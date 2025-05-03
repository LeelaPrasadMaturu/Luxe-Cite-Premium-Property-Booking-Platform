'use client';

import { 
  FiAward, 
  FiShield, 
  FiGlobe, 
  FiPhone, 
  FiInstagram, 
  FiFacebook, 
  FiTwitter,
  FiStar,
  FiFilter
} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import SearchForm from '@/components/SearchForm';
import AdvancedFilterSidebar from '@/components/AdvancedFilterSidebar';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProperties, setLoading, setError } from '@/store/slices/propertySlice';
import axios from 'axios';

export default function HomePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.properties.filters);
  const properties = useSelector((state) => state.properties.properties) || [];
  const loading = useSelector((state) => state.properties.loading);

  useEffect(() => {
    async function fetchProperties() {
      try {
        dispatch(setLoading(true));
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const queryParams = new URLSearchParams();
        
        // Add filter parameters to the query
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.checkIn) queryParams.append('checkIn', filters.checkIn);
        if (filters.checkOut) queryParams.append('checkOut', filters.checkOut);
        if (filters.guests) queryParams.append('guests', filters.guests);
        if (filters.priceRange) {
          queryParams.append('minPrice', filters.priceRange[0]);
          queryParams.append('maxPrice', filters.priceRange[1]);
        }
        if (filters.rating) queryParams.append('rating', filters.rating);
        if (filters.amenities?.length) queryParams.append('amenities', filters.amenities.join(','));
        if (filters.specialOffers) queryParams.append('specialOffers', 'true');

        const response = await axios.get(`${apiUrl}/api/properties?${queryParams.toString()}`);
        
        if (response.data.success) {
          dispatch(setProperties(response.data.properties || []));
          dispatch(setError(null));
        } else {
          dispatch(setError(response.data.message || 'Failed to fetch properties'));
          dispatch(setProperties([]));
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to fetch properties'));
        dispatch(setProperties([]));
      } finally {
        dispatch(setLoading(false));
      }
    }

    fetchProperties();
  }, [filters, dispatch]);

  return (
    <div className="min-h-screen">
      {/* Advanced Filter Sidebar */}
      <AdvancedFilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* Hero Section */}
      <div className="hero-section h-screen">
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <div className="text-center mb-8">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
              Luxury Redefined
            </span>
            <h1 className="text-6xl font-bold mb-6 text-center">Where Elegance Meets Comfort</h1>
            <p className="text-xl mb-4 text-center max-w-2xl">
              Discover a world of exceptional stays and unforgettable experiences
            </p>
            <div className="flex justify-center space-x-6 mt-6">
              <div className="text-center">
                <span className="block text-3xl font-bold">500+</span>
                <span className="text-sm">Luxury Hotels</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold">50+</span>
                <span className="text-sm">Destinations</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold">10k+</span>
                <span className="text-sm">Happy Guests</span>
              </div>
            </div>
          </div>
          {/* Search Form */}
          <SearchForm />
        </div>
      </div>

      {/* Why Choose LuxeStay Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose LuxeStay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <FiAward className="w-16 h-16 feature-icon mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Handpicked Hotels</h3>
              <p className="text-gray-600">Carefully curated selection of luxury accommodations</p>
            </div>
            <div className="text-center p-6">
              <FiGlobe className="w-16 h-16 feature-icon mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Global Reach</h3>
              <p className="text-gray-600">Access to premium properties worldwide</p>
            </div>
            <div className="text-center p-6">
              <FiShield className="w-16 h-16 feature-icon mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Verified Luxury Standards</h3>
              <p className="text-gray-600">Rigorous quality checks for every property</p>
            </div>
            <div className="text-center p-6">
              <FiPhone className="w-16 h-16 feature-icon mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">24/7 Concierge Support</h3>
              <p className="text-gray-600">Dedicated assistance whenever you need it</p>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Experience Showcase */}
      <div className="luxury-showcase py-32 relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Experience More Than Just a Stay</h2>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto">
            Indulge in world-class amenities, breathtaking views, and unparalleled service
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Luxury Suite"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Luxury Suites</h3>
              <p className="text-gray-600">Elegant accommodations with premium amenities</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
        <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Spa"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Spa & Wellness</h3>
              <p className="text-gray-600">Rejuvenating treatments and relaxation</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
            <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Dining"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Gourmet Dining</h3>
              <p className="text-gray-600">Exquisite culinary experiences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : Array.isArray(properties) && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link href={`/properties/${property._id}`} key={property._id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={property.images[0] || '/placeholder-property.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-2">{property.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold">${property.price}/night</span>
                      <div className="flex items-center">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span>{property.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No properties found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="testimonial-card p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">ER</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-semibold text-gray-800 text-xl">Emma R.</h4>
                  <div className="flex text-yellow-500 mt-2">
                    <FiStar /><FiStar /><FiStar /><FiStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg italic">
                "LuxeStay made our honeymoon flawless—seamless booking and breathtaking views!"
              </p>
            </div>
            <div className="testimonial-card p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">JD</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-semibold text-gray-800 text-xl">John D.</h4>
                  <div className="flex text-yellow-500 mt-2">
                    <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg italic">
                "The attention to detail and exceptional service made our stay unforgettable."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LuxeStay</h3>
              <p className="text-gray-400">Where luxury meets comfort, creating unforgettable experiences.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-400">Email: info@luxestay.com</p>
              <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="social-icon text-gray-400 hover:text-white">
                  <FiInstagram size={24} />
                </a>
                <a href="#" className="social-icon text-gray-400 hover:text-white">
                  <FiFacebook size={24} />
                </a>
                <a href="#" className="social-icon text-gray-400 hover:text-white">
                  <FiTwitter size={24} />
                </a>
                <a href="#" className="social-icon text-gray-400 hover:text-white">
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LuxeStay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


