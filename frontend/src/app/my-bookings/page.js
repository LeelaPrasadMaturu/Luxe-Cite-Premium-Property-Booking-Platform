'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchBookings() {
      if (session?.user?.id) {
        try {
          const headers = {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          };

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings`,
            {
              headers,
              withCredentials: true
            }
          );

          if (response.data.success) {
            setBookings(response.data.bookings || []);
            setError(null);
          } else {
            setError(response.data.message || 'Failed to fetch bookings');
            setBookings([]);
          }
        } catch (error) {
          if (error.response?.status === 401) {
            // Store booking data in session storage before redirecting
            sessionStorage.setItem('pendingBooking', JSON.stringify({
              propertyId: id,
              checkIn: checkInDate,
              checkOut: checkOutDate,
              guests,
              totalPrice
            }));
            
            const currentUrl = `/properties/${id}`;
            router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
          } else {
            setError(error.response?.data?.message || 'Failed to fetch bookings. Please try again.');
          }
          setBookings([]);
        } finally {
          setLoading(false);
        }
      }
    }

    if (session) {
      fetchBookings();
    }
  }, [session, router]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update the booking status in the local state
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel booking. Please try again.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-4 mt-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-800"
            >
              Log In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-4">
              {booking.property ? (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{booking.property.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'cancelled' 
                        ? 'bg-red-100 text-red-800'
                        : booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                    </span>
                  </div>
                  <div className="text-gray-600 space-y-2">
                    <p>Location: {booking.property.location}</p>
                    <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                    <p>Guests: {booking.guests}</p>
                    {booking.numberOfRooms > 1 && (
                      <p>Rooms: {booking.numberOfRooms}</p>
                    )}
                    <p className="font-semibold">Total: ${booking.totalPrice}</p>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => router.push(`/bookings/${booking._id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        View Details
                      </button>
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <p className="mb-2">This property is no longer available</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'cancelled' 
                        ? 'bg-red-100 text-red-800'
                        : booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                    </span>
                  </div>
                  <p>Booking ID: {booking._id}</p>
                  <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No bookings found.</p>
          <button
            onClick={() => router.push('/properties')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Properties
          </button>
        </div>
      )}
    </div>
  );
} 