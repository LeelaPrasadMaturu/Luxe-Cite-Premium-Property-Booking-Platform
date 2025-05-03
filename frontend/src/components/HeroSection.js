'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const today = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setSearchParams(prev => ({
      ...prev,
      checkIn: newCheckIn,
      // Clear checkout if it's before the new check-in date
      checkOut: prev.checkOut && prev.checkOut < newCheckIn ? '' : prev.checkOut
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryString = new URLSearchParams(searchParams).toString();
    router.push(`/search?${queryString}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/luxury-hotel.jpg"
          alt="Luxury Hotel Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto">
            Discover luxury hotels and accommodations worldwide
          </p>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-white">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    placeholder="Where are you going?"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="check-in" className="block text-sm font-medium text-white">
                    Check-in
                  </label>
                  <input
                    type="date"
                    id="check-in"
                    min={today}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    value={searchParams.checkIn}
                    onChange={handleCheckInChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="check-out" className="block text-sm font-medium text-white">
                    Check-out
                  </label>
                  <input
                    type="date"
                    id="check-out"
                    min={searchParams.checkIn || today}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    value={searchParams.checkOut}
                    onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="guests" className="block text-sm font-medium text-white">
                    Guests
                  </label>
                  <select
                    id="guests"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    value={searchParams.guests}
                    onChange={(e) => setSearchParams({ ...searchParams, guests: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num} className="text-gray-900">
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Search Properties
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 