'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    maxGuests: '',
    images: ['/images/default-property.jpg'], // Default image
    amenities: [],
    rating: 0,
    hasSpecialOffer: false,
    specialOfferDetails: ''
  });
  const { token, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    fetchProperties();
  }, [token, user, router]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/properties/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const propertiesData = Array.isArray(response.data.properties) ? response.data.properties : [];
      setProperties(propertiesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.response?.data?.message || 'Error fetching properties');
      setLoading(false);
      setProperties([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert string values to numbers where needed
      const propertyData = {
        ...newProperty,
        price: Number(newProperty.price),
        maxGuests: Number(newProperty.maxGuests),
        rating: Number(newProperty.rating)
      };

      const response = await axios.post(`${apiUrl}/api/properties`, propertyData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Property added successfully:', response.data);
      
      // Reset form
      setNewProperty({
        title: '',
        description: '',
        price: '',
        location: '',
        maxGuests: '',
        images: ['/images/default-property.jpg'],
        amenities: [],
        rating: 0,
        hasSpecialOffer: false,
        specialOfferDetails: ''
      });

      // Refresh properties list
      fetchProperties();
    } catch (err) {
      console.error('Error adding property:', err);
      setError(err.response?.data?.message || 'Error adding property');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchProperties();
    } catch (err) {
      console.error('Error deleting property:', err);
      setError(err.response?.data?.message || 'Error deleting property');
    }
  };

  if (loading) return <div className="text-black">Loading...</div>;
  if (error) return <div className="text-black">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Manage Properties</h1>
      
      {/* Add Property Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              value={newProperty.title}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Property Title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              required
              value={newProperty.location}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Property Location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              value={newProperty.price}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
            <input
              type="number"
              name="maxGuests"
              required
              min="1"
              value={newProperty.maxGuests}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Maximum Guests"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              required
              value={newProperty.description}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Property Description"
              rows="3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Offer Details</label>
            <textarea
              name="specialOfferDetails"
              value={newProperty.specialOfferDetails}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Special Offer Details (optional)"
              rows="2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasSpecialOffer"
              checked={newProperty.hasSpecialOffer}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600"
            />
            <label className="ml-2 text-sm text-gray-700">Has Special Offer</label>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Property
          </button>
        </div>
      </form>

      {/* Properties Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-black font-semibold">Title</th>
              <th className="py-2 text-black font-semibold">Location</th>
              <th className="py-2 text-black font-semibold">Price</th>
              <th className="py-2 text-black font-semibold">Max Guests</th>
              <th className="py-2 text-black font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(properties) && properties.length > 0 ? (
              properties.map((property) => (
                <tr key={property._id} className="border-t">
                  <td className="py-2 text-black">{property.title}</td>
                  <td className="py-2 text-black">{property.location}</td>
                  <td className="py-2 text-black">${property.price}</td>
                  <td className="py-2 text-black">{property.maxGuests}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-black">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 