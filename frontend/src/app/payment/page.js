'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaCreditCard, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [lockExpiry, setLockExpiry] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Get booking data from URL params
  useEffect(() => {
    const lockKey = searchParams.get('lockKey');
    const propertyId = searchParams.get('propertyId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const totalPrice = searchParams.get('totalPrice');

    if (!lockKey || !propertyId || !checkIn || !checkOut || !guests || !totalPrice) {
      router.push('/');
      return;
    }

    setBookingData({
      lockKey,
      propertyId,
      checkIn,
      checkOut,
      guests: parseInt(guests),
      totalPrice: parseFloat(totalPrice)
    });

    // Set lock expiry (10 minutes from now)
    const expiry = Date.now() + (10 * 60 * 1000);
    setLockExpiry(expiry);
  }, [searchParams, router]);

  // Countdown timer
  useEffect(() => {
    if (lockExpiry) {
      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((lockExpiry - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setError('Your booking session has expired. Please start over.');
          setTimeout(() => router.push('/'), 3000);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockExpiry, router]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTestPayment = async () => {
    if (!bookingData) return;

    setLoading(true);
    setError('');

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Confirm booking with lock
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/confirm`,
        {
          lockKey: bookingData.lockKey,
          guests: bookingData.guests,
          totalPrice: bookingData.totalPrice
        },
        {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        // Redirect to booking confirmation after 3 seconds
        setTimeout(() => {
          router.push(`/bookings/${response.data.booking._id}`);
        }, 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!bookingData) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/lock/${bookingData.lockKey}`,
        {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      );
    } catch (error) {
      console.error('Error releasing lock:', error);
    }

    router.back();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Invalid Booking Data</h2>
          <p className="text-gray-600 mb-4">Please start your booking process again.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Redirecting to booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
            <div className="flex items-center text-sm text-gray-600">
              <FaLock className="mr-1" />
              <span>Secure Payment</span>
            </div>
          </div>

          {/* Timer */}
          {timeRemaining > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">
                  Your booking session expires in {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          )}

          {/* Booking Summary */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{bookingData.guests}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span>Total Amount:</span>
                <span className="text-blue-600">${bookingData.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Payment Method</h2>
          
          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-blue-600 mr-2 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium text-sm">Payment Integration Notice</p>
                <p className="text-blue-700 text-sm mt-1">
                  We are currently integrating with real payment providers (Stripe, PayPal, etc.). 
                  For now, please use the test option below to complete your booking.
                </p>
              </div>
            </div>
          </div>

          {/* Test Payment Option */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCreditCard className="text-gray-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Test Payment</h3>
                  <p className="text-sm text-gray-600">Complete booking with test payment</p>
                </div>
              </div>
              <button
                onClick={handleTestPayment}
                disabled={loading || timeRemaining === 0}
                className={`px-6 py-2 rounded-lg font-medium ${
                  loading || timeRemaining === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel Booking
            </button>
            <div className="text-sm text-gray-500">
              Your booking is temporarily reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
