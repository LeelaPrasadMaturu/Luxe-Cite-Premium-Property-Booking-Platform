'use client';

import { format } from 'date-fns';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

export default function BookingConfirmationModal({ booking, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-3xl mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {booking.property.title}
              </h3>
              <p className="text-gray-600">{booking.property.location}</p>
            </div>

            <div className="border-t border-b border-gray-200 py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Number</span>
                <span className="font-medium text-gray-900">{booking.bookingNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Guests</span>
                <span className="font-medium text-gray-900">{booking.numberOfGuests}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Rooms</span>
                <span className="font-medium text-gray-900">{booking.numberOfRooms}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">
                ${booking.totalPrice}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View My Bookings
            </button>
            <p className="text-sm text-gray-500 text-center">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 