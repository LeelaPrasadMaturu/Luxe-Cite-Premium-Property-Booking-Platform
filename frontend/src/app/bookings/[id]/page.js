'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { format } from 'date-fns';
import { FaCalendarAlt, FaUsers, FaDoorOpen, FaMoneyBillWave, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function BookingDetailsPage() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchBooking() {
      if (session?.accessToken && id) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          if (response.data.success) {
            setBooking(response.data.booking);
            setError(null);
          } else {
            setError(response.data.message || 'Failed to fetch booking details');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch booking details. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    }

    if (session) {
      fetchBooking();
    }
  }, [session, id]);

  const handleCancelBooking = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        }
      );
      setShowCancelModal(false);
      fetchBooking(); // Refresh booking details
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking. Please try again later.');
    }
  };

  const CancelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Booking</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowCancelModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Keep Booking
          </button>
          <button
            onClick={handleCancelBooking}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {error || 'Booking not found'}
            </h2>
            <button
              onClick={() => router.push('/my-bookings')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  const isUpcoming = new Date(booking.checkIn) > new Date();

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <button
            onClick={() => router.push('/my-bookings')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to My Bookings
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Property Image and Basic Info */}
          <div className="relative h-64">
            <Image
              src={booking.property.images[0]}
              alt={booking.property.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {booking.property.title}
              </h2>
              <div className="flex items-center text-white">
                <FaMapMarkerAlt className="mr-2" />
                <span>{booking.property.location}</span>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="p-6">
            {/* Status and Booking Number */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-700">Booking Number</p>
                <p className="text-lg font-semibold text-gray-900">{booking.bookingNumber}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
            </div>

            {/* Dates and Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-700">Check-in</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.checkIn), 'EEEE, MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-700">Check-out</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.checkOut), 'EEEE, MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUsers className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-700">Guests</p>
                    <p className="font-medium text-gray-900">{booking.numberOfGuests} guests</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaDoorOpen className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-700">Rooms</p>
                    <p className="font-medium text-gray-900">{booking.numberOfRooms} rooms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Price per night</span>
                  <span className="text-gray-900">${booking.property.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Number of nights</span>
                  <span className="text-gray-900">{Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Number of rooms</span>
                  <span className="text-gray-900">{booking.numberOfRooms}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">${booking.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaPhone className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-700">Phone</p>
                    <p className="font-medium text-gray-900">{booking.property.contactPhone || 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-700">Email</p>
                    <p className="font-medium text-gray-900">{booking.property.contactEmail || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {isUpcoming && canCancel && (
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Cancel Booking
                </button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Free cancellation until 24 hours before check-in
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && <CancelModal />}
    </div>
  );
} 