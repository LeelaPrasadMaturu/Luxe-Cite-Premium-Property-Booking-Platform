'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { gql, useMutation } from '@apollo/client';

const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $propertyId: ID!
    $checkIn: String!
    $checkOut: String!
    $guests: Int!
    $totalPrice: Float!
  ) {
    createBooking(
      propertyId: $propertyId
      checkIn: $checkIn
      checkOut: $checkOut
      guests: $guests
      totalPrice: $totalPrice
    ) {
      id
      status
      checkIn
      checkOut
      guests
      totalPrice
      property {
        id
        title
      }
    }
  }
`;

export default function BookingForm({ property }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [createBooking] = useMutation(CREATE_BOOKING);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights * property.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('Please log in to make a booking');
      setLoading(false);
      return;
    }

    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select check-in and check-out dates');
      setLoading(false);
      return;
    }

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);

    if (checkIn >= checkOut) {
      setError('Check-out date must be after check-in date');
      setLoading(false);
      return;
    }

    if (checkIn < new Date()) {
      setError('Check-in date cannot be in the past');
      setLoading(false);
      return;
    }

    if (formData.guests > property.maxGuests) {
      setError(`Maximum ${property.maxGuests} guests allowed`);
      setLoading(false);
      return;
    }

    try {
      const { data } = await createBooking({
        variables: {
          propertyId: property.id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: parseInt(formData.guests),
          totalPrice: calculateTotalPrice(),
        },
      });

      router.push(`/bookings/${data.createBooking.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Book this property
        </h2>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${property.price}
          </span>
          <span className="text-gray-600 dark:text-gray-400">per night</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Check-in
          </label>
          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Check-out
          </label>
          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            min={formData.checkIn || new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Guests
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max={property.maxGuests}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {calculateTotalPrice() > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400">Total price</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ${calculateTotalPrice()}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Includes taxes and fees
          </p>
        </div>
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>

      {!user && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          You need to be logged in to make a booking
        </p>
      )}
    </form>
  );
} 