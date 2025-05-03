'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaBed, FaBath, FaWifi, FaSwimmingPool, FaParking, FaCalendarAlt } from 'react-icons/fa';
import { PropertyDetailsSkeleton } from '@/components/LoadingSkeleton';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from 'next-auth/react';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';

// Custom styles for the date picker
const customStyles = {
  input: {
    color: '#1f2937', // text-gray-900
    backgroundColor: 'white',
    border: '1px solid #e5e7eb', // border-gray-200
    borderRadius: '0.375rem', // rounded
    padding: '0.5rem', // p-2
    width: '100%',
  }
};

export default function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Invalid property ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`
          }
        });
        
        if (response.data.success) {
          setProperty(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch property details');
          setProperty(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch property details. Please try again later.');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, session]);

  // Add effect to check authentication status
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      // Clear any previous errors when authenticated
      setError(null);
    }
  }, [status, session]);

  // Calculate total price whenever dates, guests, or rooms change
  useEffect(() => {
    if (checkInDate && checkOutDate && property) {
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const requiredRooms = Math.ceil(guests / property.maxGuests);
      setNumberOfRooms(requiredRooms);
      const basePrice = property.price * nights * requiredRooms;
      setTotalPrice(basePrice);
    }
  }, [checkInDate, checkOutDate, property, guests]);

  const handleGuestChange = (e) => {
    const newGuests = parseInt(e.target.value);
    if (newGuests < 1) {
      setGuests(1);
      return;
    }
    setGuests(newGuests);
    setError(null);
  };

  const handleBooking = async () => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      const currentUrl = `/properties/${id}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (guests < 1) {
      setError('Please select number of guests');
      return;
    }

    try {
      // Calculate required rooms based on property's maxGuests
      const requiredRooms = Math.ceil(guests / property.maxGuests);
      const guestsPerRoom = Math.ceil(guests / requiredRooms);

      const bookingData = {
        propertyId: property._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        numberOfRooms: requiredRooms,
        guestsPerRoom,
        totalPrice,
        roomDetails: {
          totalRooms: requiredRooms,
          guestsPerRoom,
          maxGuestsPerRoom: property.maxGuests
        }
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        bookingData,
        {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBookingDetails(response.data.booking);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.status === 401) {
        // Store booking data in session storage before redirecting
        sessionStorage.setItem('pendingBooking', JSON.stringify({
          propertyId: id,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          numberOfRooms: Math.ceil(guests / property.maxGuests),
          guestsPerRoom: Math.ceil(guests / Math.ceil(guests / property.maxGuests)),
          totalPrice,
          roomDetails: {
            totalRooms: Math.ceil(guests / property.maxGuests),
            guestsPerRoom: Math.ceil(guests / Math.ceil(guests / property.maxGuests)),
            maxGuestsPerRoom: property.maxGuests
          }
        }));
        
        const currentUrl = `/properties/${id}`;
        router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      } else {
        setError(error.response?.data?.message || 'Error creating booking. Please try again.');
      }
    }
  };

  // Update the useEffect for pending bookings as well
  useEffect(() => {
    const handlePendingBooking = async () => {
      if (status === 'authenticated' && session?.accessToken) {
        const pendingBooking = sessionStorage.getItem('pendingBooking');
        if (pendingBooking) {
          try {
            const bookingData = JSON.parse(pendingBooking);
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
              bookingData,
              {
                headers: {
                  'Authorization': `Bearer ${session.accessToken}`
                }
              }
            );

            setBookingDetails(response.data.booking);
            setShowConfirmation(true);
            sessionStorage.removeItem('pendingBooking');
          } catch (error) {
            console.error('Error processing pending booking:', error);
            setError('Error processing your booking. Please try again.');
          }
        }
      }
    };

    handlePendingBooking();
  }, [status, session]);

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <a 
            href="/" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-[400px] w-full">
        <Image
          src={property?.images?.[selectedImage] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
          alt={property?.title || 'Property Image'}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <h1 className="text-3xl font-bold text-white">{property?.title || 'Loading...'}</h1>
          <div className="flex items-center text-white mt-2">
            <FaMapMarkerAlt className="mr-2" />
            <span>{property?.location || 'Location not available'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-lg font-semibold text-gray-900">
                    {property?.rating ? `${property.rating.toFixed(1)}` : 'New'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${property?.price || 0}
                  <span className="text-lg font-normal text-gray-600">/night</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-600 mb-6">{property?.description || 'No description available'}</p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {property?.amenities?.length > 0 ? (
                  property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center text-gray-600">
                      {amenity.toLowerCase().includes('wifi') && <FaWifi className="mr-2" />}
                      {amenity.toLowerCase().includes('pool') && <FaSwimmingPool className="mr-2" />}
                      {amenity.toLowerCase().includes('parking') && <FaParking className="mr-2" />}
                      {amenity.toLowerCase().includes('air') && <FaBath className="mr-2" />}
                      {amenity.toLowerCase().includes('kitchen') && <FaBed className="mr-2" />}
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No amenities listed</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ${property?.price || 0}
                <span className="text-lg font-normal text-gray-600">/night</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Check-in</label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => {+
                      setCheckInDate(date);
                      setError(null);
                    }}
                    className="w-full p-2 border border-gray-200 rounded text-gray-900 bg-white"
                    placeholderText="Select check-in date"
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Check-out</label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => {
                      setCheckOutDate(date);
                      setError(null);
                    }}
                    className="w-full p-2 border border-gray-200 rounded text-gray-900 bg-white"
                    placeholderText="Select check-out date"
                    minDate={checkInDate || new Date()}
                    dateFormat="MMMM d, yyyy"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Guests</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleGuestChange({ target: { value: guests - 1 } })}
                      disabled={guests <= 1}
                      className="p-2 border border-gray-200 rounded text-gray-900 hover:bg-gray-300 disabled:opacity-10"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={handleGuestChange}
                      className="w-full p-2 border border-gray-200 rounded text-gray-900 bg-white text-center"
                    />
                    <button
                      onClick={() => handleGuestChange({ target: { value: guests + 1 } })}
                      className="p-2 border border-gray-200 rounded text-gray-900 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {numberOfRooms} {numberOfRooms === 1 ? 'room' : 'rooms'} required for {guests} {guests === 1 ? 'guest' : 'guests'}
                  </p>
                </div>

                {error && (
                  <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">${property?.price || 0} x {Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))} nights x {numberOfRooms} {numberOfRooms === 1 ? 'room' : 'rooms'}</span>
                    <span className="text-gray-900">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!checkInDate || !checkOutDate || guests < 1}
                  className={`w-full py-3 rounded-lg text-white font-semibold ${
                    !checkInDate || !checkOutDate || guests < 1
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {status === 'loading' ? 'Loading...' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Thumbnails */}
        <div className="flex space-x-4 overflow-x-auto p-4">
          {property.images?.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Image
                src={image}
                alt={`${property.title} - Image ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && bookingDetails && (
        <BookingConfirmationModal
          booking={bookingDetails}
          onClose={() => {
            setShowConfirmation(false);
            router.push('/my-bookings');
          }}
        />
      )}
    </div>
  );
} 