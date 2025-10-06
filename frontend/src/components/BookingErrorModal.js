'use client';

import { FaTimes, FaCalendarTimes, FaInfoCircle } from 'react-icons/fa';

export default function BookingErrorModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <FaCalendarTimes className="text-red-500 text-3xl mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Dates Unavailable</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="bg-red-50 text-red-700 rounded p-3 text-sm flex items-start">
            <FaInfoCircle className="mt-0.5 mr-2" />
            <p>{message || 'The selected dates are already booked. Please choose different dates.'}</p>
          </div>

          <ul className="mt-4 text-sm text-gray-700 list-disc list-inside space-y-1">
            <li>Try different check-in and check-out dates.</li>
            <li>Look for available gaps in the calendar.</li>
            <li>Consider adjusting the number of nights.</li>
          </ul>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




